'use client';

import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, Input, Select, Switch, Textarea } from '@/components/ui/field';
import { cn } from '@/lib/cn';
import { blankItem } from './field-defs';
import type { FieldDef, FormValues, ItemValue, RelationOptions } from './field-defs';
import { ImageInput } from './image-input';

interface EntityFormProps {
  fields: FieldDef[];
  values: FormValues;
  onChange: (values: FormValues) => void;
  relationOptions?: RelationOptions;
  disabled?: boolean;
}

function ItemsEditor({ field, rows, onChange }: { field: Extract<FieldDef, { kind: 'items' }>; rows: Record<string, ItemValue>[]; onChange: (rows: Record<string, ItemValue>[]) => void }) {
  const update = (index: number, name: string, value: ItemValue) => onChange(rows.map((row, i) => (i === index ? { ...row, [name]: value } : row)));
  const move = (index: number, delta: number) => {
    const next = [...rows];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    onChange(next);
  };

  return (
    <fieldset className="space-y-3">
      <legend className="mb-1.5 text-sm font-medium">{field.label}</legend>
      {rows.map((row, index) => (
        <div key={index} className="space-y-3 rounded-xl border border-border bg-surface p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {field.fields.map((sub) => {
              const cell = row[sub.name];
              const wide = sub.kind === 'textarea' || sub.kind === 'image' ? 'sm:col-span-2' : '';
              if (sub.kind === 'switch') {
                return (
                  <div key={sub.name} className="self-center">
                    <Switch label={sub.label} checked={Boolean(cell)} onChange={(checked) => update(index, sub.name, checked)} />
                  </div>
                );
              }
              if (sub.kind === 'image') {
                return (
                  <div key={sub.name} className={wide}>
                    <ImageInput label={sub.label} value={String(cell ?? '')} onChange={(url) => update(index, sub.name, url)} />
                  </div>
                );
              }
              return (
                <Field key={sub.name} label={sub.label} className={wide}>
                  {(props) =>
                    sub.kind === 'textarea' ? (
                      <Textarea {...props} className="min-h-20" value={String(cell ?? '')} onChange={(e) => update(index, sub.name, e.target.value)} />
                    ) : sub.kind === 'select' ? (
                      <Select {...props} value={String(cell ?? '')} onChange={(e) => update(index, sub.name, e.target.value)}>
                        {sub.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      <Input {...props} value={String(cell ?? '')} onChange={(e) => update(index, sub.name, e.target.value)} />
                    )
                  }
                </Field>
              );
            })}
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" aria-label="Move up" disabled={index === 0} onClick={() => move(index, -1)}>
              <ArrowUp className="size-4" />
            </Button>
            <Button size="sm" variant="ghost" aria-label="Move down" disabled={index === rows.length - 1} onClick={() => move(index, 1)}>
              <ArrowDown className="size-4" />
            </Button>
            <Button size="sm" variant="ghost" aria-label="Remove item" className="text-danger" onClick={() => onChange(rows.filter((_, i) => i !== index))}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      ))}
      <Button size="sm" variant="secondary" onClick={() => onChange([...rows, blankItem(field.fields)])}>
        <Plus className="size-4" aria-hidden /> {field.addLabel}
      </Button>
      {field.hint && <p className="text-sm text-muted">{field.hint}</p>}
    </fieldset>
  );
}

export function EntityForm({ fields, values, onChange, relationOptions = {}, disabled }: EntityFormProps) {
  const set = (name: string, value: FormValues[string]) => onChange({ ...values, [name]: value });

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {fields.map((field) => {
        const span = field.half ? '' : 'sm:col-span-2';
        if (field.kind === 'heading') {
          return (
            <div key={field.name} className="border-t border-border pt-5 sm:col-span-2">
              <h3 className="font-semibold">{field.label}</h3>
              {field.hint && <p className="mt-1 text-sm text-muted">{field.hint}</p>}
            </div>
          );
        }
        const value = values[field.name];
        return (
          <div key={field.name} className={cn(span, 'min-w-0')}>
            {field.kind === 'switch' && <Switch label={field.label} description={field.description} checked={Boolean(value)} disabled={disabled} onChange={(checked) => set(field.name, checked)} />}
            {(field.kind === 'text' || field.kind === 'url' || field.kind === 'number') && (
              <Field label={field.label} hint={field.hint}>
                {(props) => (
                  <Input
                    {...props}
                    type={field.kind === 'number' ? 'number' : field.kind === 'url' ? 'text' : 'text'}
                    inputMode={field.kind === 'number' ? (field.step ? 'decimal' : 'numeric') : undefined}
                    step={field.kind === 'number' ? (field.step ?? '1') : undefined}
                    min={field.kind === 'number' ? 0 : undefined}
                    required={field.required}
                    maxLength={field.max}
                    placeholder={field.placeholder}
                    disabled={disabled}
                    value={String(value ?? '')}
                    onChange={(e) => set(field.name, e.target.value)}
                  />
                )}
              </Field>
            )}
            {field.kind === 'textarea' && (
              <Field label={field.label} hint={field.hint}>
                {(props) => <Textarea {...props} rows={field.rows ?? 4} required={field.required} maxLength={field.max} disabled={disabled} value={String(value ?? '')} onChange={(e) => set(field.name, e.target.value)} />}
              </Field>
            )}
            {field.kind === 'lines' && (
              <Field label={field.label} hint={field.hint ?? 'One item per line.'}>
                {(props) => <Textarea {...props} rows={4} disabled={disabled} value={String(value ?? '')} onChange={(e) => set(field.name, e.target.value)} />}
              </Field>
            )}
            {field.kind === 'select' && (
              <Field label={field.label} hint={field.hint}>
                {(props) => (
                  <Select {...props} disabled={disabled} value={String(value ?? '')} onChange={(e) => set(field.name, e.target.value)}>
                    {(field.optionsFrom ? [{ value: '', label: 'None' }, ...(relationOptions[field.optionsFrom] ?? []).map((o) => ({ value: o.id, label: o.label }))] : field.options).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
            )}
            {field.kind === 'image' && <ImageInput label={field.label} hint={field.hint} value={String(value ?? '')} onChange={(url) => set(field.name, url)} disabled={disabled} />}
            {field.kind === 'items' && <ItemsEditor field={field} rows={value as Record<string, ItemValue>[]} onChange={(rows) => set(field.name, rows)} />}
            {field.kind === 'relations' && (
              <fieldset>
                <legend className="mb-2 text-sm font-medium">{field.label}</legend>
                <div className="flex flex-wrap gap-2">
                  {(relationOptions[field.source] ?? []).map((option) => {
                    const selected = (value as string[]).includes(option.id);
                    return (
                      <label key={option.id} className={cn('cursor-pointer rounded-full border px-3 py-1.5 text-sm transition-colors has-[:focus-visible]:outline-2', selected ? 'border-primary bg-primary-soft text-primary' : 'border-border text-muted hover:text-foreground')}>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={selected}
                          disabled={disabled}
                          onChange={() => set(field.name, selected ? (value as string[]).filter((id) => id !== option.id) : [...(value as string[]), option.id])}
                        />
                        {option.label}
                      </label>
                    );
                  })}
                  {(relationOptions[field.source] ?? []).length === 0 && <p className="text-sm text-muted">Nothing available yet.</p>}
                </div>
              </fieldset>
            )}
          </div>
        );
      })}
    </div>
  );
}
