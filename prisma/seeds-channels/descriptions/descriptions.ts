import { PrismaClient } from "@prisma/client";
import * as fs from "fs/promises";
import * as path from "path";

const prisma = new PrismaClient();

async function main() {
  const jsonPath = path.resolve(
    "prisma/seeds-channels/descriptions/descriptions.json"
  );
  const data = JSON.parse(await fs.readFile(jsonPath, "utf-8"));

  let total = 0;
  let createdChannels = 0;
  let updatedChannels = 0;

  for (const item of data) {
    total++;
    const { link, descriptions } = item;
    const description = descriptions[0]?.description || "";

    // Нормализация ссылки
    let normalizedLink = link.replace("https://t.me/", "");
    if (!normalizedLink.startsWith("+")) {
      normalizedLink = "@" + normalizedLink;
    }

    // Проверка существования канала
    const existingChannel = await prisma.channel.findUnique({
      where: { url: normalizedLink },
    });

    if (existingChannel) {
      // Обновление описания существующего канала
      await prisma.channel.update({
        where: { url: normalizedLink },
        data: {
          description: description,
        },
      });
      updatedChannels++;
    } else {
      // Создание нового канала с описанием
      await prisma.channel.create({
        data: {
          url: normalizedLink,
          description: description,
        },
      });
      createdChannels++;
    }
  }

  console.log("\n✅ Загрузка описаний завершена!");
  console.log(`📦 Обработано каналов: ${total}`);
  console.log(`🆕 Новых каналов: ${createdChannels}`);
  console.log(`🔁 Обновлённых каналов: ${updatedChannels}`);
}

main()
  .catch((e) => {
    console.error("❌ Ошибка при загрузке:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
