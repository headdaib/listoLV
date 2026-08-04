"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@prisma/client";

interface Props {
  categories: Category[];
  locale: string;
  ad: {
    id: string;
    title: string;
    description: string;
    price: string | null;
    city: string;
    categoryId: number;
  };
}

export function EditAdForm({ categories, locale, ad }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [form, setForm] = useState({
    title: ad.title,
    description: ad.description,
    price: ad.price ? String(ad.price) : "",
    city: ad.city,
    categoryId: String(ad.categoryId),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const priceVal = form.price ? parseFloat(form.price) : null;
      const adData = {
        title: form.title,
        description: form.description,
        price: priceVal,
        currency: "EUR",
        city: form.city,
        categoryId: parseInt(form.categoryId, 10),
      };

      const res = await fetch(`/api/ads/${ad.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Ошибка при сохранении объявления");
      }

      router.push(`/${locale}/dashboard`);
      router.refresh();
      
    } catch (err: any) {
      setError(err.message || "Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  };

  const parentCats = categories.filter(c => !c.parentId);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-gray-900 border border-white/10 p-8 rounded-2xl shadow-xl mt-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Редактировать объявление</h1>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Категория</label>
          <select
            name="categoryId"
            required
            value={form.categoryId}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="" disabled className="bg-gray-900">Выберите категорию</option>
            {parentCats.map(parent => (
              <optgroup key={parent.id} label={parent.nameRu} className="bg-gray-900 font-bold">
                {categories.filter(c => c.parentId === parent.id).map(child => (
                  <option key={child.id} value={child.id} className="font-normal">
                    {child.nameRu}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Заголовок</label>
          <input
            type="text"
            name="title"
            required
            minLength={5}
            maxLength={200}
            value={form.title}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 text-white placeholder:text-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Описание</label>
          <textarea
            name="description"
            required
            minLength={20}
            rows={5}
            value={form.description}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 text-white placeholder:text-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Цена (€)</label>
            <input
              type="number"
              name="price"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 text-white placeholder:text-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Город</label>
            <input
              type="text"
              name="city"
              required
              value={form.city}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 text-white placeholder:text-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3.5 rounded-lg transition-all shadow-lg shadow-indigo-900/30 mt-6 text-lg"
      >
        {loading ? "Сохранение..." : "Сохранить изменения"}
      </button>
    </form>
  );
}
