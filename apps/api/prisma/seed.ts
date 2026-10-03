import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";
import { ensureRbac } from "../src/rbac/bootstrap";
import { seedContent } from "./seed-content";

try {
  process.loadEnvFile();
} catch {
  // rely on process environment
}

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const email = (
    process.env.SEED_ADMIN_EMAIL ?? "admin@valorian.studio"
  ).toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!password || password.length < 10) {
    throw new Error(
      "Set SEED_ADMIN_PASSWORD (min 10 characters) to seed the Super Admin.",
    );
  }

  await ensureRbac(prisma);
  const superRole = await prisma.role.findUniqueOrThrow({
    where: { key: "SUPER_ADMIN" },
    select: { id: true },
  });
  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: {
      name: "Valorian Admin",
      email,
      passwordHash: await argon2.hash(password),
      role: "SUPER_ADMIN",
      roleId: superRole.id,
    },
  });

  await prisma.siteSetting.upsert({
    where: { id: "site" },
    update: {},
    create: {
      id: "site",
      brandName: "Valorian",
      companyName: "Valorian Studio",
      tagline: "Software Engineering & Digital Product Studio",
      description:
        "We design and engineer custom software, web applications, SaaS platforms, mobile apps and AI-powered solutions for ambitious businesses.",
      primaryEmail: "hello.valorianstudio@gmail.com",
      websiteUrl: "https://valorian.studio",
      defaultCurrency: "USD",
    },
  });

  await seedContent(prisma);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
