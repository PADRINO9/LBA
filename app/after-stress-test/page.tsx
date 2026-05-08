import type { Metadata } from "next";
import { AfterStressTestPage } from "@/src/components/funnel/AfterStressTestPage";

export const metadata: Metadata = {
  title: "תודה | פרקטיקה פיננסית — ליאור בן ארי",
  description:
    "עמוד תודה לאחר מיפוי החוסן הפיננסי, עם הסבר על השיחה, פרטי קשר ורישיון.",
};

export default function AfterStressTestRoute() {
  return <AfterStressTestPage />;
}
