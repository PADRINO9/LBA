"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { FormEvent, RefObject } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { FunnelFooter, FunnelShell } from "./FunnelShell";
import { trackEvent } from "@/src/lib/tracking";
import type {
  Lead,
  Question,
  QuizAnswer,
  RecommendedSolution,
} from "@/src/types/funnel";

type LeadFormState = {
  fullName: string;
  phone: string;
  email: string;
  preferredContactTime: string;
  contactConsent: boolean;
  marketingConsent: boolean;
};

type LeadFormErrors = Partial<Record<keyof LeadFormState, string>>;

const QUESTIONS: Question[] = [
  {
    id: "current-state",
    text: "מה הכי מתאר את המצב הכלכלי שלכם כיום?",
    options: [
      { id: "high-income-lifestyle", label: "הכנסה גבוהה ורמת חיים בהתאם", score: 3, category: "lifestyle" },
      { id: "good-income-missing-picture", label: "הכנסה טובה, אבל חסרה לי תמונה מלאה", score: 3, category: "clarity" },
      { id: "assets-without-order", label: "יש נכסים/חסכונות/השקעות אבל אין מספיק סדר", score: 4, category: "complexity" },
      { id: "hidden-gaps-check", label: "אני בעיקר רוצה לבדוק אם יש פערים שלא ראיתי", score: 2, category: "risk" },
    ],
  },
  {
    id: "income-range",
    text: "מה טווח ההכנסה החודשית נטו של משק הבית?",
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
    text: "איפה אתם מרגישים שהכסף 'נוזל' בלי שאתם רואים תמונה מלאה?",
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
    text: "עד כמה המבנה הפיננסי שלכם מרגיש מסודר וברור?",
    options: [
      { id: "very-organized", label: "מסודר וברור מאוד", score: 1, category: "organized" },
      { id: "not-reviewed-lately", label: "סביר, אבל לא עבר בדיקה מקצועית לאחרונה", score: 2, category: "review_needed" },
      { id: "many-parts", label: "יש הרבה חלקים ולא בטוח שהם עובדים יחד", score: 4, category: "complexity" },
      { id: "too-complex-alone", label: "מרגיש מורכב מדי לניהול לבד", score: 5, category: "high_complexity" },
    ],
  },
  {
    id: "risk-to-reduce",
    text: "מה הסיכון שהכי חשוב לכם לצמצם?",
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
    text: "מה הייתם רוצים לקבל משיחת התאמה ראשונית?",
    options: [
      { id: "professional-risk-view", label: "מבט מקצועי על נקודות התורפה", score: 4, category: "risk" },
      { id: "financial-clarity", label: "סדר ובהירות בתמונה הפיננסית", score: 3, category: "clarity" },
      { id: "deeper-planning-fit", label: "בדיקה אם יש מקום לתכנון פיננסי עמוק יותר", score: 4, category: "planning" },
      { id: "wealth-management-shift", label: "הבנה איך לעבור מניהול שגרה לניהול הון", score: 5, category: "wealth_management" },
    ],
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  clarity: "סדר ובהירות",
  complexity: "מורכבות פיננסית",
  debt: "התחייבויות ומשכנתא",
  family_resilience: "חוסן משפחתי",
  high_complexity: "מורכבות גבוהה",
  income_risk: "סיכון הכנסה",
  investments: "השקעות וחסכונות",
  lifestyle: "רמת חיים והוצאות",
  organized: "מבנה מסודר",
  planning: "תכנון פיננסי",
  pension_insurance: "פנסיה וביטוחים",
  qualification_high: "הכנסה גבוהה",
  qualification_low: "התאמת קהל ראשונית",
  qualification_mid: "הכנסה בינונית-גבוהה",
  qualification_premium: "הכנסה פרימיום",
  review_needed: "בדיקה עדכנית",
  risk: "נקודות תורפה",
  retirement: "פרישה",
  undisclosed: "הכנסה לא צוינה",
  wealth_management: "ניהול הון",
};

const initialFormState: LeadFormState = {
  fullName: "",
  phone: "",
  email: "",
  preferredContactTime: "",
  contactConsent: false,
  marketingConsent: false,
};

function getRecommendedSolution(score: number): RecommendedSolution {
  if (score <= 8) return "מיפוי בהירות ראשוני";
  if (score <= 15) return "בדיקת סדר פיננסי";
  if (score <= 23) return "בדיקת חוסן פיננסי";
  return "Stress Test פיננסי מעמיק";
}

function getDominantCategories(answers: QuizAnswer[]) {
  const counts = answers.reduce<Record<string, number>>((acc, answer) => {
    if (!answer.category) return acc;
    acc[answer.category] = (acc[answer.category] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([category]) => category);
}

function createLeadId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `lead-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function validateLeadForm(form: LeadFormState): LeadFormErrors {
  const errors: LeadFormErrors = {};

  if (!form.fullName.trim()) {
    errors.fullName = "כדאי להשאיר שם מלא כדי שנדע למי לחזור.";
  }

  if (!form.phone.trim()) {
    errors.phone = "נדרש מספר טלפון לחזרה.";
  }

  if (!form.contactConsent) {
    errors.contactConsent = "נדרש אישור יצירת קשר כדי לשלוח את הפרטים.";
  }

  return errors;
}

export function StressTestFunnel() {
  const router = useRouter();
  const privacyRef = useRef<HTMLDivElement>(null);
  const firstErrorRef = useRef<HTMLInputElement>(null);
  const phoneErrorRef = useRef<HTMLInputElement>(null);
  const consentErrorRef = useRef<HTMLInputElement>(null);
  const [hasStartedIntent, setHasStartedIntent] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answersByQuestion, setAnswersByQuestion] = useState<Record<string, QuizAnswer>>({});
  const [isResultVisible, setIsResultVisible] = useState(false);
  const [form, setForm] = useState<LeadFormState>(initialFormState);
  const [errors, setErrors] = useState<LeadFormErrors>({});

  useEffect(() => {
    trackEvent("PageView_StressTest", {
      source: "facebook",
      campaign: "financial-stress-test",
    });
  }, []);

  const orderedAnswers = useMemo(
    () =>
      QUESTIONS.map((question) => answersByQuestion[question.id]).filter(
        (answer): answer is QuizAnswer => Boolean(answer),
      ),
    [answersByQuestion],
  );

  const totalScore = orderedAnswers.reduce((sum, answer) => sum + answer.score, 0);
  const recommendedSolution = getRecommendedSolution(totalScore);
  const dominantCategories = getDominantCategories(orderedAnswers);
  const currentQuestion = QUESTIONS[questionIndex];
  const currentAnswer = answersByQuestion[currentQuestion.id];
  const progressPercent = ((questionIndex + 1) / QUESTIONS.length) * 100;

  function handleStartIntent() {
    if (!hasStartedIntent) {
      trackEvent("StartStressTest");
      setHasStartedIntent(true);
    }

    privacyRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function handleAcceptPrivacy() {
    if (!hasStartedIntent) {
      trackEvent("StartStressTest");
      setHasStartedIntent(true);
    }

    trackEvent("AcceptPrivacyStep");
    setPrivacyAccepted(true);
    setTimeout(() => {
      document.getElementById("quiz-panel")?.focus();
    }, 120);
  }

  function handleAnswer(optionId: string) {
    const selectedOption = currentQuestion.options.find((option) => option.id === optionId);

    if (!selectedOption) {
      return;
    }

    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedOptionId: selectedOption.id,
      label: selectedOption.label,
      score: selectedOption.score,
      category: selectedOption.category,
    };

    setAnswersByQuestion((current) => ({
      ...current,
      [currentQuestion.id]: answer,
    }));

    trackEvent("AnswerQuestion", {
      questionId: currentQuestion.id,
      selectedOptionId: selectedOption.id,
      score: selectedOption.score,
      category: selectedOption.category,
    });
  }

  function handleNext() {
    if (!currentAnswer) {
      return;
    }

    if (questionIndex < QUESTIONS.length - 1) {
      setQuestionIndex((index) => index + 1);
      return;
    }

    const finalAnswers = QUESTIONS.map((question) => answersByQuestion[question.id]).filter(
      (answer): answer is QuizAnswer => Boolean(answer),
    );
    const finalScore = finalAnswers.reduce((sum, answer) => sum + answer.score, 0);
    const finalSolution = getRecommendedSolution(finalScore);
    const finalCategories = getDominantCategories(finalAnswers);

    trackEvent("CompleteStressTest", {
      totalScore: finalScore,
      recommendedSolution: finalSolution,
      dominantCategories: finalCategories,
    });
    trackEvent("ViewResult", {
      totalScore: finalScore,
      recommendedSolution: finalSolution,
      dominantCategories: finalCategories,
    });
    setIsResultVisible(true);
  }

  function handleBack() {
    if (isResultVisible) {
      setIsResultVisible(false);
      return;
    }

    setQuestionIndex((index) => Math.max(0, index - 1));
  }

  function updateField<Field extends keyof LeadFormState>(
    field: Field,
    value: LeadFormState[Field],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateLeadForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      if (nextErrors.fullName) {
        firstErrorRef.current?.focus();
      } else if (nextErrors.phone) {
        phoneErrorRef.current?.focus();
      } else if (nextErrors.contactConsent) {
        consentErrorRef.current?.focus();
      }
      return;
    }

    const params =
      typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;

    const lead: Lead = {
      id: createLeadId(),
      createdAt: new Date().toISOString(),
      source: params?.get("source") ?? "facebook",
      campaign: params?.get("campaign") ?? "financial-stress-test",
      answers: orderedAnswers,
      totalScore,
      dominantCategories,
      recommendedSolution,
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
      preferredContactTime: form.preferredContactTime.trim() || undefined,
      contactConsent: form.contactConsent,
      marketingConsent: form.marketingConsent,
    };

    console.log("Lead object", lead);
    trackEvent("LeadSubmit", lead as unknown as Record<string, unknown>);
    router.push("/after-stress-test");
  }

  return (
    <FunnelShell ctaHref="#privacy-step" ctaLabel="התחילו מיפוי">
      <section className="px-4 pb-10 pt-8 sm:px-6 sm:pt-14">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_0.84fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-4 py-2 text-sm font-bold text-accent shadow-card">
              <ShieldCheck aria-hidden="true" className="h-4 w-4" />
              מיפוי ראשוני, כללי וללא התחייבות
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-normal text-ink sm:text-5xl lg:text-6xl">
                Financial Stress Test ב־120 שניות
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted sm:text-xl">
                מיפוי קצר שנועד להציף נקודות תורפה שקטות במבנה הכלכלי — בלי המלצות אוטומטיות ובלי התחייבות.
              </p>
              <p className="max-w-2xl rounded-2xl border border-line bg-surface/70 p-4 text-sm leading-7 text-muted shadow-card">
                המידע במיפוי הוא ראשוני וכללי בלבד, ואינו מהווה ייעוץ או המלצה פיננסית.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleStartIntent}
                data-testid="stress-start"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-7 py-3 text-base font-extrabold text-white shadow-soft transition hover:bg-accent-dark focus:outline-none focus:ring-4 focus:ring-accent/25 dark:text-slate-950"
              >
                התחילו מיפוי
              </button>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-muted">
                <Clock3 aria-hidden="true" className="h-4 w-4 text-accent" />
                6 שאלות קצרות, תוצאה ראשונית ואז השארת פרטים
              </span>
            </div>
          </div>

          <div
            ref={privacyRef}
            id="privacy-step"
            className="glass-border rounded-[2rem] bg-surface p-5 shadow-soft sm:p-7"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <LockKeyhole aria-hidden="true" className="h-6 w-6" />
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-black text-ink">רגע לפני שמתחילים</h2>
                <p className="leading-8 text-muted">
                  האתר פועל בהתאם למדיניות הפרטיות. המידע שתמסרו ישמש לצורך חזרה אליכם ובדיקת התאמה ראשונית בלבד.
                </p>
                <Link
                  href="/privacy"
                  className="inline-flex rounded-sm text-sm font-extrabold text-accent underline focus:outline-none focus:ring-4 focus:ring-accent/20"
                >
                  מדיניות פרטיות
                </Link>
                <button
                  type="button"
                  onClick={handleAcceptPrivacy}
                  data-testid="accept-privacy"
                  className="mt-2 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-ink px-6 py-3 font-extrabold text-paper shadow-card transition hover:bg-accent-dark focus:outline-none focus:ring-4 focus:ring-accent/25"
                >
                  מעולה, אפשר להתחיל
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {privacyAccepted ? (
        <section className="px-4 pb-12 sm:px-6">
          <div
            id="quiz-panel"
            tabIndex={-1}
            data-testid="quiz-panel"
            className="mx-auto max-w-4xl rounded-[2rem] border border-line bg-surface p-4 shadow-soft outline-none sm:p-7"
            aria-live="polite"
          >
            {!isResultVisible ? (
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3 text-sm font-extrabold text-accent">
                    <span>שאלה {questionIndex + 1} מתוך {QUESTIONS.length}</span>
                    <span>{Math.round(progressPercent)}%</span>
                  </div>
                  <div
                    className="h-2 overflow-hidden rounded-full bg-line"
                    role="progressbar"
                    aria-valuenow={questionIndex + 1}
                    aria-valuemin={1}
                    aria-valuemax={QUESTIONS.length}
                    aria-label={`שאלה ${questionIndex + 1} מתוך ${QUESTIONS.length}`}
                  >
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="inline-flex items-center gap-2 text-sm font-bold text-muted">
                    <Sparkles aria-hidden="true" className="h-4 w-4 text-accent" />
                    מיפוי חוסן פיננסי
                  </p>
                  <h2 className="text-2xl font-black leading-tight text-ink sm:text-3xl">
                    {currentQuestion.text}
                  </h2>
                  <p className="text-sm leading-7 text-muted">
                    6 שאלות קצרות שיעזרו להציף אזורים שכדאי לבדוק במבנה הפיננסי שלכם.
                  </p>
                </div>

                <div className="grid gap-3" role="group" aria-label={currentQuestion.text}>
                  {currentQuestion.options.map((option) => {
                    const selected = currentAnswer?.selectedOptionId === option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleAnswer(option.id)}
                        data-testid="quiz-option"
                        className={`flex min-h-16 items-center justify-between gap-4 rounded-3xl border p-4 text-right font-bold leading-7 shadow-card transition focus:outline-none focus:ring-4 focus:ring-accent/20 ${
                          selected
                            ? "border-accent bg-accent/10 text-ink"
                            : "border-line bg-paper/40 text-ink hover:border-accent/45 hover:bg-accent/5"
                        }`}
                        aria-pressed={selected}
                      >
                        <span>{option.label}</span>
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                            selected ? "border-accent bg-accent text-white dark:text-slate-950" : "border-line bg-surface"
                          }`}
                          aria-hidden="true"
                        >
                          {selected ? <CheckCircle2 aria-hidden="true" className="h-4 w-4" /> : null}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={questionIndex === 0}
                    data-testid="quiz-back"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface px-5 py-2 font-bold text-ink shadow-card transition hover:border-accent/45 focus:outline-none focus:ring-4 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    חזרה
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!currentAnswer}
                    data-testid="quiz-next"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-6 py-2 font-extrabold text-white shadow-card transition hover:bg-accent-dark focus:outline-none focus:ring-4 focus:ring-accent/25 disabled:cursor-not-allowed disabled:opacity-45 dark:text-slate-950"
                  >
                    {questionIndex === QUESTIONS.length - 1 ? "הצגת תוצאה" : "המשך"}
                    <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <ResultAndLeadForm
                dominantCategories={dominantCategories}
                errors={errors}
                consentErrorRef={consentErrorRef}
                firstErrorRef={firstErrorRef}
                form={form}
                onBack={handleBack}
                onSubmit={handleSubmit}
                phoneErrorRef={phoneErrorRef}
                recommendedSolution={recommendedSolution}
                totalScore={totalScore}
                updateField={updateField}
              />
            )}
          </div>
        </section>
      ) : null}

      <FunnelFooter />
    </FunnelShell>
  );
}

