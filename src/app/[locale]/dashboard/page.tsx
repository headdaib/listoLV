import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { AdCard } from "@/components/AdCard";
import type { Locale } from "@/i18n/request";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect(`/${locale}/auth/login`);
  }

  const userAds = await db.ad.findMany({
    where: { userId: session.user.id },
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
      category: true,
      user: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Личный Кабинет</h1>
          <p className="text-gray-400 mt-2">Добро пожаловать, {session.user.name}</p>
        </div>
        <Link
          href={`/${locale}/ads/create`}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all"
        >
          + Подать объявление
        </Link>
      </div>

      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-6">Ваши объявления</h2>
        
        {userAds.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-4">📝</p>
            <p>У вас пока нет активных объявлений.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userAds.map((ad) => (
              <AdCard key={ad.id} ad={{ ...ad, price: ad.price ? Number(ad.price) : null }} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
