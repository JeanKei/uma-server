import { PrismaService } from "@/prisma.service";
import { Injectable, Logger } from "@nestjs/common";
import axios from "axios";
import * as cheerio from "cheerio";
import { parseSubscribers } from "../stage-1/subscribers.parser";
import { parseAvatar } from "../stage-1/avatar.parser";
import { parseIsVerified } from "../stage-2";
import { downloadAndSaveAvatar } from "../utils/download-and-save-avatar";

@Injectable()
export class Stage1Service {
  private readonly logger = new Logger(Stage1Service.name);

  constructor(private prisma: PrismaService) {}

  async parseStage1(channelUrl: string, channelId: string) {
    this.logger.log(
      `[Stage 1] Начало парсинга канала: ${channelUrl} (ID: ${channelId})`
    );

    try {
      this.logger.debug(`[Stage 1] Отправка запроса на ${channelUrl}`);
      const response = await axios.get(channelUrl, {
        headers: { "User-Agent": "Mozilla/5.0" },
        timeout: 10000,
      });

      const $ = cheerio.load(response.data);

      // Парсинг данных
      const subscribers = parseSubscribers($);
      const avatarUrl = parseAvatar($);
      const isVerified = parseIsVerified($);

      // Логирование спарсенных данных
      this.logger.debug(`[Stage 1] Спарсенные данные:`);
      this.logger.debug(`  - Подписчики: ${subscribers ?? "не спарсено"}`);
      this.logger.debug(`  - URL аватара: ${avatarUrl ?? "не спарсено"}`);
      this.logger.debug(`  - Верификация: ${isVerified}`);

      // Сохранение аватара
      let avatarPath: string | null = null;
      if (avatarUrl) {
        try {
          avatarPath = await downloadAndSaveAvatar(avatarUrl, channelUrl);
          this.logger.log(`[Stage 1] Аватар сохранен: ${avatarPath}`);
        } catch (avatarErr) {
          this.logger.warn(
            `[Stage 1] Не удалось сохранить аватар: ${(avatarErr as Error).message}`
          );
        }
      } else {
        this.logger.warn(`[Stage 1] URL аватара не найден, аватар не сохранен`);
      }

      // Сохранение в таблицу Channel
      try {
        await this.prisma.channel.update({
          where: { id: channelId },
          data: { avatar: avatarPath },
        });
        this.logger.log(`[Stage 1] Данные аватара сохранены в таблице Channel`);
      } catch (dbErr) {
        this.logger.error(
          `[Stage 1] Ошибка сохранения в таблицу Channel: ${(dbErr as Error).message}`
        );
      }

      // Сохранение в таблицу Stats
      try {
        await this.prisma.stats.upsert({
          where: { channelId },
          update: { subscribers, isVerified },
          create: {
            channel: { connect: { id: channelId } },
            subscribers,
            isVerified,
            gender: 0,
            view: 0,
            er: 0,
            cpv: 0,
            price: 0,
            imgSrc: "channels-img/default.png",
          },
        });
        this.logger.log(`[Stage 1] Данные сохранены в таблице Stats`);
      } catch (dbErr) {
        this.logger.error(
          `[Stage 1] Ошибка сохранения в таблицу Stats: ${(dbErr as Error).message}`
        );
      }

      this.logger.log(
        `[Stage 1] Парсинг канала ${channelUrl} успешно завершен`
      );
      return { subscribers, avatar: avatarPath, isVerified };
    } catch (err) {
      this.logger.error(
        `[Stage 1] Ошибка парсинга канала ${channelUrl}: ${(err as Error).message}`
      );
      return null;
    }
  }
}
