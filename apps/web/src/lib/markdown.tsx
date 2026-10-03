import type { ReactNode } from 'react';
import { SmartImage } from '@/components/ui/smart-image';

/**
 * Small, safe Markdown renderer. It builds React elements directly (never raw HTML),
 * so article content cannot inject scripts, and URLs are restricted to safe schemes.
 * Supported: headings, paragraphs, lists, quotes, fenced code, rules, links, images, bold, italic, inline code.
 */

const SAFE_LINK = /^(https?:\/\/|mailto:|\/(?!\/)|#)/i;
const SAFE_IMAGE = /^(https?:\/\/|\/api\/media\/)/i;

function slugifyHeading(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
}

const INLINE = /(`[^`\n]+`)|(!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\))|(\[([^\]]+)\]\(([^)\s]+)\))|(\*\*([^*\n]+)\*\*)|(\*([^*\n]+)\*)|(_([^_\n]+)_)/g;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let index = 0;
  for (const match of text.matchAll(INLINE)) {
    const start = match.index ?? 0;
    if (start > last) nodes.push(text.slice(last, start));
    const key = `${keyPrefix}-${index++}`;
    if (match[1]) {
      nodes.push(<code key={key}>{match[1].slice(1, -1)}</code>);
    } else if (match[2]) {
      const [, , , alt, url, title] = match;
      nodes.push(SAFE_IMAGE.test(url) ? <MarkdownImage key={key} alt={alt} url={url} size={title} /> : alt);
    } else if (match[6]) {
      const [, , , , , , , label, url] = match;
      const external = /^https?:/i.test(url);
      nodes.push(
        SAFE_LINK.test(url) ? (
          <a key={key} href={url} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            {renderInline(label, key)}
          </a>
        ) : (
          label
        ),
      );
    } else if (match[9]) {
      nodes.push(<strong key={key}>{renderInline(match[10], key)}</strong>);
    } else if (match[11]) {
      nodes.push(<em key={key}>{renderInline(match[12], key)}</em>);
    } else if (match[13]) {
      nodes.push(<em key={key}>{renderInline(match[14], key)}</em>);
    }
    last = start + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function MarkdownImage({ alt, url, size }: { alt: string; url: string; size?: string }) {
  const dims = /^(\d{2,5})x(\d{2,5})$/.exec(size ?? '');
  return <SmartImage src={url} alt={alt} width={dims ? Number(dims[1]) : 1200} height={dims ? Number(dims[2]) : 675} sizes="(min-width: 768px) 720px, 100vw" className="h-auto max-w-full" />;
}

export function renderMarkdown(source: string): ReactNode[] {
  const lines = source.replace(/\r\n?/g, '\n').split('\n');
  const out: ReactNode[] = [];
  let i = 0;
  let key = 0;
  const next = () => `md-${key++}`;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i += 1;
      continue;
    }

    const fence = /^```(\w+)?\s*$/.exec(line);
    if (fence) {
      const body: string[] = [];
      i += 1;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) body.push(lines[i++]);
      i += 1;
      out.push(
        <pre key={next()} tabIndex={0}>
          <code data-language={fence[1]}>{body.join('\n')}</code>
        </pre>,
      );
      continue;
    }

    const heading = /^(#{1,4})\s+(.+?)\s*#*$/.exec(line);
    if (heading) {
      const level = Math.min(heading[1].length + 1, 5);
      const Tag = `h${level}` as 'h2' | 'h3' | 'h4' | 'h5';
      out.push(
        <Tag key={next()} id={slugifyHeading(heading[2])}>
          {renderInline(heading[2], `h${key}`)}
        </Tag>,
      );
      i += 1;
      continue;
    }

    if (/^(-{3,}|\*{3,})\s*$/.test(line)) {
      out.push(<hr key={next()} />);
      i += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) quote.push(lines[i++].replace(/^>\s?/, ''));
      out.push(<blockquote key={next()}>{renderInline(quote.join(' '), `q${key}`)}</blockquote>);
      continue;
    }

    const list = /^(\s*)([-*]|\d+\.)\s+/.exec(line);
    if (list) {
      const ordered = /\d/.test(list[2]);
      const items: string[] = [];
      while (i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*([-*]|\d+\.)\s+/, ''));
      const Tag = ordered ? 'ol' : 'ul';
      out.push(
        <Tag key={next()}>
          {items.map((item, n) => (
            <li key={n}>{renderInline(item, `l${key}-${n}`)}</li>
          ))}
        </Tag>,
      );
      continue;
    }

    const image = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)\s*$/.exec(line);
    if (image && SAFE_IMAGE.test(image[2])) {
      out.push(
        <figure key={next()}>
          <MarkdownImage alt={image[1]} url={image[2]} size={image[3]} />
          {image[1] && <figcaption>{image[1]}</figcaption>}
        </figure>,
      );
      i += 1;
      continue;
    }

    const paragraph: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(```|#{1,4}\s|>|\s*([-*]|\d+\.)\s+|(-{3,}|\*{3,})\s*$)/.test(lines[i])) paragraph.push(lines[i++]);
    out.push(<p key={next()}>{renderInline(paragraph.join(' '), `p${key}`)}</p>);
  }
  return out;
}

export function Prose({ source, className = '' }: { source: string; className?: string }) {
  return (
    <div
      className={`prose-valorian mx-auto max-w-[44rem] text-[1.0625rem] leading-8 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-muted [&_code]:rounded [&_code]:bg-surface-strong [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em] [&_figcaption]:mt-2 [&_figcaption]:text-center [&_figcaption]:text-sm [&_figcaption]:text-muted [&_figure]:my-8 [&_h2]:mb-4 [&_h2]:mt-12 [&_h2]:scroll-mt-24 [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h3]:mb-3 [&_h3]:mt-9 [&_h3]:scroll-mt-24 [&_h3]:text-2xl [&_h3]:font-semibold [&_h4]:mb-2 [&_h4]:mt-7 [&_h4]:text-xl [&_h4]:font-semibold [&_hr]:my-10 [&_hr]:border-border [&_img]:mx-auto [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl [&_li]:my-1.5 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-5 [&_pre]:my-6 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-border [&_pre]:bg-surface [&_pre]:p-4 [&_pre]:text-sm [&_pre]:leading-6 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6 ${className}`}
    >
      {renderMarkdown(source)}
    </div>
  );
}
