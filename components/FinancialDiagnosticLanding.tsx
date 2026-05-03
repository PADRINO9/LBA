"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardCheck,
  Clock3,
  Compass,
  HelpCircle,
  Landmark,
  Layers,
  LockKeyhole,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  WalletCards,
} from "lucide-react";
import { trackEvent } from "@/lib/tracking";
import type { Category, Lead, QuizAnswer } from "@/types/lead";

type QuizOption = {
  id: string;
  label: string;
  score: number;
  category?: Category;
};

type QuizQuestion = {
  id: string;
  question: string;
  multi?: boolean;
  options: QuizOption[];
};

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  preferredContactTime: string;
  consent: boolean;
  marketingConsent: boolean;
};

const questions: QuizQuestion[] = [
  {
    id: "current-state",
    question: "מה הכי מתאר את המצב הכלכלי שלכם כיום?",
    options: [
      { id: "high-income-lifestyle", label: "הכנסה גבוהה ורמת חיים בהתאם", score: 3, category: "lifestyle" },
      { id: "good-income-missing-picture", label: "הכנסה טובה, אבל חסרה לי תמונה מלאה", score: 3, category: "clarity" },
      { id: "assets-without-order", label: "יש נכסים/חסכונות/השקעות אבל אין מספיק סדר", score: 4, category: "complexity" },
      { id: "hidden-gaps-check", label: "אני בעיקר רוצה לבדוק אם יש פערים שלא ראיתי", score: 2, category: "risk" },
    ],
  },
  {
    id: "income-range",
    question: "מה טווח ההכנסה החודשית נטו של משק הבית?",
    options: [
      { id: "up-to-25", label: "עד 25,000 ₪", score: 1, category: "qualification_low" },
      { id: "25-40", label: "25,000–40,000 ₪", score: 2, category: "qualification_mid" },
      { id: "40-60", label: "40,000–60,000 ₪", score: 4, category: "qualification_high" },
      { id: "above-60", label: "מעל 60,000 ₪", score: 5, category: "qualification_premium" },
      { id: "prefer-not", label: "מעדיף/ה לא לציין כרגע", score: 2, category: "undisclosed" },
    ],
  },
  {
    id: "quiet-leaks",
    question: "איפה אתם מרגישים שהכסף 'נוזל' בלי שאתם רואים תמונה מלאה?",
    options: [
      { id: "lifestyle-spend", label: "רמת חיים והוצאות שוטפות", score: 3, category: "lifestyle" },
      { id: "insurance-pension-products", label: "ביטוחים, פנסיה ומוצרים פיננסיים", score: 4, category: "pension_insurance" },
      { id: "unchecked-investments", label: "השקעות וחסכונות שלא נבדקו לעומק", score: 4, category: "investments" },
      { id: "commitments-debt", label: "התחייבויות, משכנתא או הלוואות", score: 3, category: "debt" },
      { id: "cannot-identify", label: "אני לא יודע לזהות בדיוק", score: 4, category: "clarity" },
    ],
  },
  {
    id: "structure-clarity",
    question: "עד כמה המבנה הפיננסי שלכם מרגיש מסודר וברור?",
    options: [
      { id: "very-organized", label: "מסודר וברור מאוד", score: 1, category: "organized" },
      { id: "not-reviewed-lately", label: "סביר, אבל לא עבר בדיקה מקצועית לאחרונה", score: 2, category: "review_needed" },
      { id: "many-parts", label: "יש הרבה חלקים ולא בטוח שהם עובדים יחד", score: 4, category: "complexity" },
      { id: "too-complex-alone", label: "מרגיש מורכב מדי לניהול לבד", score: 5, category: "high_complexity" },
    ],
  },
  {
    id: "risk-to-reduce",
    question: "מה הסיכון שהכי חשוב לכם לצמצם?",
    options: [
      { id: "income-drop", label: "ירידה בהכנסה או שינוי בקריירה", score: 4, category: "income_risk" },
      { id: "retirement-readiness", label: "חוסר מוכנות לפרישה", score: 5, category: "retirement" },
      { id: "pension-insurance-errors", label: "טעויות או כפילויות בביטוחים/פנסיה", score: 4, category: "pension_insurance" },
      { id: "no-investment-strategy", label: "ניהול השקעות וחסכונות בלי אסטרטגיה ברורה", score: 4, category: "investments" },
      { id: "family-lifestyle", label: "שמירה על רמת החיים של המשפחה לאורך זמן", score: 3, category: "family_resilience" },
    ],
  },
  {
    id: "call-outcome",
    question: "מה הייתם רוצים לקבל משיחת התאמה ראשונית?",
    options: [
      { id: "professional-risk-view", label: "מבט מקצועי על נקודות התורפה", score: 4, category: "risk" },
      { id: "financial-clarity", label: "סדר ובהירות בתמונה הפיננסית", score: 3, category: "clarity" },
      { id: "deeper-planning-fit", label: "בדיקה אם יש מקום לתכנון פיננסי עמוק יותר", score: 4, category: "planning" },
      { id: "wealth-management-shift", label: "הבנה איך לעבור מניהול שגרה לניהול הון", score: 5, category: "wealth_management" },
    ],
  },
];

