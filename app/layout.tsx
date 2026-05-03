import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "אבחון פיננסי | פרקטיקה פיננסית — ליאור בן ארי",
  description:
    "אבחון פיננסי קצר ומקצועי לבדיקת התמונה הראשונית שלכם עם פרקטיקה פיננסית — ליאור בן ארי.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className={heebo.variable}>{children}</body>
    </html>
  );
}
