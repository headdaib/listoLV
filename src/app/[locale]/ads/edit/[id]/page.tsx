import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { EditAdForm } from "@/components/EditAdForm";
import type { Locale } from "@/i18n/request";

interface Props {
  params: Promise<{ locale: Locale; id: string }>;
}

export default async function EditAdPage({ params }: Props) {
  const { locale, id } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect(`/${locale}/auth/login`);
  }

  const [categories, ad] = await Promise.all([
    db.category.findMany({ orderBy: { id: "asc" } }),
    db.ad.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        city: true,
        categoryId: true,
        userId: true,
      },
    }),
  ]);

  if (!ad) {
    notFound();
  }

  if (ad.userId !== session.user.id) {
    redirect(`/${locale}/dashboard`);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <EditAdForm categories={categories} locale={locale} ad={ad} />
    </div>
  );
}
