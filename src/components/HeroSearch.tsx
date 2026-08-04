"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@/i18n/request";

export function HeroSearch({ locale }: { locale: Locale }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/${locale}/ads?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-indigo-950/30 to-gray-950 py-20 px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
          <span className="text-indigo-300 text-sm font-medium">Латвия · Latvija · Latvia</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
          Найди всё на{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            ListoLV
          </span>
        </h1>
        <p className="text-gray-400 text-lg mb-10">
          Крупнейшая доска объявлений Латвии
        </p>

        <form onSubmit={handleSearch} className="flex gap-3 max-w-xl mx-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск объявлений..."
            className="flex-1 bg-white/5 border border-white/10 text-white placeholder:text-gray-500 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white/8 transition-all"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-900/30 whitespace-nowrap"
          >
            Найти
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-600">
          <span>🚗 Транспорт</span>
          <span>🏠 Недвижимость</span>
          <span>💻 Электроника</span>
          <span>💼 Работа</span>
        </div>
      </div>
    </section>
  );
}
