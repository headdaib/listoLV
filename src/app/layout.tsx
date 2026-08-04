import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: {
    default: "ListoLV — Доска объявлений Латвии",
    template: "%s | ListoLV",
  },
  description: "Крупнейшая доска объявлений Латвии. Купи и продай автомобиль, недвижимость, электронику и многое другое.",
  keywords: ["объявления", "латвия", "sludinājumi", "classified ads"],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    alternateLocale: ["lv_LV", "en_US"],
    siteName: "ListoLV",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
