import { Injectable, Logger } from "@nestjs/common";
import axios from "axios";
import * as cheerio from "cheerio";
import { PrismaService } from "src/prisma.service";

import {
  parseAvatar,
  parseTitle,
  parseDescription,
  parseUsername,
  parseIsVerified,
  parseSubscribers,
  parsePhotos,
  parseVideos,
  parseFiles,
  parseLinks,
} from "./components";

@Injectable()
export class ParsingPublicService {
  constructor(private prisma: PrismaService) {}

  private readonly logger = new Logger(ParsingPublicService.name);

  private isParsing = false;

  public getIsParsing(): boolean {
    return this.isParsing;
  }

  async parseAndStoreStats() {
    if (this.isParsing) {
      this.logger.warn("Парсинг уже запущен — пропуск");
      return;
    }

    this.isParsing = true;

    const job = await this.prisma.parsingPublicJob.create({
      data: { startedAt: new Date() },
    });

    try {
      const channels = await this.prisma.telegramChannel.findMany({
        where: { status: "APPROVED" },
      });

      let parsed = 0;

      for (const channel of channels) {
        const info = await this.scrapeChannelInfo(channel.url);
        if (info) {
          await this.prisma.parsingPublicStat.upsert({
            where: { channelId: channel.id },
            update: {
              ...info,
              // createdAt не трогаем, updatedAt обновится автоматически
            },
            create: {
              channelId: channel.id,
              ...info,
            },
          });

          parsed++;
        }
      }

      await this.prisma.parsingPublicJob.update({
        where: { id: job.id },
        data: {
          finishedAt: new Date(),
          parsedCount: parsed,
        },
      });

      this.logger.log(`Парсинг завершён. Каналов: ${parsed}`);
    } catch (err) {
      this.logger.error("Ошибка парсинга", err);
    } finally {
      this.isParsing = false;
    }
  }

  private async scrapeChannelInfo(channelUrl: string) {
    try {
      const username = channelUrl
        .replace("https://t.me/", "")
        .replace(/^@/, "")
        .trim();
      const response = await axios.get(`https://t.me/s/${username}`, {
        headers: { "User-Agent": "Mozilla/5.0" },
        timeout: 10000,
      });

      const $ = cheerio.load(response.data);

      return {
        avatar: parseAvatar($),
        title: parseTitle($),
        description: parseDescription($),
        username: parseUsername($),
        isVerified: parseIsVerified($),
        subscribers: parseSubscribers($),
        photos: parsePhotos($),
        videos: parseVideos($),
        files: parseFiles($),
        links: parseLinks($),
      };
    } catch (err) {
      this.logger.warn(`Ошибка парсинга ${channelUrl}: ${err.message}`);
      return null;
    }
  }

  async getIntervalSeconds(): Promise<number> {
    const config = await this.prisma.parsingPublicConfig.findUnique({
      where: { id: "singleton" },
    });
    return config?.intervalSeconds ?? 60;
  }

  async setIntervalSeconds(seconds: number) {
    return this.prisma.parsingPublicConfig.upsert({
      where: { id: "singleton" },
      update: { intervalSeconds: seconds },
      create: {
        id: "singleton",
        intervalSeconds: seconds,
      },
    });
  }

  async getLastJobs(limit = 10) {
    return this.prisma.parsingPublicJob.findMany({
      take: limit,
      orderBy: { startedAt: "desc" },
    });
  }

  async getSummary() {
    const [firstJob] = await this.prisma.parsingPublicJob.findMany({
      orderBy: { startedAt: "asc" },
      take: 1,
    });

    const [lastJob] = await this.getLastJobs(1);

    const totalJobs = await this.prisma.parsingPublicJob.count();

    const totalParsedChannels = await this.prisma.parsingPublicStat.aggregate({
      _count: {
        channelId: true,
      },
    });

    const avgParsed = await this.prisma.parsingPublicJob.aggregate({
      _avg: { parsedCount: true },
    });

    const finished = await this.prisma.parsingPublicJob.findMany({
      where: { finishedAt: { not: null } },
      select: {
        startedAt: true,
        finishedAt: true,
      },
    });

    const durations = finished
      .map((j) => +j.finishedAt - +j.startedAt)
      .filter((ms) => ms > 0);

    const avgDurationMs = durations.length
      ? durations.reduce((a, b) => a + b, 0) / durations.length
      : 0;

    const avgMinutes = Math.round(avgDurationMs / 60000);

    const intervalSeconds = await this.getIntervalSeconds();
    const intervalMinutes = intervalSeconds / 60;

    return {
      since: firstJob?.startedAt || null,
      daysRunning: firstJob
        ? Math.floor((Date.now() - +firstJob.startedAt) / (1000 * 60 * 60 * 24))
        : 0,
      totalParsedChannels: totalParsedChannels._count.channelId,
      totalRuns: totalJobs,
      averageParsedPerRun: Math.round(avgParsed._avg.parsedCount || 0),
      averageRunDurationMinutes: avgMinutes,
      lastRun: lastJob
        ? {
            startedAt: lastJob.startedAt,
            finishedAt: lastJob.finishedAt,
            parsedCount: lastJob.parsedCount,
          }
        : null,
      intervalMinutes,
      isParsing: this.getIsParsing(),
    };
  }
}
