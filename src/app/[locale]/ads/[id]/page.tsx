import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import Image from "next/image";
import type { Locale } from "@/i18n/request";

interface Props {
  params: Promise<{ locale: Locale; id: string }>;
}

export default async function AdDetailsPage({ params }: Props) {
  const { id } = await params;

  const ad = await db.ad.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: "asc" } },
      user: { select: { name: true, phone: true, email: true } },
      category: true,
    },
  });

  if (!ad) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {/* Image Gallery */}
            <div className="relative aspect-video bg-gray-950">
              {ad.images.length > 0 ? (
                <Image
                  src={ad.images[0].url}
                  alt={ad.title}
                  fill
                  className="object-contain"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-700 text-6xl">
                  📷
                </div>
              )}
            </div>
            
            {/* Thumbnail Strip */}
            {ad.images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto bg-gray-900/50">
                {ad.images.map((img) => (
                  <div key={img.id} className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-white/10 cursor-pointer hover:border-indigo-500 transition-colors">
                    <Image src={img.url} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 sm:p-8">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-4">
                {ad.category.nameRu}
              </span>
              <h1 className="text-3xl font-bold text-white mb-2">{ad.title}</h1>
              <p className="text-gray-400 text-sm">
                Опубликовано: {new Date(ad.createdAt).toLocaleDateString("ru-RU")} в {ad.city}
              </p>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                {ad.description}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Card */}
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 shadow-xl sticky top-24">
            <div className="text-4xl font-bold text-white mb-6">
              {ad.price ? `${Number(ad.price).toLocaleString("ru-RU")} ${ad.currency}` : "Договорная"}
            </div>

            <div className="space-y-4 border-t border-white/10 pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                  {ad.user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-white font-medium">{ad.user.name}</div>
                  <div className="text-sm text-gray-400">На ListoLV с {new Date().getFullYear()}</div>
                </div>
              </div>

              {ad.user.phone && (
                <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2">
                  <span>📞</span>
                  {ad.user.phone}
                </button>
              )}
              
              <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3 rounded-lg transition-all shadow-lg shadow-indigo-900/30 flex items-center justify-center gap-2">
                <span>✉️</span>
                Написать сообщение
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
