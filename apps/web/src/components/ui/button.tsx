import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-primary-foreground shadow-sm hover:brightness-110',
  secondary: 'border border-border bg-background text-foreground hover:bg-surface-strong',
  ghost: 'text-foreground hover:bg-surface-strong',
  danger: 'bg-danger text-white hover:brightness-110',
};
const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
};

export function buttonStyles(variant: Variant = 'primary', size: Size = 'md', className?: string): string {
  return cn(
    'inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-medium transition-[filter,background-color,transform] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60',
    variants[variant],
    sizes[size],
    className,
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export function Button({ variant, size, loading, className, disabled, children, type = 'button', ...props }: ButtonProps) {
  return (
    <button type={type} className={buttonStyles(variant, size, className)} disabled={disabled || loading} aria-busy={loading} {...props}>
      {loading && <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {children}
    </button>
  );
}

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: Variant;
  size?: Size;
}

export function ButtonLink({ href, variant, size, className, ...props }: ButtonLinkProps) {
  return <Link href={href} className={buttonStyles(variant, size, className)} {...props} />;
}
