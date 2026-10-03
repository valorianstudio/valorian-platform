import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-primary-foreground shadow-[0_1px_2px_rgb(52_70_72/0.2)] hover:-translate-y-px hover:bg-[#415558] hover:shadow-[0_10px_22px_-10px_rgb(52_70_72/0.55)] active:bg-[#2a3a3c]',
  accent: 'bg-coral text-primary shadow-[0_1px_2px_rgb(52_70_72/0.12)] hover:-translate-y-px hover:bg-[#ffab82] hover:shadow-[0_10px_22px_-10px_rgb(255_150_100/0.7)] active:bg-[#f79a6e]',
  secondary: 'border border-[rgb(52_70_72/0.25)] bg-card/60 text-primary hover:-translate-y-px hover:border-primary hover:bg-card',
  ghost: 'text-primary hover:bg-[rgb(52_70_72/0.07)]',
  danger: 'bg-danger text-white hover:-translate-y-px hover:brightness-110',
};
const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-7 text-[15px]',
};

export function buttonStyles(variant: Variant = 'primary', size: Size = 'md', className?: string): string {
  return cn(
    'group inline-flex shrink-0 select-none items-center justify-center gap-2 rounded-full font-semibold tracking-[-0.005em] transition-[background-color,border-color,box-shadow,transform,color] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:translate-y-0 active:scale-[0.985] disabled:pointer-events-none disabled:opacity-50',
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
