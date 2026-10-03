import { PrismaClient, Prisma } from '@prisma/client';

try {
  process.loadEnvFile();
} catch {
  // rely on process environment
}

/**
 * One-time, idempotent: applies the redesigned homepage wording to an existing database.
 * Only the hero and closing call to action are touched; everything else stays as edited in the admin.
 */
const prisma = new PrismaClient();

const HERO = {
  eyebrow: 'Software Engineering & Digital Product Studio',
  headline: 'We build digital products',
  highlight: 'people enjoy using.',
  description: 'Valorian Studio designs and engineers websites, web applications, SaaS platforms, mobile applications and AI-powered software for modern businesses.',
  primaryLabel: 'Start a Project',
  primaryUrl: '/contact',
  secondaryLabel: 'Explore Our Work',
  secondaryUrl: '/demos',
};

const CTA = {
  headline: 'Have an idea worth building?',
  description: 'Let’s turn it into a product people enjoy using.',
  primaryLabel: 'Discuss Your Project',
  primaryUrl: '/contact',
};

async function merge(key: string, patch: Record<string, unknown>): Promise<void> {
  const row = await prisma.pageSection.findUnique({ where: { pageKey_key: { pageKey: 'HOME', key } } });
  if (!row) return;
  const content = { ...(row.content as Record<string, unknown>), ...patch };
  await prisma.pageSection.update({ where: { pageKey_key: { pageKey: 'HOME', key } }, data: { content: content as Prisma.InputJsonObject } });
}

async function main(): Promise<void> {
  await merge('hero', HERO);
  await merge('cta', CTA);
  console.info('Homepage hero and call-to-action wording updated.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => void prisma.$disconnect());
