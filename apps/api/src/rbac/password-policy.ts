import { randomInt } from 'node:crypto';

const COMMON = new Set([
  'password', 'password1', 'password123', '1234567890', '12345678', '123456789', 'qwertyuiop', 'qwerty123', 'iloveyou1', 'admin12345', 'letmein123', 'welcome123',
  'changeme123', 'changeme-valorian-2026', 'valorian123', 'valorian2026',
]);

/** Passphrase-friendly policy: length first, plus a block-list. No forced symbol/case rules. */
export function validatePassword(password: string, context: { email?: string; name?: string }, minLength: number): string | null {
  if (password.length < minLength) return `Password must be at least ${minLength} characters.`;
  if (password.length > 128) return 'Password must be 128 characters or fewer.';
  const lower = password.toLowerCase();
  if (COMMON.has(lower)) return 'That password is too common. Choose a longer, less predictable one.';
  if (/^(.)\1+$/.test(password)) return 'Password cannot be a single repeated character.';
  const local = context.email?.split('@')[0]?.toLowerCase();
  if (local && local.length >= 4 && lower.includes(local)) return 'Password must not contain your email name.';
  if (context.name && context.name.length >= 4 && lower.includes(context.name.toLowerCase().replace(/\s+/g, ''))) return 'Password must not contain your name.';
  return null;
}

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';

/** Random temporary password (no ambiguous characters), shown once to the administrator. */
export function generateTemporaryPassword(length = 16): string {
  return Array.from({ length }, () => ALPHABET[randomInt(ALPHABET.length)]).join('');
}
