import { PrismaService } from "@/prisma.service";
import { Injectable, Logger } from "@nestjs/common";
import axios from "axios";
import * as cheerio from "cheerio";
import { parsePosts } from "../stage-3/posts.parser";

@Injectable()
export class Stage3Service {
  private readonly logger = new Logger(Stage3Service.name);

  constructor(private prisma: PrismaService) {}

  async parseStage3(channelUrl: string, channelId: string) {
    this.logger.log(
      `[Stage 3] Начало парсинга канала: ${channelUrl} (ID: ${channelId})`
    );

    try {
      const username = channelUrl.replace("https://t.me/", "").trim();
      const targetUrl = `https://t.me/s/${username}`;
      this.logger.debug(`[Stage 3] Отправка запроса на ${targetUrl}`);

      const response = await axios.get(targetUrl, {
        headers: { "User-Agent": "Mozilla/5.0" },
        timeout: 10000,
      });

      const $ = cheerio.load(response.data);
      const posts = parsePosts($);

      // Логирование спарсенных постов
      this.logger.debug(`[Stage 3] Спарсено постов: ${posts.length}`);
      posts.forEach((post, index) => {
        this.logger.debug(`[Stage 3] Пост #${index + 1}:`);
        this.logger.debug(`  - ID поста: ${post.dataPost}`);
        this.logger.debug(`  - URL: ${post.messageUrl}`);
        this.logger.debug(
          `  - Текст: ${post.messageText?.substring(0, 50) ?? "отсутствует"}...`
        );
        this.logger.debug(`  - Просмотры: ${post.views ?? "не спарсено"}`);
        this.logger.debug(`  - Дата: ${post.datetime ?? "не спарсено"}`);
        this.logger.debug(
          `  - Фото: ${post.photos.length ? post.photos.join(", ") : "нет"}`
        );
        this.logger.debug(
          `  - Видео: ${post.videos.length ? post.videos.join(", ") : "нет"}`
        );
      });

      // Сохранение постов
      let savedPosts = 0;
      for (const post of posts) {
        try {
          await this.prisma.post.upsert({
            where: { dataPost: post.dataPost },
            update: {
              messageText: post.messageText,
              views: post.views,
              datetime: post.datetime,
              photos: post.photos,
              videos: post.videos,
            },
            create: {
              channelId,
              dataPost: post.dataPost,
              messageUrl: post.messageUrl,
              messageText: post.messageText,
              views: post.views,
              datetime: post.datetime,
              photos: post.photos,
              videos: post.videos,
            },
          });
          savedPosts++;
          this.logger.debug(`[Stage 3] Пост ${post.dataPost} сохранен`);
        } catch (dbErr) {
          this.logger.error(
            `[Stage 3] Ошибка сохранения поста ${post.dataPost}: ${(dbErr as Error).message}`
          );
        }
      }

      this.logger.log(
        `[Stage 3] Сохранено ${savedPosts} из ${posts.length} постов для ${channelUrl}`
      );
      this.logger.log(
        `[Stage 3] Парсинг канала ${channelUrl} успешно завершен`
      );
      return { postCount: posts.length, savedPostCount: savedPosts };
    } catch (err) {
      this.logger.error(
        `[Stage 3] Ошибка парсинга канала ${channelUrl}: ${(err as Error).message}`
      );
      return null;
    }
  }
}
