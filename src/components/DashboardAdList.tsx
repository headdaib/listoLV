"use client";

import { useState } from "react";
import { AdCard } from "./AdCard";
import type { Locale } from "@/i18n/request";

interface AdType {
  id: string;
  title: string;
  price: number | null;
  currency: string;
  city: string;
  createdAt: Date;
  images: { url: string }[];
  category: { nameRu: string; nameLv: string; nameEn: string };
  user: { name: string };
  isFavorited?: boolean;
}

interface Props {
  initialAds: AdType[];
  locale: Locale;
}

export function DashboardAdList({ initialAds, locale }: Props) {
  const [ads, setAds] = useState<AdType[]>(initialAds);
  
  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить это объявление?")) return;

    try {
      const res = await fetch(`/api/ads/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAds(ads.filter(ad => ad.id !== id));
      } else {
        alert("Ошибка при удалении");
      }
    } catch (e) {
      console.error(e);
      alert("Ошибка сети");
    }
  };

  if (ads.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-4xl mb-4">📝</p>
        <p>У вас пока нет активных объявлений.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {ads.map((ad) => (
        <AdCard 
          key={ad.id} 
          ad={ad} 
          locale={locale} 
          onDelete={handleDelete}
          editUrl={`/${locale}/ads/edit/${ad.id}`}
        />
      ))}
    </div>
  );
}
