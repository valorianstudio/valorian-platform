import type { PrismaClient } from '@prisma/client';
import { readdir, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const CATEGORIES = ['Software Development', 'SaaS', 'AI', 'Mobile Development', 'Business Automation', 'Engineering', 'Valorian Updates'];

const slug = (name: string) => name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const intro = (eyebrow: string, title: string, subtitle: string) => ({ eyebrow, title, subtitle });

const NEW_HOME_SECTIONS: [string, Record<string, unknown>][] = [
  ['caseStudies', intro('Case studies', 'Results from real projects', 'How we helped clients solve real business problems.')],
  ['testimonials', intro('Client feedback', 'What clients say', 'Words from the people we have built software for.')],
  ['insights', intro('Insights', 'Thinking on software and product', 'Practical articles from the Valorian team.')],
];

/**
 * Phase 6 structural seed. Never creates case studies, testimonials or articles:
 * credibility content must come from real work entered by an admin.
 */
export async function seedEditorial(prisma: PrismaClient): Promise<void> {
  await prisma.seoSettings.upsert({ where: { id: 'seo' }, update: {}, create: { id: 'seo', siteName: 'Valorian Studio' } });

  if ((await prisma.articleCategory.count()) === 0) {
    await prisma.articleCategory.createMany({ data: CATEGORIES.map((name, displayOrder) => ({ name, slug: slug(name), displayOrder })) });
  }

  for (const key of ['DEMOS', 'CASE_STUDIES', 'INSIGHTS', 'CONTACT', 'ESTIMATE'] as const) {
    await prisma.page.upsert({ where: { key }, update: {}, create: { key } });
  }

  const existing = await prisma.pageSection.findMany({ where: { pageKey: 'HOME' }, orderBy: { displayOrder: 'asc' }, select: { id: true, key: true } });
  const missing = NEW_HOME_SECTIONS.filter(([key]) => !existing.some((s) => s.key === key));
  if (missing.length > 0 && existing.length > 0) {
    const created = [];
    for (const [key, content] of missing) {
      created.push(await prisma.pageSection.create({ data: { pageKey: 'HOME', key, displayOrder: 1000, content: content as object }, select: { id: true, key: true } }));
    }
    const ordered = existing.filter((s) => s.key !== 'cta');
    const cta = existing.find((s) => s.key === 'cta');
    const final = [...ordered, ...created, ...(cta ? [cta] : [])];
    await prisma.$transaction(final.map((section, displayOrder) => prisma.pageSection.update({ where: { id: section.id }, data: { displayOrder } })));
  }

  if (!(await prisma.navigationItem.findFirst({ where: { url: '/insights' } }))) {
    await prisma.navigationItem.createMany({
      data: [
        { label: 'Case Studies', url: '/case-studies', location: 'FOOTER', displayOrder: 30 },
        { label: 'Insights', url: '/insights', location: 'FOOTER', displayOrder: 31 },
      ],
    });
  }

  // Register files uploaded before the media library existed.
  const dir = resolve(process.env.UPLOAD_DIR ?? './uploads');
  const files = await readdir(dir).catch(() => [] as string[]);
  for (const filename of files) {
    const match = /\.(png|jpg|webp|gif)$/.exec(filename);
    if (!match) continue;
    const info = await stat(join(dir, filename));
    const mimeType = { png: 'image/png', jpg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif' }[match[1] as 'png'];
    await prisma.media.upsert({
      where: { filename },
      update: {},
      create: { filename, originalFilename: filename, url: `/api/media/${filename}`, mimeType, size: info.size },
    });
  }
}
