import { db } from "@/lib/db";
import { AdCard } from "@/components/AdCard";
import { CategoryGrid } from "@/components/CategoryGrid";
import { HeroSearch } from "@/components/HeroSearch";
import Link from "next/link";
import type { Locale } from "@/i18n/request";

interface Props {
  params: Promise<{ locale: Locale }>;
}

async function getHomeData() {
  const [categories, latestAds] = await Promise.all([
    db.category.findMany({
      where: { parentId: null },
      include: { _count: { select: { ads: { where: { status: "ACTIVE" } } } } },
      orderBy: { id: "asc" },
    }),
    db.ad.findMany({
      where: { status: "ACTIVE" },
      include: { images: { orderBy: { order: "asc" }, take: 1 }, category: true, user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
  ]);
  return { categories, latestAds };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const { categories, latestAds } = await getHomeData();

  return (
    <div>
      <HeroSearch locale={locale} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CategoryGrid categories={categories} locale={locale} />

        <section className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Свежие объявления</h2>
            <Link
              href={`/${locale}/ads`}
              className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
            >
              Смотреть все →
            </Link>
          </div>
          {latestAds.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-4">📋</p>
              <p>Объявлений пока нет. Будьте первым!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {latestAds.map((ad) => (
                <AdCard key={ad.id} ad={{ ...ad, price: ad.price ? Number(ad.price) : null }} locale={locale} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
