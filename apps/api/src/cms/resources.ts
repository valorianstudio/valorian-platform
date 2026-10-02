import type { Prisma } from '@prisma/client';
import type { z } from 'zod';
import type { PrismaService } from '../prisma/prisma.service';
import {
  ctaSchema,
  faqSchema,
  featuredWorkSchema,
  industrySchema,
  navigationSchema,
  processStepSchema,
  serviceSchema,
  technologySchema,
  valuePropSchema,
} from './schemas';

export type Row = Record<string, unknown>;

export interface CrudDelegate {
  findMany(args: object): Promise<Row[]>;
  findFirst(args: object): Promise<Row | null>;
  findUnique(args: object): Promise<Row | null>;
  create(args: object): Promise<Row>;
  update(args: object): Promise<Row>;
  delete(args: object): Promise<unknown>;
}

type Client = PrismaService | Prisma.TransactionClient;

export interface ResourceDef {
  delegate: (client: Client) => CrudDelegate;
  schema: z.ZodObject;
  orderBy: object[];
  slugFrom?: 'title' | 'name';
  /** input id-array field -> prisma relation field */
  relations?: Record<string, string>;
}

const asDelegate = (delegate: unknown): CrudDelegate => delegate as CrudDelegate;
const byOrder = [{ displayOrder: 'asc' }, { createdAt: 'asc' }];

export const RESOURCES: Record<string, ResourceDef> = {
  services: {
    delegate: (c) => asDelegate(c.service),
    schema: serviceSchema,
    orderBy: byOrder,
    slugFrom: 'title',
    relations: { technologyIds: 'technologies' },
  },
  solutions: {
    delegate: (c) => asDelegate(c.industry),
    schema: industrySchema,
    orderBy: byOrder,
    slugFrom: 'name',
    relations: { technologyIds: 'technologies', serviceIds: 'services' },
  },
  technologies: { delegate: (c) => asDelegate(c.technology), schema: technologySchema, orderBy: byOrder, slugFrom: 'name' },
  process: { delegate: (c) => asDelegate(c.processStep), schema: processStepSchema, orderBy: byOrder },
  values: { delegate: (c) => asDelegate(c.valueProp), schema: valuePropSchema, orderBy: byOrder },
  faqs: { delegate: (c) => asDelegate(c.faq), schema: faqSchema, orderBy: byOrder },
  ctas: { delegate: (c) => asDelegate(c.cta), schema: ctaSchema, orderBy: [{ createdAt: 'asc' }] },
  navigation: {
    delegate: (c) => asDelegate(c.navigationItem),
    schema: navigationSchema,
    orderBy: [{ location: 'asc' }, ...byOrder],
  },
  work: { delegate: (c) => asDelegate(c.featuredWork), schema: featuredWorkSchema, orderBy: byOrder },
};

export function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 70) || 'item'
  );
}
