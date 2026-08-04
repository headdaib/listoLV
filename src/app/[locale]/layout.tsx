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
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale as Locale;
  const messages = await getMessages();
  const session = await auth();

  return (
    <html lang={locale}>
      <body>
        <SessionProvider session={session}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#030712]">
              {/* Premium Background Effects */}
              <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent blur-[120px] pointer-events-none -z-10" />
              <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />
              
              <div className="z-10 flex flex-col min-h-screen">
                <Navbar locale={locale} />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </div>
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
