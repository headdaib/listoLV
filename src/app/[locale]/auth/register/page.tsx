"use client";

import { useState } from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/request";

export default function RegisterPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const [locale, setLocale] = useState<Locale>("ru");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  params.then((p) => setLocale(p.locale));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }
    if (form.password.length < 8) {
      setError("Пароль должен быть минимум 8 символов");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password, phone: form.phone }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Ошибка регистрации");
      return;
    }

    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-gray-900 border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-white mb-3">Регистрация успешна!</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Ваш аккаунт <strong className="text-white">{form.email}</strong> был успешно создан.
            <br />Теперь вы можете войти в систему.
          </p>
          <Link
            href={`/${locale}/auth/login`}
            className="inline-block mt-6 text-indigo-400 hover:text-indigo-300 text-sm font-medium"
          >
            ← Вернуться ко входу
          </Link>
        </div>
      </div>
    );
  }

  const fields = [
    { name: "name", label: "Имя", type: "text", placeholder: "Иван Иванов" },
    { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
    { name: "phone", label: "Телефон (необязательно)", type: "tel", placeholder: "+371 2X XXX XXX" },
    { name: "password", label: "Пароль", type: "password", placeholder: "Минимум 8 символов" },
    { name: "confirmPassword", label: "Подтвердите пароль", type: "password", placeholder: "••••••••" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 items-center justify-center mb-4">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Создать аккаунт</h1>
            <p className="text-gray-500 text-sm mt-1">ListoLV — Доска объявлений</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {fields.map((f) => (
              <div key={f.name}>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">{f.label}</label>
                <input
                  id={`register-${f.name}`}
                  type={f.type}
                  name={f.name}
                  required={f.name !== "phone"}
                  value={form[f.name as keyof typeof form]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            ))}

            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all shadow-lg shadow-indigo-900/30 mt-2"
            >
              {loading ? "Создание аккаунта..." : "Зарегистрироваться"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Уже есть аккаунт?{" "}
            <Link href={`/${locale}/auth/login`} className="text-indigo-400 hover:text-indigo-300 font-medium">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
