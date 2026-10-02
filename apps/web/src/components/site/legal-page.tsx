import { PageHero } from './page-hero';

export function LegalPage({ title, intro, sections }: { title: string; intro: string; sections: { heading: string; body: string }[] }) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title} description={intro} />
      <div className="mx-auto w-full max-w-3xl space-y-8 px-5 py-14 sm:px-8">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-xl font-semibold">{section.heading}</h2>
            <p className="mt-2 text-muted">{section.body}</p>
          </section>
        ))}
      </div>
    </>
  );
}
