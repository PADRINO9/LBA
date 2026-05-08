"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Play,
  ShieldCheck,
} from "lucide-react";
import { useEffect } from "react";
import { FunnelFooter, FunnelShell } from "./FunnelShell";
import { trackEvent } from "@/src/lib/tracking";

const contactItems = [
  {
    icon: MapPin,
    label: "כתובת",
    value: "יצחק מודעי 2, רחובות, ישראל, 7608804",
  },
  {
    icon: Phone,
    label: "טלפון",
    value: "03-686-1371",
    href: "tel:036861371",
  },
  {
    icon: Mail,
    label: "אימייל",
    value: "office@pra-fin.co.il",
    href: "mailto:office@pra-fin.co.il",
  },
];

export function AfterStressTestPage() {
  useEffect(() => {
    trackEvent("ViewAfterStressTest");
  }, []);

  return (
    <FunnelShell ctaHref="/stress-test" ctaLabel="מיפוי חדש">
      <section className="px-4 py-10 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-4 py-2 text-sm font-bold text-accent shadow-card">
                <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
                הפרטים נשלחו בהצלחה
              </div>
              <h1 className="text-4xl font-black leading-tight text-ink sm:text-5xl">
                הפרטים התקבלו. תודה.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted sm:text-xl">
                לפני שנחזור אליך — כמה מילים על פרקטיקה פיננסית ועל מה שצפוי בשיחה.
              </p>
            </div>

            <section
              aria-labelledby="lior-video-title"
              className="glass-border rounded-[2rem] bg-surface p-5 shadow-soft sm:p-7"
            >
              <div className="aspect-video overflow-hidden rounded-[1.5rem] border border-line bg-[radial-gradient(circle_at_30%_20%,rgba(26,88,102,0.18),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.92),rgba(229,221,210,0.62))]">
                <div
                  data-testid="lior-video-placeholder"
                  className="flex h-full flex-col items-center justify-center gap-4 text-center text-ink"
                  role="img"
                  aria-label="מיקום לסרטון היכרות עם ליאור בן ארי"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white shadow-soft">
                    <Play aria-hidden="true" className="mr-1 h-7 w-7" />
                  </span>
                  <span className="px-5 text-lg font-black">כאן יוטמע סרטון היכרות עם ליאור בן ארי</span>
                </div>
              </div>
              <div className="mt-5 space-y-2">
                <h2 id="lior-video-title" className="text-2xl font-black text-ink">
                  הכירו את ליאור בן ארי
                </h2>
                <p className="leading-8 text-muted">
                  בסרטון קצר ליאור מסביר את מטרת השיחה, למי התהליך מתאים, ומה אפשר לצפות לקבל ממנה.
                </p>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          <InfoCard
            title="מה יקרה בשיחה?"
            text="בשיחה נבין את התמונה הפיננסית הראשונית, נעבור על הנושאים שעלו במיפוי, ונבדוק האם יש מקום להמשך בדיקה מקצועית ומעמיקה יותר."
          />
          <InfoCard
            title="מה לא יקרה בשיחה?"
            text="זו לא שיחת מכירה אגרסיבית, ולא תידרש לקבל החלטה במקום. המטרה היא להבין האם יש התאמה להמשך תהליך בצורה רגועה, אחראית ומקצועית."
          />
          <InfoCard
            title="מי עומד מאחורי התהליך?"
            text="פרקטיקה פיננסית — ליאור בן ארי פועלת בתחום התכנון הפיננסי, הפנסיוני וההשקעות, מתוך מטרה לעזור לאנשים ומשפחות לעשות סדר, לקבל בהירות ולבנות חוסן פיננסי אחראי יותר."
          />
        </div>
      </section>

      <section className="px-4 pb-14 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-line bg-surface p-6 shadow-soft">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <ShieldCheck aria-hidden="true" className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-ink">
                  פרקטיקה פיננסית — ליאור בן ארי
                </h2>
                <p className="mt-2 leading-8 text-muted">
                  פועל ברישיון פנסיוני מוסמך מטעם משרד האוצר | מספר רישיון: L-00137167
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-3">
              {contactItems.map((item) => {
                const Icon = item.icon;
                const content = (
                  <span className="flex items-start gap-3 rounded-2xl border border-line bg-paper/55 p-4">
                    <Icon aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-accent" />
                    <span>
                      <span className="block text-sm font-bold text-muted">{item.label}</span>
                      <span className="block font-extrabold text-ink">{item.value}</span>
                    </span>
                  </span>
                );

                return item.href ? (
                  <a
                    key={item.label}
                    href={item.href}
                    className="rounded-2xl focus:outline-none focus:ring-4 focus:ring-accent/20"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={item.label}>{content}</div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-accent/20 bg-accent/10 p-6 shadow-soft">
            <h2 className="text-2xl font-black text-ink">רוצים להוסיף משהו לפני השיחה?</h2>
            <p className="mt-3 leading-8 text-muted">
              אפשר לשלוח הודעה קצרה עם שעה נוחה לחזרה או נושא שחשוב לכם שנכיר לפני השיחה.
            </p>
            <a
              href="#"
              onClick={() => trackEvent("ClickWhatsapp")}
              data-testid="whatsapp-cta"
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-extrabold text-white shadow-card transition hover:bg-accent-dark focus:outline-none focus:ring-4 focus:ring-accent/25"
            >
              <MessageCircle aria-hidden="true" className="h-5 w-5" />
              שליחת הודעה בוואטסאפ
            </a>
            <Link
              href="/stress-test"
              className="mt-3 inline-flex w-full justify-center rounded-full border border-line bg-surface px-5 py-3 font-bold text-ink shadow-card transition hover:border-accent/45 focus:outline-none focus:ring-4 focus:ring-accent/20"
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

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-[1.75rem] border border-line bg-surface p-5 shadow-card">
      <h2 className="text-xl font-black text-ink">{title}</h2>
      <p className="mt-3 leading-8 text-muted">{text}</p>
    </article>
  );
}
