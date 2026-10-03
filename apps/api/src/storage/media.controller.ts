import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Res,
  ServiceUnavailableException,
  UseGuards,
} from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import type { FastifyReply } from 'fastify';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequirePermission } from '../auth/permissions.decorator';
import { ZodBodyPipe } from '../cms/zod-body.pipe';
import { isProduction } from '../config/env';
import { mediaUpdateSchema } from '../content/content-schemas';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService, isMediaFolder } from './cloudinary.service';
import type { MediaFolder } from './cloudinary.service';
import { detectImage, imageSize, MAX_UPLOAD_BYTES, newObjectKey, StorageService } from './storage.service';

const PAGE_SIZE = 24;
/** Cloudinary's free plan rejects images above 25 megapixels. */
const MAX_PIXELS = 25_000_000;

type DetectedImage = NonNullable<ReturnType<typeof detectImage>>;

/** Every column that can hold a media URL. Identifiers are static; only the URL is parameterised. */
const USAGE: [table: string, column: string][] = [
  ['Demo', 'coverImageUrl'], ['Demo', 'thumbnailUrl'], ['Demo', 'ogImageUrl'], ['DemoScreenshot', 'url'],
  ['CaseStudy', 'coverImageUrl'], ['CaseStudy', 'featuredImageUrl'], ['CaseStudy', 'clientLogoUrl'], ['CaseStudy', 'ogImageUrl'], ['CaseStudyMedia', 'url'],
  ['Article', 'featuredImageUrl'], ['Article', 'authorAvatarUrl'], ['Article', 'ogImageUrl'], ['Article', 'content'],
  ['Testimonial', 'imageUrl'], ['Testimonial', 'companyLogoUrl'],
  ['SiteSetting', 'logoLightUrl'], ['SiteSetting', 'logoDarkUrl'], ['SiteSetting', 'faviconUrl'],
  ['Page', 'ogImageUrl'], ['SeoSettings', 'defaultOgImageUrl'], ['Service', 'ogImageUrl'], ['Industry', 'coverImageUrl'], ['Industry', 'ogImageUrl'],
];

function cleanName(name: string | undefined, fallback: string): string {
  return (name ?? fallback).replace(/[^\w.\- ]+/g, '').slice(0, 120) || fallback;
}

@Controller()
export class MediaController {
  private readonly logger = new Logger(MediaController.name);

