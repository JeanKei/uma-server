import { PrismaClient } from "@prisma/client";
import * as fs from "fs/promises";
import * as path from "path";

const prisma = new PrismaClient();

interface Review {
  name: string;
  description: string;
  review: string;
  rating: number;
  date: string;
}

interface ChannelReviewData {
  link: string;
  reviews: Review[];
}

async function main() {
  const jsonPath = path.resolve("prisma/seeds-channels/reviews/reviews.json");
  const data: ChannelReviewData[] = JSON.parse(
    await fs.readFile(jsonPath, "utf-8")
  );

  let totalReviews = 0;
  let createdReviews = 0;
  let skippedReviews = 0;

  for (const item of data) {
    const { link, reviews } = item;

    // Нормализация ссылки
    let normalizedLink = link.replace("https://t.me/", "");
    if (!normalizedLink.startsWith("+")) {
      normalizedLink = "@" + normalizedLink;
    }

    // Проверка существования канала
    const existingChannel = await prisma.channel.findUnique({
      where: { url: normalizedLink },
    });

    if (!existingChannel) {
      console.warn(
        `⚠️ Канал с URL ${normalizedLink} не найден, отзывы пропущены (${reviews.length})`
      );
      skippedReviews += reviews.length;
      continue;
    }

    // Создание отзывов для канала
    for (const review of reviews) {
      totalReviews++;

      // Преобразование даты из DD.MM.YYYY в Date
      const [day, month, year] = review.date.split(".");
      const reviewDate = new Date(`${year}-${month}-${day}`);

      if (isNaN(reviewDate.getTime())) {
        console.warn(
          `⚠️ Некорректная дата ${review.date} для отзыва от ${review.name}, пропущен`
        );
        skippedReviews++;
        continue;
      }

      // Проверка, существует ли такой отзыв (по name, rating и createdAt)
      const existingReview = await prisma.channelReviews.findFirst({
        where: {
          channelId: existingChannel.id,
          name: review.name,
          rating: review.rating,
          createdAt: reviewDate,
        },
      });

      if (existingReview) {
        console.log(
          `ℹ️ Отзыв от ${review.name} для канала ${normalizedLink} уже существует, пропущен`
        );
        continue;
      }

      // Создание отзыва
      await prisma.channelReviews.create({
        data: {
          name: review.name,
          description: review.description,
          review: review.review,
          rating: review.rating,
          createdAt: reviewDate,
          updatedAt: reviewDate,
          channelId: existingChannel.id,
        },
      });
      createdReviews++;
    }
  }

  console.log("\n✅ Загрузка отзывов завершена!");
  console.log(`📦 Обработано отзывов: ${totalReviews}`);
  console.log(`🆕 Создано новых отзывов: ${createdReviews}`);
  console.log(`⏭️ Пропущено отзывов: ${skippedReviews}`);
}

main()
  .catch((e) => {
    console.error("❌ Ошибка при загрузке:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