const coreTopics = [
  { icon: WalletCards, title: "נזילות שקטות", text: "אזורים שבהם רמת חיים, הוצאות והתחייבויות עלולות לשחוק חוסן בלי שמרגישים." },
  { icon: Landmark, title: "פנסיה וביטוחים", text: "פערים, כפילויות או מבנה מוצרים שלא בהכרח מתאים לשלב החיים הנוכחי." },
  { icon: Target, title: "השקעות וחסכונות", text: "בדיקת התאמה ראשונית בין נכסים, טווח זמן, סיכון ומטרות משפחתיות." },
  { icon: Layers, title: "חוסן משפחתי ארוך טווח", text: "האם ההכנסה, הנכסים וההגנות תומכים ברמת החיים גם בתרחישים משתנים." },
];

const planningSteps = [
  {
    title: "שיחת היכרות",
    text: "מבינים מי אתם, מה מטריד אתכם ומה חשוב לכם להשיג לפני שנכנסים לפרטים.",
  },
  {
    title: "בדיקה מסודרת",
    text: "ממפים את הנושאים המרכזיים ומזהים איפה יש צורך בבדיקה עמוקה יותר.",
  },
  {
    title: "תוכנית פעולה",
    text: "מקבלים כיוון ברור: מה דחוף, מה כדאי לבדוק, ומה יכול לחכות.",
  },
  {
    title: "ליווי לפי צורך",
    text: "אם יש התאמה, ממשיכים לליווי מקצועי שמותאם לשינויים בחיים ולא רק למצב של היום.",
  },
];

const criticalQuestions = [
  "האם רמת החיים הנוכחית נשענת על מבנה פיננסי מספיק עמיד?",
  "האם יש פער בין ההכנסה הגבוהה לבין החוסן לטווח ארוך?",
  "האם הפנסיה, הביטוחים וההשקעות עובדים יחד או רק קיימים במקביל?",
  "איפה עלולות להסתתר נזילות שקטות שלא רואים בדוח אחד?",
];

const faqs = [
  {
    question: "האם מיפוי החוסן מחייב אותי להמשיך לתהליך מלא?",
    answer: "לא. המיפוי הראשוני נועד להציף אזורים לבדיקה ולהבין התאמה לשיחה מקצועית, בלי התחייבות להמשך.",
  },
  {
    question: "מה קורה אחרי שאני משאיר פרטים?",
    answer: "נחזור אליכם לשיחת התאמה קצרה, נבין את התמונה הראשונית ונבדוק האם יש מקום להמשך בדיקה מקצועית.",
  },
  {
    question: "האם צריך להעביר מסמכים כבר עכשיו?",
    answer: "לא. בשלב הראשון עונים על 6 שאלות בלבד. אם תהיה התאמה להמשך, יוסבר אילו נתונים נדרשים ולמה.",
  },
  {
    question: "האם המיפוי נותן המלצה פיננסית אוטומטית?",
    answer: "לא. אין כאן תחזית, הבטחה או המלצה. כל פעולה אפשרית תיעשה רק לאחר בדיקה אישית ומקצועית בהתאם לדין.",
  },
];

const categoryLabels: Record<Category, string> = {
  clarity: "סדר ובהירות",
  complexity: "מורכבות פיננסית",
  debt: "התחייבויות ומשכנתא",
  family_resilience: "חוסן משפחתי",
  high_complexity: "מורכבות גבוהה",
  income_risk: "סיכון הכנסה",
  investments: "השקעות וחסכונות",
  lifestyle: "רמת חיים והוצאות",
  organized: "מבנה מסודר",
  planning: "תכנון קדימה",
  pension_insurance: "פנסיה וביטוחים",
  qualification_high: "הכנסה גבוהה",
  qualification_low: "התאמת קהל ראשונית",
  qualification_mid: "הכנסה בינונית-גבוהה",
  qualification_premium: "הכנסה פרימיום",
  review_needed: "נדרשת בדיקה עדכנית",
  risk: "נקודות תורפה",
  retirement: "תכנון פרישה",
  undisclosed: "הכנסה לא צוינה",
  wealth_management: "ניהול הון",
};

function getRecommendedSolution(score: number) {
  if (score <= 8) return "מיפוי בהירות ראשוני";
  if (score <= 15) return "בדיקת סדר פיננסי";
  if (score <= 23) return "בדיקת חוסן פיננסי";
  return "Stress Test פיננסי מעמיק";
}

