import {
  BadRequestException,
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
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { PlatformType, Prisma } from '@prisma/client';
import type { z } from 'zod';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { slugify } from '../cms/resources';
import { reorderSchema } from '../cms/schemas';
import { ZodBodyPipe } from '../cms/zod-body.pipe';
import { PrismaService } from '../prisma/prisma.service';
import { collectionSchemas, demoCreateSchema, demoUpdateSchema, platformSchema } from './demo-schemas';

type CollectionName = keyof typeof collectionSchemas;
type DemoInput = Record<string, unknown> & { slug?: string; relatedIds?: string[]; estimatorFeatureIds?: string[]; status?: string };

const listSelect = {
  id: true,
  slug: true,
  name: true,
  internalName: true,
  status: true,
  statusLabel: true,
  featured: true,
  active: true,
  displayOrder: true,
  badge: true,
  thumbnailUrl: true,
  categoryId: true,
  industryId: true,
  updatedAt: true,
  category: { select: { id: true, name: true } },
  industry: { select: { id: true, name: true } },
  platforms: { select: { type: true, enabled: true } },
} satisfies Prisma.DemoSelect;

const order = [{ displayOrder: 'asc' }, { id: 'asc' }] satisfies Prisma.DemoFeatureOrderByWithRelationInput[];

@Controller('admin/demos')
@UseGuards(JwtAuthGuard)
export class AdminDemosController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  list() {
    return this.prisma.demo.findMany({ orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }], select: listSelect });
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const demo = await this.prisma.demo.findUnique({
      where: { id },
      include: {
        platforms: { include: { technologies: { select: { id: true } } } },
        features: { orderBy: order },
        modules: { orderBy: order },
        screenshots: { orderBy: order },
        points: { orderBy: order },
        related: { select: { id: true } },
        estimatorFeatures: { select: { id: true } },
      },
    });
    if (!demo) throw new NotFoundException();
    const { related, platforms, estimatorFeatures, ...rest } = demo;
    return {
      ...rest,
      relatedIds: related.map((r) => r.id),
      estimatorFeatureIds: estimatorFeatures.map((f) => f.id),
      platforms: platforms.map(({ technologies, ...platform }) => ({ ...platform, technologyIds: technologies.map((t) => t.id) })),
    };
  }

  @Post()
  async create(@Body(new ZodBodyPipe(demoCreateSchema)) body: DemoInput) {
    const { relatedIds, estimatorFeatureIds, slug, ...data } = body;
    if (data.status === 'PUBLISHED') data.status = 'DRAFT';
    const last = await this.prisma.demo.findFirst({ orderBy: { displayOrder: 'desc' }, select: { displayOrder: true } });
    if (slug && (await this.prisma.demo.findUnique({ where: { slug }, select: { id: true } }))) {
      throw new ConflictException('That slug is already in use.');
    }
    const finalSlug = slug ?? (await this.uniqueSlug(slugify(String(data.name))));
    const related = await this.existing(relatedIds ?? []);
    const features = await this.existingFeatures(estimatorFeatureIds ?? []);
    return this.guard(() =>
      this.prisma.demo.create({
        data: {
          ...(data as Prisma.DemoCreateInput),
          slug: finalSlug,
          displayOrder: (data.displayOrder as number | undefined) ?? (last?.displayOrder ?? -1) + 1,
          related: { connect: related },
          estimatorFeatures: { connect: features },
          platforms: { create: [{ type: 'WEBSITE', enabled: true }, { type: 'MOBILE', enabled: false }] },
        },
        select: { id: true, slug: true },
      }),
    );
  }

  @Put('order')
  @HttpCode(204)
  async reorder(@Body(new ZodBodyPipe(reorderSchema)) body: { ids: string[] }) {
    await this.prisma.$transaction(body.ids.map((id, displayOrder) => this.prisma.demo.update({ where: { id }, data: { displayOrder } })));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body(new ZodBodyPipe(demoUpdateSchema)) body: DemoInput) {
    const { relatedIds, estimatorFeatureIds, ...data } = body;
    const current = await this.prisma.demo.findUnique({ where: { id }, select: { slug: true, publishedAt: true, status: true } });
    if (!current) throw new NotFoundException();
    if (data.slug === undefined) delete data.slug;

    if ((data.status ?? current.status) === 'PUBLISHED') {
      await this.assertPublishable(id);
      if (!current.publishedAt) data.publishedAt = new Date();
    }
    const related = relatedIds ? { set: await this.existing(relatedIds.filter((r) => r !== id)) } : undefined;
    const estimatorFeatures = estimatorFeatureIds ? { set: await this.existingFeatures(estimatorFeatureIds) } : undefined;
    return this.guard(() =>
      this.prisma.demo.update({ where: { id }, data: { ...(data as Prisma.DemoUpdateInput), related, estimatorFeatures }, select: listSelect }),
    );
  }

  @Put(':id/platforms/:type')
  async savePlatform(
    @Param('id') id: string,
    @Param('type') rawType: string,
    @Body(new ZodBodyPipe(platformSchema)) body: PlatformBody,
  ) {
    const type = rawType.toUpperCase();
    if (type !== 'WEBSITE' && type !== 'MOBILE') throw new BadRequestException('Unknown platform.');
    const demo = await this.prisma.demo.findUnique({ where: { id }, select: { status: true, platforms: { select: { type: true, enabled: true } } } });
    if (!demo) throw new NotFoundException();

    const { technologyIds, ...data } = body;
    const otherEnabled = demo.platforms.some((p) => p.type !== type && p.enabled);
    if (demo.status === 'PUBLISHED' && !data.enabled && !otherEnabled) {
      throw new UnprocessableEntityException('A published demo needs at least one enabled platform.');
    }
    const technologies = { set: await this.existingTech(technologyIds) };
    const platformType = type as PlatformType;
    await this.prisma.demoPlatform.upsert({
      where: { demoId_type: { demoId: id, type: platformType } },
      update: { ...data, technologies },
      create: { ...data, demoId: id, type: platformType, technologies: { connect: technologies.set } },
    });
    return { ok: true };
  }

  @Put(':id/:collection')
  async saveCollection(@Param('id') id: string, @Param('collection') name: string, @Body() body: unknown) {
    if (!Object.hasOwn(collectionSchemas, name)) throw new NotFoundException();
    const collection = name as CollectionName;
    const rows = new ZodBodyPipe(collectionSchemas[collection] as z.ZodType<Record<string, unknown>[]>).transform(body);
    if (!(await this.prisma.demo.findUnique({ where: { id }, select: { id: true } }))) throw new NotFoundException();

    const data = rows.map((row, displayOrder) => ({ ...row, demoId: id, displayOrder }));
    await this.prisma.$transaction(async (tx) => {
      switch (collection) {
        case 'features':
          await tx.demoFeature.deleteMany({ where: { demoId: id } });
          await tx.demoFeature.createMany({ data: data as Prisma.DemoFeatureCreateManyInput[] });
          break;
        case 'modules':
          await tx.demoModule.deleteMany({ where: { demoId: id } });
          await tx.demoModule.createMany({ data: data as Prisma.DemoModuleCreateManyInput[] });
          break;
        case 'screenshots':
          await tx.demoScreenshot.deleteMany({ where: { demoId: id } });
          await tx.demoScreenshot.createMany({ data: data as Prisma.DemoScreenshotCreateManyInput[] });
          break;
        case 'points':
          await tx.demoPoint.deleteMany({ where: { demoId: id } });
          await tx.demoPoint.createMany({ data: data as Prisma.DemoPointCreateManyInput[] });
          break;
      }
    });
    return { ok: true, count: data.length };
  }

  @Post(':id/duplicate')
  async duplicate(@Param('id') id: string) {
    const source = await this.prisma.demo.findUnique({
      where: { id },
      include: {
        platforms: { include: { technologies: { select: { id: true } } } },
        features: true,
        modules: true,
        screenshots: true,
        points: true,
        related: { select: { id: true } },
        estimatorFeatures: { select: { id: true } },
      },
    });
    if (!source) throw new NotFoundException();
    const last = await this.prisma.demo.findFirst({ orderBy: { displayOrder: 'desc' }, select: { displayOrder: true } });
    const strip = <T extends { id: string; demoId: string }>({ id: _id, demoId: _demoId, ...rest }: T) => rest;

    return this.prisma.demo.create({
      data: {
        name: `${source.name} (Copy)`,
        slug: await this.uniqueSlug(`${source.slug}-copy`),
        internalName: source.internalName,
        shortDescription: source.shortDescription,
        fullDescription: source.fullDescription,
        categoryId: source.categoryId,
        industryId: source.industryId,
        status: 'DRAFT',
        statusLabel: source.statusLabel,
        featured: false,
        active: source.active,
        coverImageUrl: source.coverImageUrl,
        thumbnailUrl: source.thumbnailUrl,
        badge: source.badge,
        displayOrder: (last?.displayOrder ?? -1) + 1,
        problem: source.problem,
        solution: source.solution,
        targetUsers: source.targetUsers,
        targetBusinesses: source.targetBusinesses,
        outcomes: source.outcomes,
        highlight: source.highlight,
        ctaLabel: source.ctaLabel,
        ctaUrl: source.ctaUrl,
        metaTitle: source.metaTitle,
        metaDescription: source.metaDescription,
        ogImageUrl: source.ogImageUrl,
        noindex: true,
        related: { connect: source.related },
        estimatorFeatures: { connect: source.estimatorFeatures },
        platforms: {
          create: source.platforms.map(({ technologies, ...platform }) => ({ ...strip(platform), technologies: { connect: technologies } })),
        },
        features: { create: source.features.map(strip) },
        modules: { create: source.modules.map(strip) },
        screenshots: { create: source.screenshots.map(strip) },
        points: { create: source.points.map(strip) },
      },
      select: { id: true, slug: true },
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.guard(() => this.prisma.demo.delete({ where: { id } }));
  }

  private async assertPublishable(id: string) {
    const enabled = await this.prisma.demoPlatform.count({ where: { demoId: id, enabled: true } });
    if (enabled === 0) throw new UnprocessableEntityException('Enable at least one platform before publishing.');
  }

  private async existing(ids: string[]) {
    return this.prisma.demo.findMany({ where: { id: { in: ids } }, select: { id: true } });
  }

  private async existingFeatures(ids: string[]) {
    return this.prisma.estimatorFeature.findMany({ where: { id: { in: ids } }, select: { id: true } });
  }

  private async existingTech(ids: string[]) {
    return this.prisma.technology.findMany({ where: { id: { in: ids } }, select: { id: true } });
  }

  private async uniqueSlug(base: string): Promise<string> {
    let candidate = base;
    for (let n = 2; await this.prisma.demo.findUnique({ where: { slug: candidate }, select: { id: true } }); n += 1) candidate = `${base}-${n}`;
    return candidate;
  }

  private async guard<T>(action: () => Promise<T>): Promise<T> {
    try {
      return await action();
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') throw new ConflictException('That slug is already in use.');
        if (error.code === 'P2025') throw new NotFoundException('Demo not found.');
      }
      throw error;
    }
  }
}

type PlatformBody = z.infer<typeof platformSchema>;
