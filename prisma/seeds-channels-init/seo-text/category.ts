import { PrismaClient } from "@prisma/client";
import * as fs from "fs/promises";
import * as path from "path";

const prisma = new PrismaClient();

async function main() {
  const jsonPath = path.resolve(
    "prisma/seeds-channels-init/seo-text/category-data.json"
  );
  const data = JSON.parse(await fs.readFile(jsonPath, "utf-8"));

  let total = 0;
  let updatedCategories = 0;
  let notFound = 0;

  for (const slug in data) {
    total++;
    const seoText = data[slug];

    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      await prisma.category.update({
        where: { slug },
        data: { seoText },
      });
      updatedCategories++;
    } else {
      console.warn(`⚠️ Категория со slug "${slug}" не найдена.`);
      notFound++;
    }
  }

  console.log("\n✅ Загрузка seoText завершена!");
  console.log(`📦 Всего записей в JSON: ${total}`);
  console.log(`🔁 Обновлённых категорий: ${updatedCategories}`);
  console.log(`❌ Не найдено категорий: ${notFound}`);
}

main()
  .catch((e) => {
    console.error("❌ Ошибка при загрузке:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