  constructor(
    private readonly storage: StorageService,
    private readonly cloudinary: CloudinaryService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('admin/media')
  @UseGuards(JwtAuthGuard)
  @RequirePermission('media.manage')
  async upload(@Body() body: unknown, @Query('name') name?: string, @Query('folder') folder?: string) {
    const image = this.validate(body);
    const stored = await this.store(body as Buffer, image, folder);
    try {
      const media = await this.prisma.media.create({ data: { ...stored, originalFilename: cleanName(name, stored.filename) } });
      return this.toResponse(media);
    } catch (error) {
      await this.discard(stored.storageProvider, stored.publicId ?? stored.filename);
      throw error;
    }
  }

  /** Replaces the file behind an existing library item and repoints every place that used the old URL. */
  @Put('admin/media/:id')
  @UseGuards(JwtAuthGuard)
  @RequirePermission('media.manage')
  async replace(@Param('id') id: string, @Body() body: unknown, @Query('name') name?: string) {
    const current = await this.prisma.media.findUnique({ where: { id } });
    if (!current) throw new NotFoundException();
    const image = this.validate(body);
    const stored = await this.store(body as Buffer, image, current.folder?.split('/').pop());
    try {
      const media = await this.prisma.$transaction(async (tx) => {
        for (const [table, column] of USAGE) {
          await tx.$executeRawUnsafe(`UPDATE "${table}" SET "${column}" = REPLACE("${column}", $1, $2) WHERE strpos("${column}", $1) > 0`, current.url, stored.url);
        }
        return tx.media.update({ where: { id }, data: { ...stored, originalFilename: cleanName(name, current.originalFilename) } });
      });
      await this.discard(current.storageProvider, current.publicId ?? current.filename);
      return this.toResponse(media);
    } catch (error) {
      await this.discard(stored.storageProvider, stored.publicId ?? stored.filename);
      throw error;
    }
  }

  @Get('admin/media')
  @UseGuards(JwtAuthGuard)
  @RequirePermission('media.view')
  async list(@Query() query: { q?: string; type?: string; page?: string; folder?: string }) {
    const page = Math.max(1, Number.parseInt(query.page ?? '1', 10) || 1);
    const q = query.q?.trim();
    const where: Prisma.MediaWhereInput = {
      ...(query.type && /^[a-z]+\/[a-z]+$/.test(query.type) ? { mimeType: query.type } : {}),
      ...(isMediaFolder(query.folder) ? { folder: { endsWith: `/${query.folder}` } } : {}),
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
  @RequirePermission('media.manage')
  async update(@Param('id') id: string, @Body(new ZodBodyPipe(mediaUpdateSchema)) body: ReturnType<typeof mediaUpdateSchema.parse>) {
    if (!(await this.prisma.media.findUnique({ where: { id }, select: { id: true } }))) throw new NotFoundException();
    return this.prisma.media.update({ where: { id }, data: body });
  }

  @Get('admin/media/:id/usage')
  @UseGuards(JwtAuthGuard)
  @RequirePermission('media.view')
  async usage(@Param('id') id: string) {
    const media = await this.prisma.media.findUnique({ where: { id }, select: { url: true } });
    if (!media) throw new NotFoundException();
    return { references: await this.countReferences(media.url) };
  }

  @Delete('admin/media/:id')
  @UseGuards(JwtAuthGuard)
  @RequirePermission('media.manage')
  @HttpCode(204)
  async remove(@Param('id') id: string, @Query('force') force?: string) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) throw new NotFoundException();
    const references = await this.countReferences(media.url);
    if (references > 0 && force !== '1') throw new ConflictException(`This file is used in ${references} place${references === 1 ? '' : 's'}. Remove it there first, or delete anyway.`);
    // Remove the remote file first: if that fails the row is kept, so the delete can simply be retried and nothing is orphaned.
    if (media.storageProvider === 'cloudinary' && media.publicId) await this.cloudinary.destroy(media.publicId);
    await this.prisma.media.delete({ where: { id } });
    if (media.storageProvider === 'local') await this.storage.remove(media.filename);
  }

  /** Legacy files uploaded before the Cloudinary migration. New uploads are served by Cloudinary's CDN directly. */
  @Get('media/:key')
  @Header('Cache-Control', 'public, max-age=31536000, immutable')
  async serve(@Param('key') key: string, @Res() reply: FastifyReply): Promise<void> {
    const object = await this.storage.get(key);
    if (!object) throw new NotFoundException();
    await reply.type(object.contentType).header('Content-Length', object.size).header('X-Content-Type-Options', 'nosniff').send(object.stream);
  }

  private validate(body: unknown): DetectedImage {
    if (!Buffer.isBuffer(body) || body.length === 0) throw new BadRequestException('Send the image as the raw request body (png, jpeg, webp or gif).');
    if (body.length > MAX_UPLOAD_BYTES) throw new BadRequestException('Image must be 5 MB or smaller.');
    const image = detectImage(body);
    if (!image) throw new BadRequestException('Unsupported or corrupted image. Use a PNG, JPEG, WebP or GIF file.');
    const size = imageSize(body);
    if (!size || size.width < 1 || size.height < 1) throw new BadRequestException('Unsupported or corrupted image.');
    if (size.width * size.height > MAX_PIXELS) throw new BadRequestException('Image dimensions are too large. Please use an image under 25 megapixels.');
    return image;
  }

  /** Sends the file to Cloudinary. Only a local development machine without credentials falls back to disk. */
  private async store(data: Buffer, image: DetectedImage, folderInput?: string) {
    const folder: MediaFolder = isMediaFolder(folderInput) ? folderInput : 'general';
    if (this.cloudinary.enabled) {
      const asset = await this.cloudinary.upload(data, { folder });
      return {
        filename: asset.publicId,
        url: asset.url,
        mimeType: image.contentType,
        size: asset.bytes,
        width: asset.width,
        height: asset.height,
        storageProvider: 'cloudinary',
        publicId: asset.publicId as string | null,
        folder: asset.folder as string | null,
        metadata: { format: asset.format, version: asset.version, assetId: asset.assetId } as Prisma.InputJsonValue | undefined,
      };
    }
    if (isProduction) throw new ServiceUnavailableException('Image uploads are not configured on this server yet.');
    const key = newObjectKey(image.ext);
    await this.storage.put(key, data, image.contentType);
    const size = imageSize(data);
    return {
      filename: key,
      url: this.storage.urlFor(key),
      mimeType: image.contentType,
      size: data.length,
      width: size?.width,
      height: size?.height,
      storageProvider: 'local',
      publicId: null as string | null,
      folder: null as string | null,
      metadata: undefined as Prisma.InputJsonValue | undefined,
    };
  }

  private async discard(provider: string, key: string): Promise<void> {
    try {
      if (provider === 'cloudinary') await this.cloudinary.destroy(key);
      else await this.storage.remove(key);
    } catch (error) {
      this.logger.warn(`Could not clean up ${provider} file ${key}: ${error instanceof Error ? error.message : 'unknown error'}`);
    }
  }

  private toResponse(media: { id: string; url: string; publicId: string | null; width: number | null; height: number | null; size: number; mimeType: string; originalFilename: string; createdAt: Date }) {
    const { id, url, publicId, width, height, size, mimeType, originalFilename, createdAt } = media;
    return { id, url, publicId, width, height, size, mimeType, originalFilename, createdAt };
  }

  private async countReferences(url: string): Promise<number> {
    const counts = await Promise.all(
      USAGE.map(async ([table, column]) => {
        const rows = await this.prisma.$queryRawUnsafe<{ count: bigint }[]>(`SELECT COUNT(*)::bigint AS count FROM "${table}" WHERE strpos("${column}", $1) > 0`, url);
        return Number(rows[0]?.count ?? 0);
      }),
    );
    return counts.reduce((sum, n) => sum + n, 0);
  }
}
