import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { RESOURCES, ResourceDef, Row, slugify } from './resources';
import { reorderSchema } from './schemas';
import { ZodBodyPipe } from './zod-body.pipe';

@Controller('admin/cms')
@UseGuards(JwtAuthGuard)
export class AdminCmsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':resource')
  async list(@Param('resource') name: string): Promise<Row[]> {
    const def = this.resolve(name);
    const rows = await def.delegate(this.prisma).findMany({ orderBy: def.orderBy, include: this.include(def) });
    return rows.map((row) => this.serialize(def, row));
  }

  @Post(':resource')
  async create(@Param('resource') name: string, @Body() body: unknown): Promise<Row> {
    const def = this.resolve(name);
    const input = this.parse(def, body, false);
    const delegate = def.delegate(this.prisma);

    if (def.slugFrom) {
      const source = String(input[def.slugFrom]);
      input.slug = await this.uniqueSlug(def, typeof input.slug === 'string' ? input.slug : slugify(source));
    }
    if (input.displayOrder === undefined && 'displayOrder' in def.schema.shape) {
      const last = await delegate.findFirst({ orderBy: { displayOrder: 'desc' }, select: { displayOrder: true } });
      input.displayOrder = ((last?.displayOrder as number | undefined) ?? -1) + 1;
    }

    const row = await this.guard(() => delegate.create({ data: this.toData(def, input, 'connect'), include: this.include(def) }));
    return this.serialize(def, row);
  }

  @Put(':resource/order')
  @HttpCode(204)
  async reorder(@Param('resource') name: string, @Body(new ZodBodyPipe(reorderSchema)) body: { ids: string[] }): Promise<void> {
    const def = this.resolve(name);
    if (!('displayOrder' in def.schema.shape)) throw new NotFoundException();
    await this.prisma.$transaction(async (tx) => {
      const delegate = def.delegate(tx);
      for (const [index, id] of body.ids.entries()) {
        await delegate.update({ where: { id }, data: { displayOrder: index } });
      }
    });
  }

  @Patch(':resource/:id')
  async update(@Param('resource') name: string, @Param('id') id: string, @Body() body: unknown): Promise<Row> {
    const def = this.resolve(name);
    const input = this.parse(def, body, true);
    if (def.slugFrom && input.slug === undefined) delete input.slug;

    const row = await this.guard(() =>
      def.delegate(this.prisma).update({ where: { id }, data: this.toData(def, input, 'set'), include: this.include(def) }),
    );
    return this.serialize(def, row);
  }

  @Delete(':resource/:id')
  @HttpCode(204)
  async remove(@Param('resource') name: string, @Param('id') id: string): Promise<void> {
    await this.guard(() => this.resolve(name).delegate(this.prisma).delete({ where: { id } }));
  }

  private resolve(name: string): ResourceDef {
    const def = Object.hasOwn(RESOURCES, name) ? RESOURCES[name] : undefined;
    if (!def) throw new NotFoundException('Unknown resource.');
    return def;
  }

  private parse(def: ResourceDef, body: unknown, partial: boolean): Row {
    const schema = partial ? def.schema.partial() : def.schema;
    return { ...(new ZodBodyPipe(schema).transform(body) as Row) };
  }

  private include(def: ResourceDef): Record<string, unknown> | undefined {
    if (!def.relations) return undefined;
    return Object.fromEntries(Object.values(def.relations).map((field) => [field, { select: { id: true } }]));
  }

  private toData(def: ResourceDef, input: Row, mode: 'connect' | 'set'): Row {
    const data: Row = { ...input };
    for (const [inputField, relation] of Object.entries(def.relations ?? {})) {
      const ids = data[inputField] as string[] | undefined;
      delete data[inputField];
      if (ids) data[relation] = { [mode]: ids.map((id) => ({ id })) };
    }
    return data;
  }

  private serialize(def: ResourceDef, row: Row): Row {
    const out: Row = { ...row };
    for (const [inputField, relation] of Object.entries(def.relations ?? {})) {
      out[inputField] = ((row[relation] as { id: string }[] | undefined) ?? []).map((item) => item.id);
      delete out[relation];
    }
    return out;
  }

  private async uniqueSlug(def: ResourceDef, base: string): Promise<string> {
    const delegate = def.delegate(this.prisma);
    let candidate = base;
    for (let suffix = 2; await delegate.findUnique({ where: { slug: candidate }, select: { id: true } }); suffix += 1) {
      candidate = `${base}-${suffix}`;
    }
    return candidate;
  }

  private async guard<T>(action: () => Promise<T>): Promise<T> {
    try {
      return await action();
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') throw new ConflictException('That slug or key is already in use.');
        if (error.code === 'P2025') throw new NotFoundException('Item not found.');
      }
      throw error;
    }
  }
}
