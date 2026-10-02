export const ICON_NAMES = [
  'book-open',
  'bot',
  'briefcase',
  'code',
  'cpu',
  'dumbbell',
  'gauge',
  'globe',
  'graduation-cap',
  'heart-pulse',
  'layers',
  'lightbulb',
  'monitor',
  'rocket',
  'server',
  'shield-check',
  'shopping-cart',
  'smartphone',
  'sparkles',
  'store',
  'users',
  'utensils',
  'workflow',
  'wrench',
  'zap',
] as const;

export type IconName = (typeof ICON_NAMES)[number];

export const ICON_OPTIONS = ICON_NAMES.map((value) => ({ value, label: value.replace(/-/g, ' ') }));
