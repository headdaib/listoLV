"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Locale } from "@/i18n/request";

export default function VerifyPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const [locale, setLocale] = useState<Locale>("ru");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const searchParams = useSearchParams();

  params.then((p) => setLocale(p.locale));

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("error");
      return;
    }

    fetch(`/api/auth/verify?token=${token}`)
      .then((r) => r.json())
      .then((data) => {
        setStatus(data.success ? "success" : "error");
      })
      .catch(() => setStatus("error"));
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
        {status === "loading" && (
          <>
            <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Проверяем ссылку...</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-white mb-3">Email подтверждён!</h2>
            <p className="text-gray-400 text-sm mb-6">Теперь вы можете войти в аккаунт.</p>
            <Link
              href={`/${locale}/auth/login`}
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg transition-all"
            >
              Войти
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-white mb-3">Ссылка недействительна</h2>
            <p className="text-gray-400 text-sm mb-6">
              Ссылка истекла или уже была использована. Попробуйте зарегистрироваться снова.
            </p>
            <Link href={`/${locale}/auth/register`} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
              ← Регистрация
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
