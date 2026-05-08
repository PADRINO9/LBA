"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  ClipboardCheck,
  Compass,
  HelpCircle,
  Landmark,
  Layers,
  LockKeyhole,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Play,
  ShieldCheck,
  Target,
  WalletCards,
} from "lucide-react";
import type { ReactNode } from "react";
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

const trustBadges = [
  "16 שנות ניסיון",
  "רישיון פנסיוני מוסמך",
  "שיחת התאמה ללא התחייבות",
  "ללא המלצות אוטומטיות",
];

const trustTopics = [
  {
    icon: WalletCards,
    title: "רמת חיים והוצאות",
    text: "בדיקה ראשונית של אזורים שבהם רמת חיים, התחייבויות ותזרים עשויים ליצור עומס שקט לאורך זמן.",
  },
  {
    icon: Landmark,
    title: "פנסיה וביטוחים",
    text: "הבנה האם יש מקום לבדיקה מקצועית של כפילויות, פערים או התאמות שלא נבדקו לאחרונה.",
  },
  {
    icon: Target,
    title: "השקעות וחסכונות",
    text: "מבט מסודר על השאלה האם הנכסים, טווח הזמן ורמת הסיכון עובדים יחד בצורה עקבית.",
  },
  {
    icon: Layers,
    title: "חוסן משפחתי",
    text: "חיבור בין הכנסה, אחריות משפחתית, נכסים ותכנון קדימה באופן רגוע ומקצועי.",
  },
];

const callSteps = [
  {
    title: "הבנת התמונה הראשונית",
    text: "נעבור על התשובות שעלו במיפוי ונבין מה חשוב לכם לבדוק לפני שמתקדמים.",
  },
  {
    title: "זיהוי אזורים לבדיקה",
    text: "נבחן האם קיימים נושאים שדורשים סדר, איסוף נתונים או בדיקה מקצועית עמוקה יותר.",
  },
  {
    title: "בדיקת התאמה להמשך",
    text: "נסביר האם יש היגיון בהמשך תהליך, מה הוא עשוי לכלול, ומה אפשר להשאיר לשלב מאוחר יותר.",
  },
  {
    title: "בלי החלטה במקום",
    text: "השיחה נועדה לייצר בהירות ראשונית, לא ללחוץ עליכם לקבל החלטה מיידית.",
  },
];

