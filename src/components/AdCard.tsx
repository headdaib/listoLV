import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { FavoriteButton } from "./FavoriteButton";
import type { Locale } from "@/i18n/request";

interface AdCardProps {
  ad: {
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
  };
  locale: Locale;
  onDelete?: (id: string) => void;
  editUrl?: string;
}

const categoryName = (cat: AdCardProps["ad"]["category"], locale: Locale) => {
  if (locale === "lv") return cat.nameLv;
  if (locale === "en") return cat.nameEn;
  return cat.nameRu;
};

export function AdCard({ ad, locale, onDelete }: AdCardProps) {
  const thumb = ad.images[0]?.url;
  const timeAgo = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  // eslint-disable-next-line react-hooks/purity
  const diffMs = Date.now() - new Date(ad.createdAt).getTime();
  const diffHours = Math.round(diffMs / 3600000);
  const timeLabel =
    diffHours < 24
      ? timeAgo.format(-diffHours, "hours")
      : timeAgo.format(-Math.round(diffHours / 24), "days");

  return (
    <Link href={`/${locale}/ads/${ad.id}`} className="group block">
      <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-900/20 transition-all duration-300 hover:-translate-y-0.5">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gray-800 overflow-hidden">
          {thumb ? (
            <Image
              src={thumb}
              alt={ad.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-600 text-4xl">
              📷
            </div>
          )}
          <div className="absolute top-2 left-2 z-10">
            <FavoriteButton adId={ad.id} initialFavorited={ad.isFavorited || false} locale={locale} />
          </div>
          {(onDelete || editUrl) && (
            <div className="absolute bottom-2 right-2 z-20 flex gap-2">
              {editUrl && (
                <Link
                  href={editUrl}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-indigo-500/80 hover:bg-indigo-500 text-white p-2 rounded-lg backdrop-blur-sm transition-colors shadow-lg"
                  title="Редактировать объявление"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </Link>
              )}
              {onDelete && (
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(ad.id); }}
                  className="bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-lg backdrop-blur-sm transition-colors shadow-lg"
                  title="Удалить объявление"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          )}
          <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full z-10">
            {categoryName(ad.category, locale)}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-sm line-clamp-2 mb-2 group-hover:text-indigo-300 transition-colors">
            {ad.title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-indigo-400 font-bold text-base">
              {ad.price ? formatPrice(Number(ad.price), ad.currency) : "Договорная"}
            </span>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>📍 {ad.city}</span>
            <span>{timeLabel}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
