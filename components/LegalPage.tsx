import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { LegalDocument } from '@/lib/legal-content';

/** Simple text page for Impressum / Datenschutz in the site's design. */
export default function LegalPage({ doc }: { doc: LegalDocument }) {
  return (
    <>
      <Navigation />
      <main>
        <PageHeader breadcrumb={[{ label: doc.title }]} title={doc.title} lead={doc.lead} />
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="max-w-3xl">
            {doc.sections.map((section) => (
              <div key={section.title} className="py-6 border-b border-secondary/10 first:pt-0">
                <h2 className="font-display font-bold uppercase text-2xl tracking-tight mb-3">{section.title}</h2>
                {section.body.map((paragraph, i) => (
                  <p key={i} className="text-secondary/80 leading-relaxed whitespace-pre-line mb-3 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            ))}
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-secondary/50 mt-8">{doc.updated}</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
