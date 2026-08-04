import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { CreateAdForm } from "@/components/CreateAdForm";
import type { Locale } from "@/i18n/request";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export default async function CreateAdPage({ params }: Props) {
  const { locale } = await params;
  
  // Protect route
  const session = await auth();
  if (!session?.user) {
    redirect(`/${locale}/auth/login`);
  }

  // Fetch categories for the form
  const categories = await db.category.findMany({
    orderBy: { id: "asc" },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <CreateAdForm categories={categories} locale={locale} />
    </div>
  );
}
