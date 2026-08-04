"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SettingsFormProps {
  user: {
    name: string;
    phone: string | null;
  };
}

export function SettingsForm({ user }: SettingsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: user.name,
    phone: user.phone || "",
    currentPassword: "",
    newPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Ошибка при сохранении настроек");
      }

      setSuccess("Настройки успешно сохранены!");
      setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "" }));
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="p-4 bg-red-500/10 border border-red-500 text-red-500 rounded-lg text-sm">{error}</div>}
      {success && <div className="p-4 bg-green-500/10 border border-green-500 text-green-500 rounded-lg text-sm">{success}</div>}
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Имя</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-gray-950 border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Телефон</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full bg-gray-950 border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div className="pt-4 border-t border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Смена пароля</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Текущий пароль</label>
            <input
              type="password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              className="w-full bg-gray-950 border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Новый пароль</label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              className="w-full bg-gray-950 border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all"
      >
        {loading ? "Сохранение..." : "Сохранить изменения"}
      </button>
    </form>
  );
}
