"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Locale } from "@/i18n/request";

export default function LoginPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const [locale, setLocale] = useState<Locale>("ru");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || `/${locale}`;

  // Resolve locale from params
  params.then((p) => setLocale(p.locale));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Неверный email или пароль");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 items-center justify-center mb-4">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Войти в аккаунт</h1>
            <p className="text-gray-500 text-sm mt-1">ListoLV — Доска объявлений</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 text-white placeholder:text-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Пароль</label>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 text-white placeholder:text-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              id="login-submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all shadow-lg shadow-indigo-900/30"
            >
              {loading ? "Вход..." : "Войти"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Нет аккаунта?{" "}
            <Link href={`/${locale}/auth/register`} className="text-indigo-400 hover:text-indigo-300 font-medium">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
