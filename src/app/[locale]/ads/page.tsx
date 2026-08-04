import { db } from "@/lib/db";
import { AdCard } from "@/components/AdCard";
import Link from "next/link";
import type { Locale } from "@/i18n/request";
import { Prisma } from "@prisma/client";

interface Props {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ q?: string; category?: string }>;
}

export default async function AdsListingPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { q, category } = await searchParams;

  // Build the where clause for Prisma
  const where: Prisma.AdWhereInput = {
    status: "ACTIVE",
  };

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
    ];
  }

  if (category) {
    const catId = parseInt(category, 10);
    if (!isNaN(catId)) {
      where.categoryId = catId;
    }
  }

  // Fetch data
  const [ads, categories] = await Promise.all([
    db.ad.findMany({
      where,
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
        category: true,
        user: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.category.findMany({
      where: { parentId: null },
      orderBy: { id: "asc" },
      include: { children: true },
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 sticky top-24">
            <h3 className="text-lg font-bold text-white mb-4">Поиск</h3>
            
            <form method="GET" action={`/${locale}/ads`} className="mb-6">
              <input
                type="text"
                name="q"
                defaultValue={q || ""}
                placeholder="Что ищете?"
                className="w-full bg-white/5 border border-white/10 text-white placeholder:text-gray-500 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 mb-3"
              />
              {category && <input type="hidden" name="category" value={category} />}
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
              >
                Найти
              </button>
            </form>

            <h3 className="text-lg font-bold text-white mb-4">Категории</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={`/${locale}/ads${q ? `?q=${q}` : ""}`}
                  className={`block py-1 ${!category ? "text-indigo-400 font-semibold" : "text-gray-400 hover:text-white transition-colors"}`}
                >
                  Все категории
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/${locale}/ads?category=${cat.id}${q ? `&q=${q}` : ""}`}
                    className={`block py-1 flex items-center gap-2 ${
                      category === cat.id.toString() ? "text-indigo-400 font-semibold" : "text-gray-400 hover:text-white transition-colors"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    {cat.nameRu}
                  </Link>
                  
                  {/* Children categories could be listed here if needed */}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">
              {q ? `Результаты поиска: "${q}"` : "Все объявления"}
            </h1>
            <span className="text-gray-400 text-sm">Найдено: {ads.length}</span>
          </div>

          {ads.length === 0 ? (
            <div className="bg-gray-900 border border-white/10 rounded-2xl p-12 text-center">
              <p className="text-5xl mb-4">🔍</p>
              <h2 className="text-xl font-bold text-white mb-2">Ничего не найдено</h2>
              <p className="text-gray-400">Попробуйте изменить параметры поиска или категорию.</p>
              <Link
                href={`/${locale}/ads`}
                className="inline-block mt-6 text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Сбросить фильтры
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ads.map((ad) => (
                <AdCard key={ad.id} ad={{ ...ad, price: ad.price ? Number(ad.price) : null }} locale={locale} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
