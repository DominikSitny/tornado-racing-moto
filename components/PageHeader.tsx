import Breadcrumb from '@/components/Breadcrumb';

interface PageHeaderProps {
  breadcrumb: { label: string; href?: string }[];
  /** Small mono label above the title, e.g. a brand or section name. */
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
}

/** Consistent page header: breadcrumb, eyebrow, condensed title and lead text. */
export default function PageHeader({ breadcrumb, eyebrow, title, lead, children }: PageHeaderProps) {
  return (
    <header className="border-b border-secondary/10">
      <Breadcrumb items={breadcrumb} />
      <div className="container pt-6 pb-10 md:pb-14">
        {eyebrow && (
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-secondary/50 mb-4">
            <span className="inline-block w-6 h-px bg-primary align-middle mr-3" />
            {eyebrow}
          </p>
        )}
        <h1 className="font-display font-bold uppercase text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-balance max-w-4xl">
          {title}
        </h1>
        {lead && <p className="text-lg md:text-xl text-secondary/70 mt-5 max-w-2xl leading-relaxed">{lead}</p>}
        {children}
      </div>
    </header>
  );
}
