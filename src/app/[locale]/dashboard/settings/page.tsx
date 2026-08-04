import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { SettingsForm } from "@/components/SettingsForm";
import type { Locale } from "@/i18n/request";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export default async function SettingsPage({ params }: Props) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect(`/${locale}/auth/login`);
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, phone: true },
  });

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href={`/${locale}/dashboard`}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ← Назад в кабинет
        </Link>
        <h1 className="text-3xl font-bold text-white">Настройки профиля</h1>
      </div>

      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl max-w-2xl">
        <SettingsForm user={user} />
      </div>
    </div>
  );
}
