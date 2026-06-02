import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "תודה | פרקטיקה פיננסית — ליאור בן ארי",
  description:
    "עמוד תודה לאחר מיפוי החוסן הפיננסי, עם הסבר על השיחה, פרטי קשר ורישיון.",
};

export default function AfterStressTestRoute() {
  redirect("/");
}
