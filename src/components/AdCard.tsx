import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
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
  };
  locale: Locale;
}

const categoryName = (cat: AdCardProps["ad"]["category"], locale: Locale) => {
  if (locale === "lv") return cat.nameLv;
  if (locale === "en") return cat.nameEn;
  return cat.nameRu;
};

export function AdCard({ ad, locale }: AdCardProps) {
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
          <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
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
