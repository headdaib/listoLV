import Link from "next/link";
import type { Locale } from "@/i18n/request";

interface CategoryGridProps {
  categories: {
    id: number;
    slug: string;
    nameRu: string;
    nameLv: string;
    nameEn: string;
    icon: string | null;
    _count: { ads: number };
  }[];
  locale: Locale;
}

const categoryName = (cat: CategoryGridProps["categories"][0], locale: Locale) => {
  if (locale === "lv") return cat.nameLv;
  if (locale === "en") return cat.nameEn;
  return cat.nameRu;
};

export function CategoryGrid({ categories, locale }: CategoryGridProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-white mb-6">Категории</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/${locale}/category/${cat.slug}`}
            className="group flex flex-col items-center gap-2 bg-gray-900 hover:bg-gray-800 border border-white/5 hover:border-indigo-500/30 rounded-xl p-4 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-900/10"
          >
            <span className="text-3xl">{cat.icon || "📦"}</span>
            <span className="text-sm text-gray-300 group-hover:text-white font-medium text-center transition-colors">
              {categoryName(cat, locale)}
            </span>
            <span className="text-xs text-gray-600">{cat._count.ads} объявл.</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
