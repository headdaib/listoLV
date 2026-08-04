import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdCard } from "@/components/AdCard";
import type { Locale } from "@/i18n/request";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export default async function FavoritesPage({ params }: Props) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect(`/${locale}/auth/login`);
  }

  // Fetch the ads that this user has favorited
  const favorites = await db.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      ad: {
        include: {
          images: { orderBy: { order: "asc" }, take: 1 },
          category: true,
          user: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const ads = favorites.map(f => ({
    ...f.ad,
    isFavorited: true, // We know it's favorited because it's in this list
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <span className="text-red-500">❤️</span> Избранные объявления
        </h1>
        <p className="text-gray-400 mt-2">Объявления, которые вы сохранили.</p>
      </div>

      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 min-h-[50vh]">
        {ads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-16 text-gray-400 text-center">
            <span className="text-6xl mb-4">💔</span>
            <h2 className="text-xl font-bold text-white mb-2">У вас пока нет избранных объявлений</h2>
            <p>Нажимайте на сердечко на карточках объявлений, чтобы сохранить их здесь.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ads.map((ad) => (
              <AdCard key={ad.id} ad={{ ...ad, price: ad.price ? Number(ad.price) : null }} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