const trustQuestions = [
  "האם רמת החיים הנוכחית נשענת על מבנה פיננסי מספיק עמיד?",
  "האם יש פער בין הכנסה גבוהה לבין חוסן לטווח ארוך?",
  "האם הפנסיה, הביטוחים וההשקעות עובדים יחד או רק קיימים במקביל?",
  "איפה עלולות להסתתר נזילות שקטות שלא רואים בדוח אחד?",
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
            <div className="glass-border rounded-[2rem] bg-accent-dark p-6 text-white shadow-soft dark:bg-[#0b3038] sm:p-8 lg:p-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-4 py-2 text-sm font-bold text-accent shadow-card">
                <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
                הפרטים נשלחו בהצלחה
              </div>
              <h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl">
                הפרטים התקבלו. תודה.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/82 sm:text-xl">
                לפני שנחזור אליך — כמה מילים על פרקטיקה פיננסית ועל מה שצפוי בשיחה.
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {trustBadges.map((badge) => (
                  <div
                    key={badge}
                    className="flex items-center gap-3 rounded-2xl border border-white/14 bg-white/10 px-4 py-3 text-sm font-extrabold text-white"
                  >
                    <ShieldCheck aria-hidden="true" className="h-4 w-4 shrink-0" />
                    {badge}
                  </div>
                ))}
              </div>
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
        <div className="mx-auto grid max-w-6xl gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="overflow-hidden rounded-[2rem] border border-line bg-surface shadow-soft">
            <div className="relative h-72 sm:h-96">
              <Image
                src="/lior-pic/lior3.png"
                alt="ליאור בן ארי בפגישת ליווי פיננסי"
                fill
                className="object-cover object-center"
                sizes="(min-width: 1024px) 480px, 100vw"
              />
            </div>
          </div>
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-bold text-accent shadow-card">
              <Compass aria-hidden="true" className="h-4 w-4" />
              למה לבדוק דווקא עכשיו?
            </div>
            <h2 className="text-3xl font-black leading-tight text-ink sm:text-4xl">
              ככל שהמערכת הכלכלית גדלה, כך חשוב יותר לעצור ולבדוק אותה בצורה מסודרת.
            </h2>
            <div className="space-y-4 text-lg leading-8 text-muted">
              <p>
                אנשים שמגיעים לפרקטיקה פיננסית הם לעיתים קרובות אנשים מצליחים: עובדים קשה, מרוויחים היטב, בנו רמת חיים גבוהה ודואגים למשפחה.
              </p>
              <p>
                דווקא כשהמערכת כוללת הכנסות, פנסיה, ביטוחים, השקעות, התחייבויות ורמת חיים גבוהה, עלולים להיווצר פערים שקטים שכדאי לבדוק לפני שמקבלים החלטות לטווח ארוך.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-bold text-accent shadow-card">
                <ClipboardCheck aria-hidden="true" className="h-4 w-4" />
                מה עלה מהמיפוי?
              </div>
              <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight text-ink sm:text-4xl">
                השיחה תתמקד באזורים שבהם כדאי לייצר בהירות, לא בהבטחות או המלצות אוטומטיות.
              </h2>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trustTopics.map((topic) => {
              const Icon = topic.icon;

              return (
                <InfoCard
                  key={topic.title}
                  icon={<Icon aria-hidden="true" className="h-6 w-6" />}
                  title={topic.title}
                  text={topic.text}
                />
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-line/80 bg-accent-dark px-4 py-12 text-white dark:bg-[#0b3038] sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-sm font-bold text-white">
              <HelpCircle aria-hidden="true" className="h-4 w-4" />
              שאלות שנבדוק בזהירות
            </span>
            <h2 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">
              המטרה היא להבין איפה כדאי להעמיק, ולא לאבחן אתכם דרך שאלון.
            </h2>
            <p className="mt-4 text-lg leading-8 text-white/78">
              אלה דוגמאות לשאלות שמגיעות מהעמוד המלא הישן, ונשמרו כאן כמסגרת אמון לפני השיחה.
            </p>
          </div>
          <div className="grid gap-3">
            {trustQuestions.map((question) => (
              <div
                key={question}
                className="flex items-start gap-3 rounded-2xl border border-white/12 bg-white/8 p-4"
              >
                <CheckCircle2 aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-white" />
                <p className="text-base font-semibold leading-7 text-white/92">{question}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-4">
          {callSteps.map((step, index) => (
            <article key={step.title} className="rounded-[1.75rem] border border-line bg-surface p-5 shadow-card">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-black text-ink">{step.title}</h2>
                <span className="text-3xl font-black text-accent/25">0{index + 1}</span>
              </div>
              <p className="mt-3 leading-8 text-muted">{step.text}</p>
            </article>
          ))}
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
                  מי עומד מאחורי התהליך?
                </h2>
                <p className="mt-2 leading-8 text-muted">
                  פרקטיקה פיננסית — ליאור בן ארי פועלת בתחום התכנון הפיננסי, הפנסיוני וההשקעות, עם דגש על מיפוי חוסן פיננסי לאנשים ומשפחות בעלות מבנה כלכלי מורכב.
                </p>
                <p className="mt-3 font-extrabold leading-8 text-ink">
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

function InfoCard({
  icon,
  title,
  text,
}: {
  icon?: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-[1.75rem] border border-line bg-surface p-5 shadow-card">
      {icon ? <div className="mb-4 text-accent">{icon}</div> : null}
      <h2 className="text-xl font-black text-ink">{title}</h2>
      <p className="mt-3 leading-8 text-muted">{text}</p>
    </article>
  );
}
