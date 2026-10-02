export type ItemValue = string | boolean;
export type FormValue = string | boolean | string[] | Record<string, ItemValue>[];
export type FormValues = Record<string, FormValue>;
export type Option = { value: string; label: string };

interface Base {
  name: string;
  label: string;
  hint?: string;
  half?: boolean;
}

export type ItemField = { name: string; label: string; kind: 'text' | 'textarea' | 'select' | 'switch' | 'image'; options?: Option[]; default?: ItemValue };

export type FieldDef =
  | (Base & { kind: 'text' | 'url' | 'textarea' | 'number'; required?: boolean; max?: number; rows?: number; placeholder?: string; step?: string; nullable?: boolean })
  | (Base & { kind: 'select'; options: Option[]; optionsFrom?: string })
  | (Base & { kind: 'switch'; description?: string })
  | (Base & { kind: 'lines' })
  | (Base & { kind: 'image' })
  | (Base & { kind: 'date' })
  | (Base & { kind: 'markdown'; rows?: number })
  | (Base & { kind: 'items'; addLabel: string; fields: ItemField[] })
  | (Base & { kind: 'relations'; source: string })
  | { kind: 'heading'; name: string; label: string; half?: undefined; hint?: string };

export type RelationOptions = Record<string, { id: string; label: string }[]>;

export function blankItem(fields: ItemField[]): Record<string, ItemValue> {
  return Object.fromEntries(fields.map((f) => [f.name, f.default ?? (f.kind === 'switch' ? false : f.kind === 'select' ? (f.options?.[0]?.value ?? '') : '')]));
}

export function initialValues(fields: FieldDef[], source: Record<string, unknown> | null, defaults: FormValues = {}): FormValues {
  const values: FormValues = {};
  for (const field of fields) {
    if (field.kind === 'heading') continue;
    const raw = source ? source[field.name] : defaults[field.name];
    switch (field.kind) {
      case 'switch':
        values[field.name] = Boolean(raw ?? false);
        break;
      case 'lines':
        values[field.name] = Array.isArray(raw) ? (raw as string[]).join('\n') : '';
        break;
      case 'items':
        values[field.name] = Array.isArray(raw) ? (raw as Record<string, ItemValue>[]).map((item) => ({ ...item })) : [];
        break;
      case 'relations':
        values[field.name] = Array.isArray(raw) ? (raw as string[]) : [];
        break;
      case 'date': {
        const date = typeof raw === 'string' ? new Date(raw) : null;
        values[field.name] = date && !Number.isNaN(date.getTime()) ? new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16) : '';
        break;
      }
      default:
        values[field.name] = raw === null || raw === undefined ? '' : String(raw);
    }
  }
  return values;
}

export function toPayload(fields: FieldDef[], values: FormValues): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  for (const field of fields) {
    if (field.kind === 'heading') continue;
    const value = values[field.name];
    if (field.kind === 'lines') payload[field.name] = String(value).split('\n').map((line) => line.trim()).filter(Boolean);
    else if (field.kind === 'number') {
      if (value !== '') payload[field.name] = Number(value);
      else if (field.nullable) payload[field.name] = null;
    } else payload[field.name] = value;
  }
  return payload;
}
