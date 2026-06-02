import type { Metadata } from "next";
import FinancialDiagnosticLanding from "@/components/FinancialDiagnosticLanding";

export const metadata: Metadata = {
  title: "פרקטיקה פיננסית — ליאור בן ארי",
  description:
    "דף הנחיתה של פרקטיקה פיננסית — ליאור בן ארי, עם מידע על תכנון פיננסי ויצירת קשר.",
};

export default function StressTestPage() {
  return <FinancialDiagnosticLanding />;
}
