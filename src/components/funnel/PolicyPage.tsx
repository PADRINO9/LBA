import Link from "next/link";
import { FunnelFooter, FunnelShell } from "./FunnelShell";

type PolicySection = {
  title: string;
  body: string;
};

type PolicyPageProps = {
  eyebrow: string;
  title: string;
  note: string;
  sections: PolicySection[];
};

export function PolicyPage({ eyebrow, title, note, sections }: PolicyPageProps) {
  return (
    <FunnelShell ctaHref="/stress-test" ctaLabel="חזרה למיפוי">
      <section className="px-4 py-10 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[2rem] border border-line bg-surface p-5 shadow-soft sm:p-8">
            <p className="text-sm font-extrabold text-accent">{eyebrow}</p>
            <h1 className="mt-3 text-4xl font-black leading-tight text-ink sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 rounded-3xl border border-line bg-paper/55 p-4 leading-8 text-muted">
              {note}
            </p>

            <div className="mt-8 grid gap-5">
              {sections.map((section) => (
                <section
                  key={section.title}
                  aria-labelledby={`${section.title.replace(/\s+/g, "-")}-title`}
                  className="rounded-[1.5rem] border border-line bg-paper/35 p-5"
                >
                  <h2
                    id={`${section.title.replace(/\s+/g, "-")}-title`}
                    className="text-xl font-black text-ink"
                  >
                    {section.title}
                  </h2>
                  <p className="mt-3 leading-8 text-muted">{section.body}</p>
                </section>
              ))}
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-accent/20 bg-accent/10 p-5">
              <h2 className="text-xl font-black text-ink">יצירת קשר</h2>
              <p className="mt-2 leading-8 text-muted">
                לשאלות בנושא המדיניות או הנגישות ניתן לפנות אלינו בדוא״ל{" "}
                <a
                  href="mailto:office@pra-fin.co.il"
                  className="font-extrabold text-accent underline focus:outline-none focus:ring-4 focus:ring-accent/20"
                >
                  office@pra-fin.co.il
                </a>{" "}
                או בטלפון{" "}
                <a
                  href="tel:036861371"
                  className="font-extrabold text-accent underline focus:outline-none focus:ring-4 focus:ring-accent/20"
                >
                  03-686-1371
                </a>
                .
              </p>
            </div>

            <Link
              href="/stress-test"
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-7 py-3 font-extrabold text-white shadow-card transition hover:bg-accent-dark focus:outline-none focus:ring-4 focus:ring-accent/25"
            >
              חזרה למיפוי
            </Link>
          </div>
        </div>
      </section>
      <FunnelFooter />
    </FunnelShell>
  );
}
