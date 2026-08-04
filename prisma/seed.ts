import { PrismaClient } from "@prisma/client";

const categories = [
  // Transport
  { slug: "transport", nameRu: "Транспорт", nameLv: "Transports", nameEn: "Transport", icon: "🚗", parentId: null },
  { slug: "cars", nameRu: "Автомобили", nameLv: "Automašīnas", nameEn: "Cars", icon: "🚘", parentSlug: "transport" },
  { slug: "motorcycles", nameRu: "Мотоциклы", nameLv: "Motocikli", nameEn: "Motorcycles", icon: "🏍️", parentSlug: "transport" },
  { slug: "spare-parts", nameRu: "Запчасти", nameLv: "Rezerves daļas", nameEn: "Spare Parts", icon: "🔧", parentSlug: "transport" },

  // Real Estate
  { slug: "real-estate", nameRu: "Недвижимость", nameLv: "Nekustamais īpašums", nameEn: "Real Estate", icon: "🏠", parentId: null },
  { slug: "apartments-sale", nameRu: "Квартиры — продажа", nameLv: "Dzīvokļi — pārdošana", nameEn: "Apartments — sale", icon: "🏢", parentSlug: "real-estate" },
  { slug: "apartments-rent", nameRu: "Квартиры — аренда", nameLv: "Dzīvokļi — īre", nameEn: "Apartments — rent", icon: "🔑", parentSlug: "real-estate" },
  { slug: "houses", nameRu: "Дома и дачи", nameLv: "Mājas un vasarnīcas", nameEn: "Houses & Cottages", icon: "🏡", parentSlug: "real-estate" },

  // Electronics
  { slug: "electronics", nameRu: "Электроника", nameLv: "Elektronika", nameEn: "Electronics", icon: "💻", parentId: null },
  { slug: "phones", nameRu: "Телефоны", nameLv: "Tālruņi", nameEn: "Phones", icon: "📱", parentSlug: "electronics" },
  { slug: "computers", nameRu: "Компьютеры", nameLv: "Datori", nameEn: "Computers", icon: "🖥️", parentSlug: "electronics" },
  { slug: "tv-audio", nameRu: "ТВ и аудио", nameLv: "TV un audio", nameEn: "TV & Audio", icon: "📺", parentSlug: "electronics" },

  // Furniture & Home
  { slug: "home", nameRu: "Дом и сад", nameLv: "Māja un dārzs", nameEn: "Home & Garden", icon: "🛋️", parentId: null },
  { slug: "furniture", nameRu: "Мебель", nameLv: "Mēbeles", nameEn: "Furniture", icon: "🪑", parentSlug: "home" },
  { slug: "appliances", nameRu: "Бытовая техника", nameLv: "Sadzīves tehnika", nameEn: "Appliances", icon: "🧺", parentSlug: "home" },

  // Jobs
  { slug: "jobs", nameRu: "Работа", nameLv: "Darbs", nameEn: "Jobs", icon: "💼", parentId: null },
  { slug: "jobs-offers", nameRu: "Вакансии", nameLv: "Vakances", nameEn: "Job Offers", icon: "📋", parentSlug: "jobs" },
  { slug: "jobs-wanted", nameRu: "Ищу работу", nameLv: "Meklēju darbu", nameEn: "Job Wanted", icon: "🙋", parentSlug: "jobs" },

  // Services
  { slug: "services", nameRu: "Услуги", nameLv: "Pakalpojumi", nameEn: "Services", icon: "🛠️", parentId: null },

  // Other
  { slug: "other", nameRu: "Разное", nameLv: "Dažādi", nameEn: "Other", icon: "📦", parentId: null },
];

async function main() {
  const prisma = new PrismaClient();
  console.log("🌱 Seeding categories...");

  // First pass: create parents
  const parentCats = categories.filter((c) => !("parentSlug" in c) || c.parentSlug === undefined);
  const createdParents: Record<string, number> = {};

  for (const cat of parentCats) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { nameRu: cat.nameRu, nameLv: cat.nameLv, nameEn: cat.nameEn, icon: cat.icon },
      create: { slug: cat.slug, nameRu: cat.nameRu, nameLv: cat.nameLv, nameEn: cat.nameEn, icon: cat.icon },
    });
    createdParents[cat.slug] = created.id;
  }

  // Second pass: create children
  const childCats = categories.filter((c) => "parentSlug" in c && c.parentSlug);
  for (const cat of childCats) {
    const parentId = createdParents[(cat as { parentSlug: string }).parentSlug];
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { nameRu: cat.nameRu, nameLv: cat.nameLv, nameEn: cat.nameEn, icon: cat.icon, parentId },
      create: { slug: cat.slug, nameRu: cat.nameRu, nameLv: cat.nameLv, nameEn: cat.nameEn, icon: cat.icon, parentId },
    });
  }

  console.log(`✅ Seeded ${categories.length} categories`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
