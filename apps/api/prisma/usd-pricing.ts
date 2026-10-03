import { PrismaClient } from '@prisma/client';
import { FEATURES, INTEGRATIONS, TYPES, usd } from './seed-estimator';

try {
  process.loadEnvFile();
} catch {
  // rely on process environment
}

/**
 * One-time, safe move of the estimator catalogue from BDT to USD.
 *
 * It only converts a catalogue that still matches the originally seeded BDT prices exactly. If any price was edited
 * in the admin, nothing is changed: those numbers are the business's own and must be re-entered in USD by hand.
 * Submitted estimates and leads keep the currency they were created with; they are never rewritten.
 */
const prisma = new PrismaClient();

async function main(): Promise<void> {
  const settings = await prisma.estimatorSettings.findUnique({ where: { id: 'estimator' } });
  if (!settings) {
    console.info('No estimator catalogue yet. Nothing to convert (a fresh seed already uses USD).');
    return;
  }
  if (settings.currency === 'USD') {
    console.info('Estimator is already in USD. Nothing to do.');
    return;
  }

  const [types, features, integrations] = await Promise.all([prisma.estimatorProjectType.findMany(), prisma.estimatorFeature.findMany(), prisma.estimatorIntegration.findMany()]);
  const typeSeed = new Map(TYPES.map(([name, , base]) => [name, base]));
  const featureSeed = new Map(FEATURES.map((f) => [f.name, f]));
  const integrationSeed = new Map(INTEGRATIONS.map(([name, web, mobile]) => [name, { web, mobile }]));

  const untouched =
    types.every((t) => typeSeed.get(t.name) === t.basePrice) &&
    features.every((f) => {
      const seed = featureSeed.get(f.name);
      return seed !== undefined && seed.web === f.websitePrice && seed.mobile === f.mobilePrice && (seed.both ?? null) === f.bothPrice;
    }) &&
    integrations.every((i) => {
      const seed = integrationSeed.get(i.name);
      return seed !== undefined && seed.web === i.websitePrice && seed.mobile === i.mobilePrice;
    });

  if (!untouched) {
    console.warn('The estimator prices were edited in the admin, so they were NOT converted.');
    console.warn('Re-enter the prices in USD under Admin > Estimator. The public estimator now always displays USD.');
    return;
  }

  const convert = (value: number | null) => (value == null ? null : usd(value));
  await prisma.$transaction([
    ...types.map((t) => prisma.estimatorProjectType.update({ where: { id: t.id }, data: { basePrice: usd(t.basePrice) } })),
    ...features.map((f) => prisma.estimatorFeature.update({ where: { id: f.id }, data: { websitePrice: convert(f.websitePrice), mobilePrice: convert(f.mobilePrice), bothPrice: convert(f.bothPrice) } })),
    ...integrations.map((i) => prisma.estimatorIntegration.update({ where: { id: i.id }, data: { websitePrice: convert(i.websitePrice), mobilePrice: convert(i.mobilePrice) } })),
    prisma.estimatorSettings.update({ where: { id: 'estimator' }, data: { currency: 'USD', roundingStep: settings.roundingStep === 1000 ? 50 : settings.roundingStep } }),
  ]);
  console.info(`Converted ${types.length} project types, ${features.length} features and ${integrations.length} integrations to USD.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => void prisma.$disconnect());
