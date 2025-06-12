import { PrismaClient, ChannelStatus } from "@prisma/client";
import * as fs from "fs/promises";
import * as path from "path";

const prisma = new PrismaClient();

function toNumberOrUndefined(value: any): number | undefined {
  return value === null || value === undefined || value === ""
    ? undefined
    : Number(value);
}

function toFloatOrUndefined(value: any): number | undefined {
  return value === null || value === undefined || value === ""
    ? undefined
    : parseFloat(value);
}

async function main() {
  const jsonPath = path.resolve("prisma/seeds-channels/stats/stats.json");
  const data = JSON.parse(await fs.readFile(jsonPath, "utf-8"));

  let total = 0;
  let createdChannels = 0;
  let updatedChannels = 0;
  let createdStats = 0;
  let updatedStats = 0;
  let categoryLinksCreated = 0;

  for (const item of data) {
    total++;

    const {
      title,
      category,
      subscribers,
      gender,
      view,
      ER,
      CPV,
      price,
      imgSrc,
      link,
    } = item;

    // Категория
    const categoryRecord = await prisma.category.upsert({
      where: { name: category },
      update: {},
      create: { name: category },
    });

    // Канал
    const existingChannel = await prisma.channel.findUnique({
      where: { url: link },
    });

    let channel;

    if (existingChannel) {
      const needsUpdate =
        existingChannel.price !== toNumberOrUndefined(price) ||
        existingChannel.title !== title ||
        existingChannel.status !== ChannelStatus.APPROVED ||
        existingChannel.isActual !== false;

      if (needsUpdate) {
        channel = await prisma.channel.update({
          where: { url: link },
          data: {
            price: toNumberOrUndefined(price),
            title,
            status: ChannelStatus.APPROVED,
            isActual: false,
          },
        });
        updatedChannels++;
      } else {
        channel = existingChannel;
      }
    } else {
      channel = await prisma.channel.create({
        data: {
          url: link,
          price: toNumberOrUndefined(price),
          title,
          status: ChannelStatus.APPROVED,
          isActual: false,
        },
      });
      createdChannels++;
    }

    // Статистика
    const existingStat = await prisma.stats.findUnique({
      where: { channelId: channel.id },
    });

    if (existingStat) {
      const needsUpdate =
        existingStat.subscribers !== toNumberOrUndefined(subscribers) ||
        existingStat.gender !== toNumberOrUndefined(gender) ||
        existingStat.view !== toNumberOrUndefined(view) ||
        existingStat.er !== toFloatOrUndefined(ER) ||
        existingStat.cpv !== toFloatOrUndefined(CPV) ||
        existingStat.price !== toNumberOrUndefined(price) ||
        existingStat.imgSrc !== imgSrc;

      if (needsUpdate) {
        await prisma.stats.update({
          where: { channelId: channel.id },
          data: {
            subscribers: toNumberOrUndefined(subscribers),
            gender: toNumberOrUndefined(gender),
            view: toNumberOrUndefined(view),
            er: toFloatOrUndefined(ER),
            cpv: toFloatOrUndefined(CPV),
            price: toNumberOrUndefined(price),
            imgSrc,
          },
        });
        updatedStats++;
      }
    } else {
      await prisma.stats.create({
        data: {
          channelId: channel.id,
          subscribers: toNumberOrUndefined(subscribers),
          gender: toNumberOrUndefined(gender),
          view: toNumberOrUndefined(view),
          er: toFloatOrUndefined(ER),
          cpv: toFloatOrUndefined(CPV),
          price: toNumberOrUndefined(price),
          imgSrc,
        },
      });
      createdStats++;
    }

    // Связь с категорией
    await prisma.categoriesChannel.upsert({
      where: {
        channelId_categoryId: {
          channelId: channel.id,
          categoryId: categoryRecord.id,
        },
      },
      update: {},
      create: {
        channelId: channel.id,
        categoryId: categoryRecord.id,
      },
    });

    categoryLinksCreated++;
  }

  console.log("\n✅ Загрузка завершена!");
  console.log(`📦 Обработано каналов: ${total}`);
  console.log(`🆕 Новых каналов: ${createdChannels}`);
  console.log(`🔁 Обновлённых каналов: ${updatedChannels}`);
  console.log(`📊 Новых записей статистики: ${createdStats}`);
  console.log(`📈 Обновлённых записей статистики: ${updatedStats}`);
  console.log(`🔗 Связей канал-категория: ${categoryLinksCreated}`);
}

main()
  .catch((e) => {
    console.error("❌ Ошибка при загрузке:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