type ResultAndLeadFormProps = {
  dominantCategories: string[];
  errors: LeadFormErrors;
  consentErrorRef: RefObject<HTMLInputElement>;
  firstErrorRef: RefObject<HTMLInputElement>;
  form: LeadFormState;
  onBack: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  phoneErrorRef: RefObject<HTMLInputElement>;
  recommendedSolution: RecommendedSolution;
  totalScore: number;
  updateField: <Field extends keyof LeadFormState>(
    field: Field,
    value: LeadFormState[Field],
  ) => void;
};

function ResultAndLeadForm({
  dominantCategories,
  errors,
  consentErrorRef,
  firstErrorRef,
  form,
  onBack,
  onSubmit,
  phoneErrorRef,
  recommendedSolution,
  totalScore,
  updateField,
}: ResultAndLeadFormProps) {
  const categoryNames = dominantCategories.map(
    (category) => CATEGORY_LABELS[category] ?? category,
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
      <div className="rounded-[1.75rem] border border-accent/20 bg-accent/10 p-5 shadow-card sm:p-6">
        <p className="text-sm font-extrabold text-accent">תוצאה ראשונית</p>
        <h2 className="mt-3 text-2xl font-black leading-tight text-ink sm:text-3xl">
          תודה. לפי התשובות שלך, נראה שיש מקום לבדיקה פיננסית מסודרת יותר.
        </h2>
        <div className="mt-5 rounded-3xl bg-surface p-5 shadow-card">
          <p className="text-sm font-bold text-muted">הכיוון שעלה במיפוי</p>
          <p className="mt-1 text-2xl font-black text-accent">{recommendedSolution}</p>
          <p className="mt-2 text-xs font-bold text-muted">ציון פנימי: {totalScore}</p>
        </div>
        <p className="mt-5 leading-8 text-muted">
          המיפוי הראשוני לא נועד לתת תחזית אוטומטית או המלצה פיננסית, אלא להציף נקודות שכדאי לבחון לעומק — במיוחד כשמדובר במבנה פיננסי מורכב, רמת חיים גבוהה והחלטות לטווח ארוך.
        </p>
        {categoryNames.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2" aria-label="אזורים שעלו במיפוי">
            {categoryNames.map((category) => (
              <span
                key={category}
                className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-extrabold text-muted"
              >
                {category}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <form
        onSubmit={onSubmit}
        noValidate
        aria-labelledby="stress-lead-form-title"
        data-testid="lead-form"
        className="rounded-[1.75rem] border border-line bg-paper/50 p-5 shadow-card sm:p-6"
      >
        <div className="space-y-2">
          <h3 id="stress-lead-form-title" className="text-2xl font-black text-ink">אפשר לחזור אליך?</h3>
          <p className="leading-7 text-muted">
            כדי שנוכל לחזור אליך לשיחת התאמה קצרה, אפשר להשאיר פרטים כאן.
          </p>
        </div>

        <div className="mt-6 grid gap-4">
          <Field
            error={errors.fullName}
            id="fullName"
            inputRef={firstErrorRef}
            label="שם מלא"
            onChange={(value) => updateField("fullName", value)}
            required
            value={form.fullName}
          />
          <Field
            autoComplete="tel"
            error={errors.phone}
            id="phone"
            inputMode="tel"
            inputRef={phoneErrorRef}
            label="טלפון"
            onChange={(value) => updateField("phone", value)}
            required
            type="tel"
            value={form.phone}
          />
          <Field
            autoComplete="email"
            error={errors.email}
            id="email"
            inputMode="email"
            label="אימייל"
            onChange={(value) => updateField("email", value)}
            type="email"
            value={form.email}
          />
          <Field
            error={errors.preferredContactTime}
            id="preferredContactTime"
            label="זמן נוח לחזרה"
            onChange={(value) => updateField("preferredContactTime", value)}
            placeholder="לדוגמה: בבוקר / אחר הצהריים"
            value={form.preferredContactTime}
          />
        </div>

        <div className="mt-5 grid gap-3">
          <Checkbox
            checked={form.contactConsent}
            error={errors.contactConsent}
            id="contactConsent"
            inputRef={consentErrorRef}
            label="אני מאשר/ת יצירת קשר מצד פרקטיקה פיננסית — ליאור בן ארי."
            onChange={(checked) => updateField("contactConsent", checked)}
            required
          />
          <Checkbox
            checked={form.marketingConsent}
            id="marketingConsent"
            label="אני מאשר/ת קבלת תכנים מקצועיים ועדכונים מפרקטיקה פיננסית. ניתן להסיר את ההסכמה בכל עת."
            onChange={(checked) => updateField("marketingConsent", checked)}
          />
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line bg-surface px-5 py-2 font-bold text-ink shadow-card transition hover:border-accent/45 focus:outline-none focus:ring-4 focus:ring-accent/20"
          >
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
            חזרה לתשובות
          </button>
          <button
            type="submit"
            data-testid="lead-submit"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-7 py-3 text-base font-extrabold text-white shadow-soft transition hover:bg-accent-dark focus:outline-none focus:ring-4 focus:ring-accent/25 dark:text-slate-950"
          >
            אפשר לחזור אליי
          </button>
        </div>
      </form>
    </div>
  );
}

type FieldProps = {
  autoComplete?: string;
  error?: string;
  id: string;
  inputMode?: "email" | "tel" | "text";
  inputRef?: RefObject<HTMLInputElement>;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: "email" | "tel" | "text";
  value: string;
};

function Field({
  autoComplete,
  error,
  id,
  inputMode,
  inputRef,
  label,
  onChange,
  placeholder,
  required,
  type = "text",
  value,
}: FieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-extrabold text-ink">
        {label}
        {required ? <span aria-hidden="true" className="text-accent"> *</span> : null}
      </label>
      <input
        ref={inputRef}
        id={id}
        name={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="min-h-12 w-full rounded-2xl border border-line bg-surface px-4 py-3 text-ink shadow-card transition placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15"
      />
      {error ? (
        <p id={errorId} role="alert" className="text-sm font-bold text-red-700 dark:text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type CheckboxProps = {
  checked: boolean;
  error?: string;
  id: string;
  inputRef?: RefObject<HTMLInputElement>;
  label: string;
  onChange: (checked: boolean) => void;
  required?: boolean;
};

function Checkbox({ checked, error, id, inputRef, label, onChange, required }: CheckboxProps) {
  const errorId = `${id}-error`;

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-surface p-4 text-sm font-bold leading-7 text-ink shadow-card transition hover:border-accent/45 focus-within:ring-4 focus-within:ring-accent/20"
      >
        <input
          ref={inputRef}
          id={id}
          name={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="mt-1 h-5 w-5 rounded border-line text-accent focus:ring-4 focus:ring-accent/20"
        />
        <span>
          {label}
          {required ? <span aria-hidden="true" className="text-accent"> *</span> : null}
        </span>
      </label>
      {error ? (
        <p id={errorId} role="alert" className="text-sm font-bold text-red-700 dark:text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