function getDominantCategories(answers: QuizAnswer[]) {
  const counts = answers.reduce<Record<Category, number>>((acc, answer) => {
    answer.categories.forEach((category) => {
      acc[category] = (acc[category] ?? 0) + 1;
    });
    return acc;
  }, {} as Record<Category, number>);

  return (Object.entries(counts) as [Category, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([category]) => category);
}

function PrimaryButton({
  children,
  onClick,
  type = "button",
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-base font-semibold text-white shadow-card transition duration-200 hover:bg-accent-dark focus:outline-none focus:ring-4 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-line bg-white/70 px-6 py-3 text-base font-semibold text-ink transition duration-200 hover:border-accent/50 hover:text-accent focus:outline-none focus:ring-4 focus:ring-accent/15 ${className}`}
    >
      {children}
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/65 px-4 py-2 text-sm font-semibold text-accent">
      <Sparkles className="h-4 w-4" />
      {children}
    </span>
  );
}

function Header({ onStart }: { onStart: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
        <PrimaryButton onClick={onStart} className="min-h-10 px-4 py-2 text-sm">
          התחילו מיפוי
        </PrimaryButton>
        <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-xl border border-line bg-white shadow-card sm:h-28 sm:w-44">
          <Image
            src="/logo4-header.png"
            alt="ליאור בן ארי | פרקטיקה פיננסית"
            fill
            className="object-contain p-1"
            sizes="176px"
            priority
          />
        </div>
      </div>
    </header>
  );
}

function Hero({ onStart, onHowItWorks }: { onStart: () => void; onHowItWorks: () => void }) {
  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-10 pt-7 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-16 lg:pt-12">
      <div className="relative z-10">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-4 py-2 text-sm font-semibold text-accent-dark shadow-card">
          <ShieldCheck className="h-4 w-4" />
          מיפוי חוסן פיננסי
        </div>
        <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.08] tracking-normal text-ink sm:text-5xl lg:text-[3.35rem]">
          הכנסה גבוהה היא לא תמיד חוסן כלכלי
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
          מיפוי חוסן פיננסי קצר לבעלי הכנסה גבוהה, שנועד להציף נקודות תורפה שקטות במבנה הכלכלי — עוד לפני שהן הופכות לבעיה.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <PrimaryButton onClick={onStart}>
            התחילו מיפוי של 120 שניות
            <ArrowLeft className="h-5 w-5" />
          </PrimaryButton>
          <SecondaryButton onClick={onHowItWorks}>מה בודקים במיפוי?</SecondaryButton>
        </div>
        <p className="mt-4 max-w-xl text-sm font-semibold leading-6 text-accent-dark">
          ללא התחייבות. ללא הבטחות. רק מיפוי ראשוני שמטרתו לעשות סדר.
        </p>
        <div className="mt-7 grid gap-3 text-sm sm:grid-cols-3">
          <div className="rounded-xl border border-line bg-white/70 p-4 shadow-card">
            <div className="font-bold text-ink">120 שניות</div>
            <div className="mt-1 text-muted">מיפוי קצר וממוקד</div>
          </div>
          <div className="rounded-xl border border-line bg-white/70 p-4 shadow-card">
            <div className="font-bold text-ink">16 שנות ניסיון</div>
            <div className="mt-1 text-muted">בכסף גדול ומבנים מורכבים</div>
          </div>
          <div className="rounded-xl border border-line bg-white/70 p-4 shadow-card">
            <div className="font-bold text-ink">ללא הבטחות תשואה</div>
            <div className="mt-1 text-muted">אבחון ראשוני ואחראי</div>
          </div>
        </div>
      </div>

      <div className="glass-border overflow-hidden rounded-[1.75rem] bg-white shadow-soft">
        <div className="relative p-3 sm:p-4">
          <div className="relative h-[390px] overflow-hidden rounded-[1.35rem] bg-accent-dark sm:h-[500px]">
            <Image
              src="/lior-pic/lior1.png"
              alt="ליאור בן ארי, פרקטיקה פיננסית"
              fill
              className="object-cover object-[58%_center]"
              sizes="(min-width: 1024px) 560px, 100vw"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function WealthPlanningSection() {
  return (
    <section id="full-picture" className="border-y border-line/80 bg-white/50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="mb-10 grid gap-6 rounded-[1.5rem] border border-line bg-white p-6 shadow-soft lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
          <div>
            <SectionLabel>למה לבדוק דווקא עכשיו?</SectionLabel>
            <h2 className="mt-5 text-3xl font-bold leading-tight text-ink sm:text-4xl">
              למה דווקא אנשים מצליחים צריכים לבדוק את המבנה הפיננסי?
            </h2>
          </div>
          <div className="space-y-4 text-lg leading-8 text-muted">
            <p>
              רוב האנשים שמגיעים לפרקטיקה פיננסית הם אנשים מצליחים. הם עובדים קשה, מרוויחים היטב, בנו רמת חיים גבוהה ודואגים שלמשפחה שלהם לא יחסר דבר.
            </p>
            <p>
              אבל דווקא ככל שהמערכת הכלכלית גדלה — הכנסות, פנסיה, ביטוחים, השקעות, התחייבויות ורמת חיים — כך היא הופכת מורכבת יותר ורגישה יותר לנזילות שקטות.
            </p>
            <p>
              אחרי 16 שנים שבהן ליאור בן ארי ראה איך כסף גדול באמת מתנהל, נבנה מיפוי קצר שמטרתו לעזור לזהות איפה כדאי לעצור, לבדוק, ולבנות חוסן פיננסי אמיתי.
            </p>
          </div>
        </div>
        <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {["16 שנות ניסיון", "רישיון פנסיוני מוסמך", "מיפוי קצר של 120 שניות", "שיחת התאמה ללא התחייבות"].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-4 shadow-card">
              <ShieldCheck className="h-5 w-5 shrink-0 text-accent" />
              <span className="text-sm font-bold text-ink">{item}</span>
            </div>
          ))}
        </div>
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <SectionLabel>מה בודקים במיפוי</SectionLabel>
            <h2 className="mt-5 text-3xl font-bold leading-tight text-ink sm:text-4xl">
              מחפשים פערים בין הכנסה, רמת חיים, נכסים וחוסן לטווח ארוך
            </h2>
            <p className="mt-4 text-lg leading-8 text-muted">
              המיפוי לא נותן המלצה אוטומטית. הוא מציף אזורים שבהם כדאי לבדוק אם המבנה הכלכלי באמת תומך ברמת החיים ובאחריות המשפחתית לאורך זמן.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {coreTopics.map((topic) => {
                const Icon = topic.icon;
                return (
                  <article key={topic.title} className="rounded-xl border border-line bg-paper/60 p-5">
                    <Icon className="h-6 w-6 text-accent" />
                    <h3 className="mt-4 text-lg font-bold text-ink">{topic.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{topic.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
          <div className="glass-border overflow-hidden rounded-[2rem] bg-white shadow-soft">
            <div className="relative h-72 sm:h-96">
              <Image
                src="/lior-pic/lior3.png"
                alt="ליאור בן ארי בפגישת ליווי פיננסי למשפחה"
                fill
                className="object-cover object-center"
                sizes="(min-width: 1024px) 520px, 100vw"
              />
            </div>
            <div className="border-t border-line bg-white p-5">
              <div className="flex items-center gap-3 text-accent-dark">
                <Compass className="h-5 w-5" />
                <h3 className="text-xl font-bold">חוסן משפחתי לטווח ארוך</h3>
              </div>
              <p className="mt-3 text-base leading-7 text-muted">
                המטרה היא לא להפחיד ולא להבטיח חיסכון, אלא להבין אם יש פערים שקטים שכדאי לבדוק בצורה מקצועית ואחראית.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessSection({ onStart }: { onStart: () => void }) {
  return (
    <section id="process" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="grid gap-7 lg:grid-cols-[0.76fr_1.24fr] lg:items-start">
        <div>
          <SectionLabel>איך זה עובד</SectionLabel>
          <h2 className="mt-5 text-3xl font-bold leading-tight text-ink sm:text-4xl">
            תהליך קצר שמפריד בין מיפוי ראשוני לבין בדיקה מקצועית
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted">
            קודם מציפים אזורי סיכון שקטים, אחר כך בודקים אם יש התאמה לשיחה מקצועית. אין המלצות אוטומטיות ואין החלטות במקום.
          </p>
          <PrimaryButton onClick={onStart} className="mt-7">
            לתיאום בדיקה ראשונית
            <ArrowLeft className="h-5 w-5" />
          </PrimaryButton>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {planningSteps.map((step, index) => (
            <article key={step.title} className="rounded-xl border border-line bg-white p-5 shadow-card">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-bold text-ink">{step.title}</h3>
                <span className="text-3xl font-bold text-accent/22">0{index + 1}</span>
              </div>
              <p className="mt-3 text-base leading-7 text-muted">{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuestionsSection() {
  return (
    <section id="questions" className="border-y border-line/80 bg-accent-dark text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:py-16">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
            <HelpCircle className="h-4 w-4" />
            שאלות שמביאות אנשים לבדיקה
          </span>
          <h2 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl">
            השאלות שכדאי לעצור ולבדוק לפני שממשיכים
          </h2>
          <p className="mt-4 text-lg leading-8 text-white/78">
            אם אחת מהשאלות האלה מוכרת לכם, האבחון יעזור להבין איפה להתחיל ומה כדאי לברר קודם.
          </p>
        </div>
        <div className="grid gap-3">
          {criticalQuestions.map((question) => (
            <div key={question} className="flex items-start gap-3 rounded-2xl border border-white/12 bg-white/8 p-4">
              <Check className="mt-1 h-5 w-5 shrink-0 text-white" />
              <p className="text-base font-semibold leading-7 text-white/92">{question}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VideoSection({ onContinue }: { onContinue: () => void }) {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="grid gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <SectionLabel>לפני שמתחילים</SectionLabel>
          <h2 className="mt-5 text-3xl font-bold leading-tight text-ink sm:text-4xl">לפני שמתחילים — למה בכלל צריך Stress Test פיננסי?</h2>
          <p className="mt-4 text-lg leading-8 text-muted">
            בסרטון קצר ליאור מסביר למה בעלי הכנסה גבוהה עלולים לפספס סיכונים שקטים, ומה מטרת המיפוי הראשוני.
          </p>
          <PrimaryButton onClick={onContinue} className="mt-7">
            המשך לאבחון
            <ArrowLeft className="h-5 w-5" />
          </PrimaryButton>
        </div>
        <div className="glass-border overflow-hidden rounded-[1.5rem] bg-white p-3 shadow-soft">
          <div className="relative h-[300px] overflow-hidden rounded-[1.15rem] bg-accent-dark sm:h-[420px]">
            <video
              src="/lior-pic/mp_.mp4"
              poster="/lior-pic/lior2.png"
              controls
              playsInline
              preload="metadata"
              className="h-full w-full object-cover object-[58%_center]"
              aria-label="סרטון היכרות עם ליאור בן ארי"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function DiagnosticQuiz({
  onComplete,
}: {
  onComplete: (answers: QuizAnswer[], totalScore: number, dominantCategories: Category[], recommendedSolution: string) => void;
}) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const current = questions[index];
  const selectedForQuestion = selected[current.id] ?? [];
  const progress = ((index + 1) / questions.length) * 100;

  const chooseOption = (optionId: string) => {
    setSelected((previous) => {
      const active = previous[current.id] ?? [];
      const nextSelection = current.multi
        ? active.includes(optionId)
          ? active.filter((id) => id !== optionId)
          : [...active, optionId]
        : [optionId];

      return { ...previous, [current.id]: nextSelection };
    });
  };

  const buildAnswers = () =>
    questions.map<QuizAnswer>((question) => {
      const selectedIds = selected[question.id] ?? [];
      const options = question.options.filter((option) => selectedIds.includes(option.id));
      return {
        questionId: question.id,
        question: question.question,
        selectedOptionIds: selectedIds,
        selectedLabels: options.map((option) => option.label),
        score: options.reduce((sum, option) => sum + option.score, 0),
        categories: options.map((option) => option.category).filter(Boolean) as Category[],
      };
    });

  const goNext = () => {
    if (!selectedForQuestion.length) return;
    if (index < questions.length - 1) {
      setIndex((value) => value + 1);
      return;
    }

    const answers = buildAnswers();
    const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0);
    const dominantCategories = getDominantCategories(answers);
    const recommendedSolution = getRecommendedSolution(totalScore);
    trackEvent("CompleteStressTest", { totalScore, dominantCategories, recommendedSolution });
    onComplete(answers, totalScore, dominantCategories, recommendedSolution);
  };

  return (
    <section id="quiz" className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:py-20">
      <div className="glass-border overflow-hidden rounded-[2rem] bg-white p-5 shadow-soft sm:p-8">
        <div className="mb-7">
          <p className="text-sm font-bold text-accent">מיפוי חוסן פיננסי</p>
          <h2 className="mt-2 text-3xl font-bold leading-tight text-ink sm:text-4xl">6 שאלות קצרות שיעזרו להציף אזורים שכדאי לבדוק במבנה הפיננסי שלכם.</h2>
        </div>
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 text-sm font-semibold text-muted">
            <span>שאלה {index + 1} מתוך {questions.length}</span>
            {current.multi ? <span>ניתן לבחור יותר מאפשרות אחת</span> : <span>בחרו תשובה אחת</span>}
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-paper">
            <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div key={current.id} className="animate-[fadeIn_220ms_ease-out]">
          <h2 className="text-2xl font-bold leading-tight text-ink sm:text-4xl">{current.question}</h2>
          <div className="mt-7 grid gap-3">
            {current.options.map((option) => {
              const isActive = selectedForQuestion.includes(option.id);
              return (
                <button
                  type="button"
                  key={option.id}
                  onClick={() => chooseOption(option.id)}
                  className={`flex min-h-20 items-center justify-between gap-4 rounded-3xl border p-4 text-right transition duration-200 sm:p-5 ${
                    isActive
                      ? "border-accent bg-accent/8 shadow-card"
                      : "border-line bg-paper/40 hover:border-accent/45 hover:bg-white"
                  }`}
                >
                  <span className="text-base font-semibold leading-7 text-ink sm:text-lg">{option.label}</span>
                  <span
                    className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${
                      isActive ? "border-accent bg-accent text-white" : "border-line bg-white text-transparent"
                    }`}
                  >
                    <Check className="h-4 w-4" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <SecondaryButton onClick={() => setIndex((value) => Math.max(0, value - 1))} className={index === 0 ? "invisible" : ""}>
            <ArrowRight className="h-5 w-5" />
            חזרה
          </SecondaryButton>
          <PrimaryButton onClick={goNext} disabled={!selectedForQuestion.length}>
            {index === questions.length - 1 ? "הצגת תוצאה" : "המשך"}
            <ArrowLeft className="h-5 w-5" />
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
}

function ResultAndLeadForm({
  answers,
  totalScore,
  dominantCategories,
  recommendedSolution,
  onLead,
}: {
  answers: QuizAnswer[];
  totalScore: number;
  dominantCategories: Category[];
  recommendedSolution: string;
  onLead: (lead: Lead) => void;
}) {
  const [form, setForm] = useState<FormState>({
    fullName: "",
    phone: "",
    email: "",
    preferredContactTime: "",
    consent: false,
    marketingConsent: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const canSubmit = form.fullName.trim() && form.phone.trim() && form.consent;

  const updateForm = (key: keyof FormState, value: string | boolean) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const submitLead = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    if (!canSubmit) return;

    const lead: Lead = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      source: "facebook",
      campaign: "financial-stress-test-landing",
      answers,
      totalScore,
      dominantCategories,
      recommendedSolution,
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
      preferredContactTime: form.preferredContactTime.trim() || undefined,
      consent: form.consent,
      marketingConsent: form.marketingConsent,
    };

    console.log("Lead object", lead);
    trackEvent("Lead", { id: lead.id, recommendedSolution, totalScore, dominantCategories });
    onLead(lead);
  };

  return (
    <section id="result" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-border rounded-[2rem] bg-accent-dark p-6 text-white shadow-soft sm:p-8">
          <p className="text-sm font-semibold text-white/70">התוצאה הראשונית שלכם</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">{recommendedSolution}</h2>
          <p className="mt-5 text-lg leading-8 text-white/82">
            לפי התשובות שלכם, נראה שיש במבנה הפיננסי כמה נקודות שכדאי לבדוק בצורה מסודרת.
          </p>
          <div className="mt-7 rounded-3xl border border-white/14 bg-white/8 p-5">
            <div className="text-sm text-white/68">נושאים שעלו באבחון</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(dominantCategories.length ? dominantCategories : ["planning" as Category]).map((category) => (
                <span key={category} className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-accent-dark">
                  {categoryLabels[category]}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-6 flex items-center gap-3 text-white/78">
            <Clock3 className="h-5 w-5" />
            <span className="text-sm">ציון אבחון פנימי: {totalScore}. הוא משמש להתאמת השיחה בלבד.</span>
          </div>
          <p className="mt-6 text-base leading-7 text-white/82">
            המיפוי הראשוני לא נועד לתת תחזית אוטומטית או המלצה פיננסית, אלא להציף אזורים שבהם ייתכן שיש פער בין רמת החיים הנוכחית לבין החוסן הכלכלי לטווח ארוך.
          </p>
        </div>

        <form onSubmit={submitLead} className="glass-border rounded-[2rem] bg-white p-6 shadow-soft sm:p-8">
          <h2 className="text-3xl font-bold leading-tight text-ink">רוצים לבדוק את זה בצורה מקצועית?</h2>
          <p className="mt-4 text-lg leading-8 text-muted">
            השאירו פרטים ונחזור אליכם לשיחת התאמה קצרה. מטרת השיחה היא להבין את התמונה הראשונית, לבדוק האם יש מקום להמשך בדיקה מקצועית, ולהסביר מה ניתן לעשות בצורה מסודרת ואחראית.
          </p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <Field
              label="שם מלא"
              required
              value={form.fullName}
              onChange={(value) => updateForm("fullName", value)}
              error={submitted && !form.fullName.trim() ? "נא למלא שם מלא" : undefined}
            />
            <Field
              label="טלפון"
              required
              type="tel"
              value={form.phone}
              onChange={(value) => updateForm("phone", value)}
              error={submitted && !form.phone.trim() ? "נא למלא מספר טלפון" : undefined}
            />
            <Field label="אימייל" type="email" value={form.email} onChange={(value) => updateForm("email", value)} />
            <Field
              label="זמן נוח ליצירת קשר"
              value={form.preferredContactTime}
              onChange={(value) => updateForm("preferredContactTime", value)}
            />
          </div>
          <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-3xl border border-line bg-paper/50 p-4">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(event) => updateForm("consent", event.target.checked)}
              className="mt-1 h-5 w-5 accent-accent"
            />
            <span className="text-sm font-medium leading-6 text-ink">
              אני מאשר/ת יצירת קשר מצד פרקטיקה פיננסית — ליאור בן ארי.
              {submitted && !form.consent ? <span className="block text-accent-dark">נדרש אישור ליצירת קשר.</span> : null}
            </span>
          </label>
          <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-3xl border border-line bg-white p-4">
            <input
              type="checkbox"
              checked={form.marketingConsent}
              onChange={(event) => updateForm("marketingConsent", event.target.checked)}
              className="mt-1 h-5 w-5 accent-accent"
            />
            <span className="text-sm font-medium leading-6 text-ink">
              אני מאשר/ת קבלת תכנים מקצועיים ועדכונים מפרקטיקה פיננסית. ניתן להסיר את ההסכמה בכל עת.
            </span>
          </label>
          <PrimaryButton type="submit" className="mt-6 w-full">
            אפשר לחזור אליי
            <ArrowLeft className="h-5 w-5" />
          </PrimaryButton>
          <div className="mt-4 grid gap-3 text-sm font-semibold text-ink sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-xl border border-line bg-paper/45 px-3 py-3">
              <ShieldCheck className="h-4 w-4 text-accent" />
              רישיון L-00137167
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-line bg-paper/45 px-3 py-3">
              <LockKeyhole className="h-4 w-4 text-accent" />
              פרטיות מלאה
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-line bg-paper/45 px-3 py-3">
              <Clock3 className="h-4 w-4 text-accent" />
              שיחה קצרה וברורה
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted">
            השארת פרטים אינה מהווה התחייבות לקבלת שירות. כל המלצה או פעולה תיעשה רק לאחר בדיקה אישית ובהתאם להוראות הדין.
          </p>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-ink">
        {label}
        {required ? <span className="text-accent"> *</span> : null}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`h-12 w-full rounded-xl border bg-paper/35 px-4 py-3 text-base text-ink outline-none transition placeholder:text-muted/60 focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/10 ${
          error ? "border-accent-dark" : "border-line"
        }`}
      />
      {error ? <span className="mt-1 block text-sm font-medium text-accent-dark">{error}</span> : null}
    </label>
  );
}

function ThankYouPage({ onRestart }: { onRestart: () => void }) {
  useEffect(() => {
    trackEvent("ViewThankYou");
  }, []);

  return (
    <main className="min-h-screen bg-paper text-ink">
      <Header onStart={onRestart} />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-20">
        <div className="grid gap-7 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="glass-border rounded-[2rem] bg-accent-dark p-7 text-white shadow-soft sm:p-10">
            <SectionLabel>תודה</SectionLabel>
            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl">הפרטים התקבלו. תודה.</h1>
            <p className="mt-5 text-xl leading-8 text-white/82">
              נחזור אליכם לשיחת התאמה קצרה מטעם פרקטיקה פיננסית — ליאור בן ארי, כדי להבין האם יש מקום להמשך בדיקה מקצועית.
            </p>
          </div>
          <div className="grid gap-4">
            <InfoBlock
              title="מה יקרה בשיחה?"
              text="בשיחה נבין את התמונה הראשונית, נעבור על האזורים שעלו במיפוי, ונבדוק האם יש מקום ל-Stress Test פיננסי מעמיק יותר."
            />
            <InfoBlock
              title="מה לא יקרה בשיחה?"
              text="זו לא שיחת מכירה אגרסיבית, לא תחזית אוטומטית ולא המלצה פיננסית במקום. המטרה היא להבין התאמה ולהסביר את האפשרויות בצורה אחראית."
            />
            <InfoBlock
              title="מי עומד מאחורי התהליך?"
              text="פרקטיקה פיננסית — ליאור בן ארי פועלת בתחום התכנון הפיננסי, הפנסיוני וההשקעות, עם דגש על מיפוי חוסן פיננסי לאנשים ומשפחות בעלות מבנה כלכלי מורכב."
            />
          </div>
        </div>
        <div className="mt-7 grid gap-4 rounded-[2rem] border border-line bg-white p-5 shadow-card sm:grid-cols-2 lg:grid-cols-4">
          <ContactItem icon={<MapPin className="h-5 w-5" />} label="כתובת" value="יצחק מודעי 2, רחובות" />
          <ContactItem icon={<Phone className="h-5 w-5" />} label="טלפון" value="03-686-1371" />
          <ContactItem icon={<Mail className="h-5 w-5" />} label="אימייל" value="office@pra-fin.co.il" />
          <a
            href="https://wa.me/97236861371"
            className="flex min-h-20 items-center gap-3 rounded-3xl border border-line bg-paper/60 p-4 font-semibold text-accent transition hover:border-accent/50 hover:bg-white"
          >
            <MessageCircle className="h-5 w-5" />
            שליחת הודעה בוואטסאפ
          </a>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function InfoBlock({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-[1.5rem] border border-line bg-white p-5 shadow-card">
      <h2 className="text-xl font-bold text-ink">{title}</h2>
      <p className="mt-3 text-base leading-7 text-muted">{text}</p>
    </article>
  );
}

function ContactItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex min-h-20 items-center gap-3 rounded-3xl border border-line bg-paper/60 p-4">
      <span className="text-accent">{icon}</span>
      <span>
        <span className="block text-xs font-semibold text-muted">{label}</span>
        <span className="block text-sm font-bold text-ink">{value}</span>
      </span>
    </div>
  );
}

function FAQSection() {
  return (
    <section id="faq" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
      <div className="grid gap-7 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
        <div>
          <SectionLabel>לפני שמשאירים פרטים</SectionLabel>
          <h2 className="mt-5 text-3xl font-bold leading-tight text-ink sm:text-4xl">שאלות שמורידות חשש ומבהירות את הצעד הבא</h2>
          <p className="mt-4 text-lg leading-8 text-muted">
            המטרה היא להבין האם יש נקודות שכדאי לבדוק, בלי להבטיח תוצאה ובלי לדחוף להחלטה במקום.
          </p>
          <div className="mt-6 grid gap-3 text-sm font-semibold text-ink">
            <div className="flex items-center gap-3 rounded-xl border border-line bg-white p-4">
              <LockKeyhole className="h-5 w-5 text-accent" />
              הפרטים משמשים ליצירת קשר ולשיחת התאמה
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-line bg-white p-4">
              <ClipboardCheck className="h-5 w-5 text-accent" />
              אין צורך לקבל החלטה בשיחה הראשונה
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-line bg-white p-4">
              <RefreshCw className="h-5 w-5 text-accent" />
              אין המלצה פיננסית אוטומטית
            </div>
          </div>
        </div>
        <div className="grid gap-4">
          {faqs.map((item) => (
            <article key={item.question} className="rounded-2xl border border-line bg-white p-5 shadow-card">
              <h3 className="text-lg font-bold leading-7 text-ink">{item.question}</h3>
              <p className="mt-2 text-base leading-7 text-muted">{item.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line bg-white/45">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-4 text-sm leading-7 text-muted lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="font-bold text-ink">פרקטיקה פיננסית — ליאור בן ארי</p>
            <p>יצחק מודעי 2, רחובות, ישראל, 7608804</p>
            <p>03-686-1371</p>
            <p>office@pra-fin.co.il</p>
            <p className="mt-2 font-semibold text-ink">
              פועל ברישיון פנסיוני מוסמך מטעם משרד האוצר | מספר רישיון: L-00137167
            </p>
            <div className="mt-3 flex flex-wrap gap-3 font-semibold text-accent">
              <a href="#privacy" className="focus:outline-none focus:ring-4 focus:ring-accent/15">מדיניות פרטיות</a>
              <a href="#accessibility" className="focus:outline-none focus:ring-4 focus:ring-accent/15">הצהרת נגישות</a>
            </div>
          </div>
          <p>
            המידע בדף זה הינו כללי ואינפורמטיבי בלבד, ואינו מהווה ייעוץ פנסיוני, ייעוץ השקעות, שיווק
            פנסיוני, המלצה או הצעה לביצוע פעולה פיננסית כלשהי. כל פעולה תיעשה רק לאחר בדיקה אישית
            ומקצועית המותאמת לנתוני הלקוח ובהתאם להוראות הדין.
          </p>
        </div>
        <div className="mt-6 grid gap-4 text-sm leading-7 text-muted sm:grid-cols-2">
          <p id="privacy">
            <span className="font-bold text-ink">מדיניות פרטיות: </span>
            הפרטים שתשאירו ישמשו ליצירת קשר ולבדיקת התאמה ראשונית בלבד. לא מתבצעת בשלב זה שליחה למערכות CRM, דיוור, Google Sheets, Supabase או Make.
          </p>
          <p id="accessibility">
            <span className="font-bold text-ink">הצהרת נגישות: </span>
            הדף נבנה עם תוויות לשדות, ניווט מקלדת, מצבי פוקוס ברורים וטקסטים שאינם מוטמעים כתמונה בלבד.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function FinancialDiagnosticLanding() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [result, setResult] = useState<{
    answers: QuizAnswer[];
    totalScore: number;
    dominantCategories: Category[];
    recommendedSolution: string;
  } | null>(null);
  const [thankYou, setThankYou] = useState(false);
  const quizRef = useRef<HTMLDivElement | null>(null);
  const detailsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    trackEvent("PageView", { source: "facebook", campaign: "financial-stress-test-landing" });
  }, []);

  useEffect(() => {
    if (quizStarted && quizRef.current) {
      quizRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [quizStarted]);

  useEffect(() => {
    if (result) {
      document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  const startQuiz = () => {
    if (!quizStarted) {
      trackEvent("StartStressTest");
    }
    setQuizStarted(true);
  };

  const scrollToVideo = () => {
    detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const reset = () => {
    setThankYou(false);
    setResult(null);
    setQuizStarted(true);
    setTimeout(() => document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const resultPayload = useMemo(() => result, [result]);

  if (thankYou) {
    return <ThankYouPage onRestart={reset} />;
  }

  return (
    <main className="min-h-screen text-ink">
      <Header onStart={startQuiz} />
      <Hero onStart={startQuiz} onHowItWorks={scrollToVideo} />
      <div ref={detailsRef}>
        <WealthPlanningSection />
      </div>
      <ProcessSection onStart={startQuiz} />
      <QuestionsSection />
      <VideoSection onContinue={startQuiz} />
      <div ref={quizRef}>
        {quizStarted && !resultPayload ? (
          <DiagnosticQuiz
            onComplete={(answers, totalScore, dominantCategories, recommendedSolution) =>
              setResult({ answers, totalScore, dominantCategories, recommendedSolution })
            }
          />
        ) : null}
      </div>
      {resultPayload ? (
        <ResultAndLeadForm
          answers={resultPayload.answers}
          totalScore={resultPayload.totalScore}
          dominantCategories={resultPayload.dominantCategories}
          recommendedSolution={resultPayload.recommendedSolution}
          onLead={() => setThankYou(true)}
        />
      ) : null}
      <FAQSection />
      <Footer />
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
