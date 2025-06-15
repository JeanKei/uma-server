import { Injectable, Logger } from "@nestjs/common";
import axios from "axios";
import * as cheerio from "cheerio";

import {
  parseDescription,
  parseTitle,
  parseIsVerified,
  parsePhotos,
  parseVideos,
  parseFiles,
  parseLinks,
} from "../stage-2/";
import { PrismaService } from "@/prisma.service";

@Injectable()
export class Stage2Service {
  private readonly logger = new Logger(Stage2Service.name);

  constructor(private prisma: PrismaService) {}

  async parseStage2(channelUrl: string, channelId: string) {
    this.logger.log(
      `[Stage 2] Начало парсинга канала: ${channelUrl} (ID: ${channelId})`
    );

    try {
      const username = channelUrl.replace("https://t.me/", "").trim();
      const targetUrl = `https://t.me/s/${username}`;
      this.logger.debug(`[Stage 2] Отправка запроса на ${targetUrl}`);

      const response = await axios.get(targetUrl, {
        headers: { "User-Agent": "Mozilla/5.0" },
        timeout: 10000,
      });

      const $ = cheerio.load(response.data);

      // Парсинг данных
      const data = {
        description: parseDescription($),
        title: parseTitle($),
        isVerified: parseIsVerified($),
        photos: parsePhotos($),
        videos: parseVideos($),
        files: parseFiles($),
        links: parseLinks($),
      };

      // Логирование спарсенных данных
      this.logger.debug(`[Stage 2] Спарсенные данные:`);
      this.logger.debug(`  - Название: ${data.title ?? "не спарсено"}`);
      this.logger.debug(`  - Описание: ${data.description ?? "не спарсено"}`);
      this.logger.debug(`  - Верификация: ${data.isVerified}`);
      this.logger.debug(`  - Фото: ${data.photos ?? "не спарсено"}`);
      this.logger.debug(`  - Видео: ${data.videos ?? "не спарсено"}`);
      this.logger.debug(`  - Файлы: ${data.files ?? "не спарсено"}`);
      this.logger.debug(`  - Ссылки: ${data.links ?? "не спарсено"}`);

      // Сохранение в таблицу Stats
      try {
        await this.prisma.stats.upsert({
          where: { channelId },
          update: data,
          create: {
            channel: { connect: { id: channelId } },
            ...data,
            subscribers: 0,
            gender: 0,
            view: 0,
            er: 0,
            cpv: 0,
            price: 0,
            imgSrc: "channels-img/default.png",
          },
        });
        this.logger.log(`[Stage 2] Данные сохранены в таблице Stats`);
      } catch (dbErr) {
        this.logger.error(
          `[Stage 2] Ошибка сохранения в таблицу Stats: ${(dbErr as Error).message}`
        );
      }

      this.logger.log(
        `[Stage 2] Парсинг канала ${channelUrl} успешно завершен`
      );
      return data;
    } catch (err) {
      this.logger.error(
        `[Stage 2] Ошибка парсинга канала ${channelUrl}: ${(err as Error).message}`
      );
      return null;
    }
  }
}
