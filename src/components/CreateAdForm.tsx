"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "./ImageUploader";
import type { Category } from "@prisma/client";

interface Props {
  categories: Category[];
  locale: string;
}

export function CreateAdForm({ categories, locale }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<File[]>([]);
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    city: "",
    categoryId: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Upload images if any
      let uploadedUrls: string[] = [];
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach(file => formData.append("files", file));

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          throw new Error("Ошибка при загрузке изображений");
        }

        const uploadData = await uploadRes.json();
        uploadedUrls = uploadData.urls;
      }

      // 2. Create the ad
      const priceVal = form.price ? parseFloat(form.price) : null;
      const adData = {
        title: form.title,
        description: form.description,
        price: priceVal,
        currency: "EUR",
        city: form.city,
        categoryId: parseInt(form.categoryId, 10),
        images: uploadedUrls,
      };

      const res = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Ошибка при создании объявления");
      }

      // Success
      router.push(`/${locale}/ads/${data.ad.id}`);
      router.refresh();
      
    } catch (err: any) {
      setError(err.message || "Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  };

  // Group categories by parent
  const parentCats = categories.filter(c => !c.parentId);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-gray-900 border border-white/10 p-8 rounded-2xl shadow-xl mt-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Создать объявление</h1>
        <p className="text-gray-400 text-sm">Заполните детали, чтобы покупатели могли быстрее найти ваш товар.</p>
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
            placeholder="Например: Велосипед горный Scott, 29 дюймов"
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
            placeholder="Подробно опишите товар или услугу..."
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
              placeholder="0.00"
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
              placeholder="Рига, Юрмала..."
              className="w-full bg-white/5 border border-white/10 text-white placeholder:text-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>
        
        <div className="pt-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Фотографии</label>
          <ImageUploader onImagesChange={setImages} maxImages={10} />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-semibold py-3.5 rounded-lg transition-all shadow-lg shadow-indigo-900/30 mt-6 text-lg"
      >
        {loading ? "Публикация..." : "Опубликовать объявление"}
      </button>
    </form>
  );
}
