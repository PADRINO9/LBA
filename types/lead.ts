export type Category =
  | "clarity"
  | "complexity"
  | "debt"
  | "family_resilience"
  | "high_complexity"
  | "income_risk"
  | "investments"
  | "lifestyle"
  | "organized"
  | "planning"
  | "pension_insurance"
  | "qualification_high"
  | "qualification_low"
  | "qualification_mid"
  | "qualification_premium"
  | "review_needed"
  | "risk"
  | "retirement"
  | "undisclosed"
  | "wealth_management";

export type QuizAnswer = {
  questionId: string;
  question: string;
  selectedOptionIds: string[];
  selectedLabels: string[];
  score: number;
  categories: Category[];
};

export type Lead = {
  id: string;
  createdAt: string;
  source: string;
  campaign: string;
  answers: QuizAnswer[];
  totalScore: number;
  dominantCategories: Category[];
  recommendedSolution: string;
  fullName: string;
  phone: string;
  email?: string;
  preferredContactTime?: string;
  consent: boolean;
  marketingConsent: boolean;
};
