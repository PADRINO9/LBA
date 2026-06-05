"use client";

import Image from "next/image";
import Link from "next/link";
import { Moon, Sun, Type } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

export const LEGAL_DISCLAIMER =
  "המידע בדף זה הינו כללי ואינפורמטיבי בלבד, ואינו מהווה ייעוץ פנסיוני, ייעוץ השקעות, שיווק פנסיוני, המלצה או הצעה לביצוע פעולה פיננסית כלשהי. כל פעולה תיעשה רק לאחר בדיקה אישית ומקצועית המותאמת לנתוני הלקוח ובהתאם להוראות הדין.";

type FunnelShellProps = {
  children: ReactNode;
  ctaHref?: string;
  ctaLabel?: string;
};

export function FunnelShell({ children, ctaHref, ctaLabel }: FunnelShellProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLargeText, setIsLargeText] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("lior-theme");
    const savedTextSize = window.localStorage.getItem("lior-large-text");
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;

    setIsDarkMode(savedTheme ? savedTheme === "dark" : prefersDark);
    setIsLargeText(savedTextSize === "true");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("theme-dark", isDarkMode);
    window.localStorage.setItem("lior-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    document.documentElement.classList.toggle("large-text", isLargeText);
    window.localStorage.setItem("lior-large-text", String(isLargeText));
  }, [isLargeText]);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <a href="#main" className="skip-link">
        דלגו לתוכן המרכזי
      </a>

      <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link
            href="/landing"
            className="flex min-w-0 items-center gap-3 rounded-full focus:outline-none focus:ring-4 focus:ring-accent/20"
            aria-label="פרקטיקה פיננסית — ליאור בן ארי"
          >
            <span className="flex h-12 w-20 items-center justify-center overflow-hidden rounded-2xl border border-line bg-surface shadow-card sm:h-14 sm:w-28">
              <Image
                src="/lba-logo-header.png"
                alt="לוגו פרקטיקה פיננסית — ליאור בן ארי"
                width={180}
                height={92}
                className="h-full w-full object-contain p-1.5"
                priority
              />
            </span>
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="text-sm font-extrabold text-ink sm:text-base">
                פרקטיקה פיננסית
              </span>
              <span className="text-xs font-semibold text-muted sm:text-sm">
                ליאור בן ארי
              </span>
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            {ctaHref && ctaLabel ? (
              <Link
                href={ctaHref}
                className="hidden rounded-full bg-accent px-4 py-2 text-sm font-bold text-white shadow-card transition hover:bg-accent-dark focus:outline-none focus:ring-4 focus:ring-accent/25 dark:text-slate-950 sm:inline-flex"
              >
                {ctaLabel}
              </Link>
            ) : null}
            <button
              type="button"
              onClick={() => setIsLargeText((value) => !value)}
              className="inline-flex h-10 min-w-10 items-center justify-center gap-1 rounded-full border border-line bg-surface px-3 text-sm font-extrabold text-ink shadow-card transition hover:border-accent/45 focus:outline-none focus:ring-4 focus:ring-accent/20"
              aria-pressed={isLargeText}
              aria-label={isLargeText ? "החזרת גודל טקסט רגיל" : "הגדלת טקסט"}
              title="הגדלת טקסט"
            >
              <Type aria-hidden="true" className="h-4 w-4" />
              AA
            </button>
            <button
              type="button"
              onClick={() => setIsDarkMode((value) => !value)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink shadow-card transition hover:border-accent/45 focus:outline-none focus:ring-4 focus:ring-accent/20"
              aria-pressed={isDarkMode}
              aria-label={isDarkMode ? "מעבר למצב בהיר" : "מעבר למצב כהה"}
              title={isDarkMode ? "מצב בהיר" : "מצב כהה"}
            >
              {isDarkMode ? (
                <Sun aria-hidden="true" className="h-4 w-4" />
              ) : (
                <Moon aria-hidden="true" className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}

export function FunnelFooter() {
  return (
    <footer className="border-t border-line bg-surface/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8 text-sm text-muted sm:px-6">
        <div>
          <p className="font-extrabold text-ink">פרקטיקה פיננסית — ליאור בן ארי</p>
          <p className="mt-1">
            פועל ברישיון פנסיוני מוסמך מטעם משרד האוצר | מספר רישיון: L-00137167
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 font-bold text-accent" aria-label="קישורי מידע">
          <Link href="/privacy" className="rounded-sm focus:outline-none focus:ring-4 focus:ring-accent/20">
            מדיניות פרטיות
          </Link>
          <Link href="/accessibility" className="rounded-sm focus:outline-none focus:ring-4 focus:ring-accent/20">
            הצהרת נגישות
          </Link>
        </nav>
        <p className="max-w-5xl leading-7">{LEGAL_DISCLAIMER}</p>
      </div>
    </footer>
  );
}
