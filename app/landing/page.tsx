import type { Metadata } from "next";
import FinancialDiagnosticLanding from "@/components/FinancialDiagnosticLanding";

export const metadata: Metadata = {
  title: "עמוד נחיתה מלא | פרקטיקה פיננסית — ליאור בן ארי",
  description:
    "עמוד הנחיתה המלא המקורי של פרקטיקה פיננסית — ליאור בן ארי, נשמר לצפייה ושימוש מול הלקוח.",
};

export default function LandingPage() {
  return <FinancialDiagnosticLanding />;
}
