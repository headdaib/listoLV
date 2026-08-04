import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

export const locales = ["ru", "lv", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ru";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
