import { BadRequestException, Body, Controller, Get, Header, NotFoundException, Param, Post, Res, UseGuards } from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { detectImage, MAX_UPLOAD_BYTES, newObjectKey, StorageService } from './storage.service';

@Controller()
export class MediaController {
  constructor(private readonly storage: StorageService) {}

  @Post('admin/media')
  @UseGuards(JwtAuthGuard)
  async upload(@Body() body: unknown): Promise<{ url: string }> {
    if (!Buffer.isBuffer(body) || body.length === 0) throw new BadRequestException('Send the image as the raw request body (png, jpeg, webp or gif).');
    if (body.length > MAX_UPLOAD_BYTES) throw new BadRequestException('Image must be 5 MB or smaller.');
    const image = detectImage(body);
    if (!image) throw new BadRequestException('Unsupported or corrupted image.');
    const key = newObjectKey(image.ext);
    await this.storage.put(key, body, image.contentType);
    return { url: this.storage.urlFor(key) };
  }

  @Get('media/:key')
  @Header('Cache-Control', 'public, max-age=31536000, immutable')
  async serve(@Param('key') key: string, @Res() reply: FastifyReply): Promise<void> {
    const object = await this.storage.get(key);
    if (!object) throw new NotFoundException();
    await reply.type(object.contentType).header('Content-Length', object.size).header('X-Content-Type-Options', 'nosniff').send(object.stream);
  }
}
