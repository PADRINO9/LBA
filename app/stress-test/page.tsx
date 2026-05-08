import type { Metadata } from "next";
import { StressTestFunnel } from "@/src/components/funnel/StressTestFunnel";

export const metadata: Metadata = {
  title: "Financial Stress Test | פרקטיקה פיננסית — ליאור בן ארי",
  description:
    "מיפוי חוסן פיננסי קצר וכללי להצפת נקודות תורפה שקטות לפני שיחת התאמה מקצועית.",
};

export default function StressTestPage() {
  return <StressTestFunnel />;
}
