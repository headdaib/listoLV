"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import type { Locale } from "@/i18n/request";

const langs = [
  { code: "ru", label: "РУ" },
  { code: "lv", label: "LV" },
  { code: "en", label: "EN" },
];

export function Navbar({ locale }: { locale: Locale }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-gray-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">ListoLV</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href={`/${locale}/ads`}
              className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
            >
              Объявления
            </Link>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
              {langs.map((l) => (
                <button
                  key={l.code}
                  onClick={() => switchLocale(l.code)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    locale === l.code
                      ? "bg-indigo-600 text-white shadow"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {session ? (
              <div className="flex items-center gap-3">
                <Link
                  href={`/${locale}/favorites`}
                  className="text-gray-300 hover:text-white text-sm font-medium transition-colors flex items-center gap-1"
                >
                  <span className="text-red-500">❤️</span> Избранное
                </Link>
                <Link
                  href={`/${locale}/dashboard`}
                  className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
                >
                  Кабинет
                </Link>
                <Link
                  href={`/${locale}/ads/create`}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all shadow-lg shadow-indigo-900/30"
                >
                  + Подать объявление
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: `/${locale}` })}
                  className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href={`/${locale}/auth/login`}
                  className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
                >
                  Войти
                </Link>
                <Link
                  href={`/${locale}/auth/register`}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all shadow-lg shadow-indigo-900/30"
                >
                  Регистрация
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Burger */}
          <button
            className="md:hidden text-gray-400 hover:text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="w-5 h-0.5 bg-current mb-1 transition-all" />
            <div className="w-5 h-0.5 bg-current mb-1 transition-all" />
            <div className="w-5 h-0.5 bg-current transition-all" />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/10 py-4 space-y-3">
            <Link href={`/${locale}/ads`} className="block text-gray-300 hover:text-white py-2">
              Объявления
            </Link>
            <div className="flex gap-2">
              {langs.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { switchLocale(l.code); setMenuOpen(false); }}
                  className={`px-3 py-1.5 rounded text-xs font-bold ${
                    locale === l.code ? "bg-indigo-600 text-white" : "bg-white/5 text-gray-400"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            {session ? (
              <>
                <Link href={`/${locale}/favorites`} className="block text-gray-300 hover:text-white py-2 flex items-center gap-1">
                  <span className="text-red-500">❤️</span> Избранное
                </Link>
                <Link href={`/${locale}/dashboard`} className="block text-gray-300 hover:text-white py-2">
                  Кабинет
                </Link>
                <Link
                  href={`/${locale}/ads/create`}
                  className="block bg-indigo-600 text-white text-center py-2 rounded-lg font-semibold"
                >
                  + Подать объявление
                </Link>
                <button onClick={() => signOut()} className="block text-gray-500 py-2 text-sm">
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link href={`/${locale}/auth/login`} className="block text-gray-300 hover:text-white py-2">
                  Войти
                </Link>
                <Link
                  href={`/${locale}/auth/register`}
                  className="block bg-indigo-600 text-white text-center py-2 rounded-lg font-semibold"
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
