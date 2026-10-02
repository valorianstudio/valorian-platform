import Link from 'next/link';
import { Clock } from 'lucide-react';
import { CtaBand } from '@/components/site/blocks';
import { ArticleCardView, formatPublished } from '@/components/site/editorial';
import { Breadcrumbs, JsonLd } from '@/components/site/seo';
import { ShareButtons } from '@/components/site/share-buttons';
import { Badge } from '@/components/ui/badge';
import { Section } from '@/components/ui/section';
import { SmartImage } from '@/components/ui/smart-image';
import type { ArticleCard, ArticleDetail } from '@/lib/cms-types';
import { Prose } from '@/lib/markdown';

interface Props {
  article: ArticleDetail;
  related: ArticleCard[];
  baseUrl: string;
  company: string;
  preview?: boolean;
}

export function ArticleView({ article, related, baseUrl, company, preview }: Props) {
  const url = `${baseUrl}/insights/${article.slug}`;
  const author = article.authorName ?? company;

  return (
    <>
      {!preview && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            description: article.excerpt,
            datePublished: article.publishedAt ?? undefined,
            dateModified: article.updatedAt,
            image: article.featuredImageUrl ? [article.featuredImageUrl.startsWith('/') ? `${baseUrl}${article.featuredImageUrl}` : article.featuredImageUrl] : undefined,
            author: { '@type': article.authorName ? 'Person' : 'Organization', name: author },
            publisher: { '@type': 'Organization', name: company },
            mainEntityOfPage: url,
            keywords: article.tags.map((t) => t.name).join(', ') || undefined,
          }}
        />
      )}
      <article>
        <header className="border-b border-border">
          <div className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
            <Breadcrumbs items={[{ name: 'Insights', href: '/insights' }, { name: article.title }]} base={baseUrl} />
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
              {article.category && (
                <Link href={`/insights?category=${article.category.slug}`}>
                  <Badge tone="primary">{article.category.name}</Badge>
                </Link>
              )}
              {article.publishedAt && <time dateTime={article.publishedAt}>{formatPublished(article.publishedAt)}</time>}
              {article.readingTime && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3.5" aria-hidden /> {article.readingTime} min read
                </span>
              )}
            </div>
            <h1 className="mt-5 text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{article.title}</h1>
            <p className="mt-5 text-pretty text-xl text-muted">{article.excerpt}</p>
            <p className="mt-6 flex items-center gap-3 text-sm">
              {article.authorAvatarUrl ? (
                <SmartImage src={article.authorAvatarUrl} alt="" width={40} height={40} className="size-10 rounded-full object-cover" />
              ) : (
                <span aria-hidden className="grid size-10 place-items-center rounded-full bg-primary-soft font-semibold text-primary">{author.charAt(0)}</span>
              )}
              <span>
                <span className="block font-medium">{author}</span>
                {article.authorBio && <span className="block text-muted">{article.authorBio}</span>}
              </span>
            </p>
          </div>
        </header>

        {article.featuredImageUrl && (
          <div className="mx-auto mt-10 w-full max-w-5xl px-5 sm:px-8">
            <SmartImage src={article.featuredImageUrl} alt={article.featuredImageAlt ?? ''} width={1200} height={630} sizes="(min-width: 1024px) 64rem, 100vw" priority className="aspect-[1200/630] w-full rounded-2xl border border-border object-cover" />
          </div>
        )}

        <div className="px-5 py-12 sm:px-8 sm:py-16">
          <Prose source={article.content} />
          {article.tags.length > 0 && (
            <ul className="mx-auto mt-10 flex max-w-[44rem] flex-wrap gap-2" aria-label="Tags">
              {article.tags.map((tag) => (
                <li key={tag.slug}>
                  <Link href={`/insights?tag=${tag.slug}`} className="inline-flex rounded-full border border-border px-3 py-1 text-sm text-muted hover:text-foreground">
                    #{tag.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="mx-auto mt-10 max-w-[44rem] border-t border-border pt-6">
            <ShareButtons title={article.title} url={url} />
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <Section tone="surface" eyebrow="Keep reading" title="Related insights">
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug}>
                <ArticleCardView item={item} />
              </li>
            ))}
          </ul>
        </Section>
      )}
      <CtaBand content={{ headline: 'Have a project in mind?', description: `Talk to ${company} about turning your idea into dependable software.`, primaryLabel: 'Start a Project', primaryUrl: '/contact' }} />
    </>
  );
}
