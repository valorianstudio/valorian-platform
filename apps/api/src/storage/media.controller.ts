import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import type { FastifyReply } from 'fastify';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ZodBodyPipe } from '../cms/zod-body.pipe';
import { mediaUpdateSchema } from '../content/content-schemas';
import { PrismaService } from '../prisma/prisma.service';
import { detectImage, imageSize, MAX_UPLOAD_BYTES, newObjectKey, StorageService } from './storage.service';

const PAGE_SIZE = 24;

/** Every column that can hold a media URL. Identifiers are static; only the URL is parameterised. */
const USAGE: [table: string, column: string][] = [
  ['Demo', 'coverImageUrl'], ['Demo', 'thumbnailUrl'], ['Demo', 'ogImageUrl'], ['DemoScreenshot', 'url'],
  ['CaseStudy', 'coverImageUrl'], ['CaseStudy', 'featuredImageUrl'], ['CaseStudy', 'clientLogoUrl'], ['CaseStudy', 'ogImageUrl'], ['CaseStudyMedia', 'url'],
  ['Article', 'featuredImageUrl'], ['Article', 'authorAvatarUrl'], ['Article', 'ogImageUrl'], ['Article', 'content'],
  ['Testimonial', 'imageUrl'], ['Testimonial', 'companyLogoUrl'],
  ['SiteSetting', 'logoLightUrl'], ['SiteSetting', 'logoDarkUrl'], ['SiteSetting', 'faviconUrl'],
  ['Page', 'ogImageUrl'], ['SeoSettings', 'defaultOgImageUrl'], ['Service', 'ogImageUrl'], ['Industry', 'coverImageUrl'], ['Industry', 'ogImageUrl'],
];

@Controller()
export class MediaController {
  constructor(
    private readonly storage: StorageService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('admin/media')
  @UseGuards(JwtAuthGuard)
  async upload(@Body() body: unknown, @Query('name') name?: string) {
    if (!Buffer.isBuffer(body) || body.length === 0) throw new BadRequestException('Send the image as the raw request body (png, jpeg, webp or gif).');
    if (body.length > MAX_UPLOAD_BYTES) throw new BadRequestException('Image must be 5 MB or smaller.');
    const image = detectImage(body);
    if (!image) throw new BadRequestException('Unsupported or corrupted image.');
    const key = newObjectKey(image.ext);
    await this.storage.put(key, body, image.contentType);
    const size = imageSize(body);
    const media = await this.prisma.media.create({
      data: {
        filename: key,
        originalFilename: (name ?? key).replace(/[^\w.\- ]+/g, '').slice(0, 120) || key,
        url: this.storage.urlFor(key),
        mimeType: image.contentType,
        size: body.length,
        width: size?.width,
        height: size?.height,
        storageProvider: 'local',
      },
    });
    return { url: media.url, id: media.id };
  }

  @Get('admin/media')
  @UseGuards(JwtAuthGuard)
  async list(@Query() query: { q?: string; type?: string; page?: string }) {
    const page = Math.max(1, Number.parseInt(query.page ?? '1', 10) || 1);
    const q = query.q?.trim();
    const where: Prisma.MediaWhereInput = {
      ...(query.type && /^[a-z]+\/[a-z]+$/.test(query.type) ? { mimeType: query.type } : {}),
      ...(q ? { OR: [{ originalFilename: { contains: q, mode: 'insensitive' } }, { altText: { contains: q, mode: 'insensitive' } }, { title: { contains: q, mode: 'insensitive' } }] } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.media.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
      this.prisma.media.count({ where }),
    ]);
    return { items, total, page, pageSize: PAGE_SIZE };
  }

  @Patch('admin/media/:id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body(new ZodBodyPipe(mediaUpdateSchema)) body: ReturnType<typeof mediaUpdateSchema.parse>) {
    if (!(await this.prisma.media.findUnique({ where: { id }, select: { id: true } }))) throw new NotFoundException();
    return this.prisma.media.update({ where: { id }, data: body });
  }

  @Get('admin/media/:id/usage')
  @UseGuards(JwtAuthGuard)
  async usage(@Param('id') id: string) {
    const media = await this.prisma.media.findUnique({ where: { id }, select: { url: true } });
    if (!media) throw new NotFoundException();
    return { references: await this.countReferences(media.url) };
  }

  @Delete('admin/media/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async remove(@Param('id') id: string, @Query('force') force?: string) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) throw new NotFoundException();
    const references = await this.countReferences(media.url);
    if (references > 0 && force !== '1') throw new ConflictException(`This file is used in ${references} place${references === 1 ? '' : 's'}. Remove it there first, or delete anyway.`);
    await this.prisma.media.delete({ where: { id } });
    await this.storage.remove(media.filename);
  }

  @Get('media/:key')
  @Header('Cache-Control', 'public, max-age=31536000, immutable')
  async serve(@Param('key') key: string, @Res() reply: FastifyReply): Promise<void> {
    const object = await this.storage.get(key);
    if (!object) throw new NotFoundException();
    await reply.type(object.contentType).header('Content-Length', object.size).header('X-Content-Type-Options', 'nosniff').send(object.stream);
  }

  private async countReferences(url: string): Promise<number> {
    const counts = await Promise.all(
      USAGE.map(async ([table, column]) => {
        const rows = await this.prisma.$queryRawUnsafe<{ count: bigint }[]>(`SELECT COUNT(*)::bigint AS count FROM "${table}" WHERE "${column}" LIKE $1`, `%${url}%`);
        return Number(rows[0]?.count ?? 0);
      }),
    );
    return counts.reduce((sum, n) => sum + n, 0);
  }
}
