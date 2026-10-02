import type { Prisma } from '@prisma/client';

export const publicDemoWhere = { status: 'PUBLISHED', active: true } satisfies Prisma.DemoWhereInput;

export const demoCardSelect = {
  slug: true,
  name: true,
  shortDescription: true,
  thumbnailUrl: true,
  coverImageUrl: true,
  badge: true,
  statusLabel: true,
  featured: true,
  category: { select: { name: true, slug: true } },
  industry: { select: { name: true, slug: true } },
  platforms: { where: { enabled: true }, select: { type: true } },
} satisfies Prisma.DemoSelect;

export const demoOrder = [{ displayOrder: 'asc' }, { createdAt: 'asc' }] satisfies Prisma.DemoOrderByWithRelationInput[];
