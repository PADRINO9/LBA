export type QuestionOption = {
  id: string;
  label: string;
  score: number;
  category?: string;
};

export type Question = {
  id: string;
  text: string;
  options: QuestionOption[];
};

export type QuizAnswer = {
  questionId: string;
  selectedOptionId: string;
  label: string;
  score: number;
  category?: string;
};

export type RecommendedSolution =
  | "מיפוי בהירות ראשוני"
  | "בדיקת סדר פיננסי"
  | "בדיקת חוסן פיננסי"
  | "Stress Test פיננסי מעמיק";

export type Lead = {
  id: string;
  createdAt: string;
  source?: string;
  campaign?: string;
  answers: QuizAnswer[];
  totalScore: number;
  dominantCategories: string[];
  recommendedSolution: RecommendedSolution;
  fullName: string;
  phone: string;
  email?: string;
  preferredContactTime?: string;
  contactConsent: boolean;
  marketingConsent: boolean;
};
