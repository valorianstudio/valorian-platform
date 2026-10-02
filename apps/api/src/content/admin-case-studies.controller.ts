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
  Query,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { ContentStatus, Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { slugify } from '../cms/resources';
import { ZodBodyPipe } from '../cms/zod-body.pipe';
import { PrismaService } from '../prisma/prisma.service';
import { caseMediaSchema, caseStudyCreateSchema, caseStudyUpdateSchema } from './content-schemas';

type Input = Record<string, unknown> & { slug?: string; serviceIds?: string[]; technologyIds?: string[]; demoIds?: string[]; status?: ContentStatus; publishedAt?: Date | null; clientApproved?: boolean };

const PAGE_SIZE = 15;
const listSelect = {
  id: true,
  slug: true,
  title: true,
  clientName: true,
  status: true,
  featured: true,
  publishedAt: true,
  updatedAt: true,
  coverImageUrl: true,
  industry: { select: { name: true } },
} satisfies Prisma.CaseStudySelect;

@Controller('admin/case-studies')
@UseGuards(JwtAuthGuard)
export class AdminCaseStudiesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async list(@Query() query: { q?: string; status?: string; featured?: string; industry?: string; sort?: string; page?: string }) {
    const page = Math.max(1, Number.parseInt(query.page ?? '1', 10) || 1);
    const q = query.q?.trim();
    const where: Prisma.CaseStudyWhereInput = {
      ...(query.status && Object.hasOwn(ContentStatus, query.status) ? { status: query.status as ContentStatus } : {}),
      ...(query.featured === '1' ? { featured: true } : {}),
      ...(query.industry ? { industryId: query.industry } : {}),
      ...(q ? { OR: [{ title: { contains: q, mode: 'insensitive' } }, { clientName: { contains: q, mode: 'insensitive' } }, { slug: { contains: q, mode: 'insensitive' } }] } : {}),
    };
    const orderBy: Prisma.CaseStudyOrderByWithRelationInput[] = query.sort === 'title' ? [{ title: 'asc' }] : query.sort === 'published' ? [{ publishedAt: { sort: 'desc', nulls: 'last' } }] : query.sort === 'order' ? [{ displayOrder: 'asc' }] : [{ updatedAt: 'desc' }];
    const [items, total] = await Promise.all([
      this.prisma.caseStudy.findMany({ where, orderBy, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE, select: listSelect }),
      this.prisma.caseStudy.count({ where }),
    ]);
    return { items, total, page, pageSize: PAGE_SIZE };
  }

  @Get('options')
  options() {
    return this.prisma.caseStudy.findMany({ orderBy: { title: 'asc' }, select: { id: true, title: true } });
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const row = await this.prisma.caseStudy.findUnique({
      where: { id },
      include: {
        services: { select: { id: true } },
        technologies: { select: { id: true } },
        demos: { select: { id: true } },
        media: { orderBy: [{ displayOrder: 'asc' }, { id: 'asc' }] },
      },
    });
    if (!row) throw new NotFoundException();
    const { services, technologies, demos, ...rest } = row;
    return { ...rest, serviceIds: services.map((s) => s.id), technologyIds: technologies.map((t) => t.id), demoIds: demos.map((d) => d.id) };
  }

  @Post()
  async create(@Body(new ZodBodyPipe(caseStudyCreateSchema)) body: Input) {
    const { serviceIds, technologyIds, demoIds, slug, ...data } = body;
    this.assertPublishable(data.status, data.clientApproved);
    if (slug && (await this.prisma.caseStudy.findUnique({ where: { slug }, select: { id: true } }))) throw new ConflictException('That slug is already in use.');
    const finalSlug = slug ?? (await this.uniqueSlug(slugify(String(data.title))));
    const last = await this.prisma.caseStudy.findFirst({ orderBy: { displayOrder: 'desc' }, select: { displayOrder: true } });
    const row = await this.prisma.caseStudy.create({
      data: {
        ...(data as Prisma.CaseStudyUncheckedCreateInput),
        slug: finalSlug,
        publishedAt: data.status === 'PUBLISHED' ? (data.publishedAt ?? new Date()) : (data.publishedAt ?? null),
        displayOrder: (data.displayOrder as number | undefined) ?? (last?.displayOrder ?? -1) + 1,
        services: { connect: await this.ids(this.prisma.service, serviceIds) },
        technologies: { connect: await this.ids(this.prisma.technology, technologyIds) },
        demos: { connect: await this.ids(this.prisma.demo, demoIds) },
      },
      select: { id: true, slug: true },
    });
    return row;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body(new ZodBodyPipe(caseStudyUpdateSchema)) body: Input) {
    const current = await this.prisma.caseStudy.findUnique({ where: { id }, select: { status: true, publishedAt: true, clientApproved: true } });
    if (!current) throw new NotFoundException();
    const { serviceIds, technologyIds, demoIds, ...data } = body;
    if (data.slug === undefined) delete data.slug;
    const status = data.status ?? current.status;
    this.assertPublishable(status, data.clientApproved ?? current.clientApproved);
    if (status === 'PUBLISHED' && data.publishedAt === undefined && !current.publishedAt) data.publishedAt = new Date();
    if (status === 'PUBLISHED' && data.publishedAt === null) data.publishedAt = current.publishedAt ?? new Date();
    try {
      await this.prisma.caseStudy.update({
        where: { id },
        data: {
          ...(data as Prisma.CaseStudyUncheckedUpdateInput),
          ...(serviceIds ? { services: { set: await this.ids(this.prisma.service, serviceIds) } } : {}),
          ...(technologyIds ? { technologies: { set: await this.ids(this.prisma.technology, technologyIds) } } : {}),
          ...(demoIds ? { demos: { set: await this.ids(this.prisma.demo, demoIds) } } : {}),
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new ConflictException('That slug is already in use.');
      throw error;
    }
    return { ok: true };
  }

  @Put(':id/media')
  async saveMedia(@Param('id') id: string, @Body(new ZodBodyPipe(caseMediaSchema)) rows: ReturnType<typeof caseMediaSchema.parse>) {
    if (!(await this.prisma.caseStudy.findUnique({ where: { id }, select: { id: true } }))) throw new NotFoundException();
    await this.prisma.$transaction([
      this.prisma.caseStudyMedia.deleteMany({ where: { caseStudyId: id } }),
      this.prisma.caseStudyMedia.createMany({ data: rows.map((row, displayOrder) => ({ ...row, caseStudyId: id, displayOrder })) }),
    ]);
    return { ok: true, count: rows.length };
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    try {
      await this.prisma.caseStudy.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') throw new NotFoundException();
      throw error;
    }
  }

  private assertPublishable(status: ContentStatus | undefined, approved: boolean | undefined) {
    if (status === 'PUBLISHED' && !approved) {
      throw new UnprocessableEntityException('Confirm this is real client work approved for public display before publishing.');
    }
  }

  private async ids(delegate: { findMany(args: { where: { id: { in: string[] } }; select: { id: true } }): Promise<{ id: string }[]> }, ids: string[] | undefined) {
    return ids?.length ? delegate.findMany({ where: { id: { in: ids } }, select: { id: true } }) : [];
  }

  private async uniqueSlug(base: string): Promise<string> {
    let candidate = base;
    for (let n = 2; await this.prisma.caseStudy.findUnique({ where: { slug: candidate }, select: { id: true } }); n += 1) candidate = `${base}-${n}`;
    return candidate;
  }
}
