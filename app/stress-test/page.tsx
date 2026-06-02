import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Financial Stress Test | פרקטיקה פיננסית — ליאור בן ארי",
  description:
    "מיפוי חוסן פיננסי קצר וכללי להצפת נקודות תורפה שקטות לפני שיחת התאמה מקצועית.",
};

export default function StressTestPage() {
  redirect("/");
}
