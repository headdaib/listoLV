import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import type { Metadata } from "next";
import { locales, type Locale } from "@/i18n/request";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "ListoLV",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const session = await auth();

  return (
    <html lang={locale}>
      <body>
        <SessionProvider session={session}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <div className="min-h-screen flex flex-col bg-gray-950">
              <Navbar locale={locale} />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
