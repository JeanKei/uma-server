import { PrismaClient, ChannelStatus } from "@prisma/client";
import * as fs from "fs/promises";
import * as path from "path";

const prisma = new PrismaClient();

async function main() {
  const jsonPath = path.resolve(
    "prisma/seeds/initial-channels/initial_channels.json"
  );
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
      description,
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
        existingChannel.price !== Number(price) ||
        existingChannel.status !== ChannelStatus.APPROVED ||
        existingChannel.isActual !== false;

      if (needsUpdate) {
        channel = await prisma.channel.update({
          where: { url: link },
          data: {
            price: Number(price) || undefined,
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
          price: Number(price) || undefined,
          status: ChannelStatus.APPROVED,
          isActual: false,
        },
      });
      createdChannels++;
    }

    // Статистика
    const existingStat = await prisma.statInitial.findUnique({
      where: { channelId: channel.id },
    });

    if (existingStat) {
      const needsUpdate =
        existingStat.title !== title ||
        existingStat.description !== description ||
        existingStat.subscribers !== Number(subscribers) ||
        existingStat.gender !== gender ||
        existingStat.view !== Number(view) ||
        existingStat.er !== parseFloat(ER) ||
        existingStat.cpv !== parseFloat(CPV) ||
        existingStat.price !== Number(price) ||
        existingStat.imgSrc !== imgSrc;

      if (needsUpdate) {
        await prisma.statInitial.update({
          where: { channelId: channel.id },
          data: {
            title,
            description,
            subscribers: Number(subscribers) || undefined,
            gender,
            view: Number(view) || undefined,
            er: parseFloat(ER) || undefined,
            cpv: parseFloat(CPV) || undefined,
            price: Number(price) || undefined,
            imgSrc,
          },
        });
        updatedStats++;
      }
    } else {
      await prisma.statInitial.create({
        data: {
          channelId: channel.id,
          title,
          description,
          subscribers: Number(subscribers) || undefined,
          gender,
          view: Number(view) || undefined,
          er: parseFloat(ER) || undefined,
          cpv: parseFloat(CPV) || undefined,
          price: Number(price) || undefined,
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
