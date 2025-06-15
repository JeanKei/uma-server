import { Injectable, Logger } from "@nestjs/common";

import { Stage1Service } from "./stage-1.service";
import { Stage2Service } from "./stage-2.service";
import { Stage3Service } from "./stage-3.service";
import { PrismaService } from "@/prisma.service";

@Injectable()
export class StatPublicService {
  private readonly logger = new Logger(StatPublicService.name);
  private isParsing = false;

  constructor(
    private prisma: PrismaService,
    private stage1: Stage1Service,
    private stage2: Stage2Service,
    private stage3: Stage3Service
  ) {}

  public getIsParsing(): boolean {
    return this.isParsing;
  }

  async parseAndStoreStats() {
    if (this.isParsing) {
      this.logger.warn("Парсинг уже запущен — пропуск");
      return;
    }

    this.isParsing = true;
    const job = await this.prisma.statPublicJob.create({
      data: { startedAt: new Date() },
    });

    try {
      const channels = await this.prisma.channel.findMany({
        where: { status: "APPROVED" },
      });

      let parsed = 0;

      for (const channel of channels) {
        // Этап 1
        await this.stage1.parseStage1(channel.url, channel.id);
        // Этап 2
        await this.stage2.parseStage2(channel.url, channel.id);
        // Этап 3
        await this.stage3.parseStage3(channel.url, channel.id);
        parsed++;
      }

      await this.prisma.statPublicJob.update({
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

  async getIntervalSeconds(): Promise<number> {
    const config = await this.prisma.statPublicConfig.findUnique({
      where: { id: "singleton" },
    });
    return config?.intervalSeconds ?? 60;
  }

  async setIntervalSeconds(seconds: number) {
    return this.prisma.statPublicConfig.upsert({
      where: { id: "singleton" },
      update: { intervalSeconds: seconds },
      create: { id: "singleton", intervalSeconds: seconds },
    });
  }

  async getLastJobs(limit = 10) {
    return this.prisma.statPublicJob.findMany({
      take: limit,
      orderBy: { startedAt: "desc" },
    });
  }

  async getSummary() {
    const [firstJob] = await this.prisma.statPublicJob.findMany({
      orderBy: { startedAt: "asc" },
      take: 1,
    });

    const [lastJob] = await this.getLastJobs(1);

    const totalJobs = await this.prisma.statPublicJob.count();

    const totalParsedChannels = await this.prisma.stats.aggregate({
      _count: {
        channelId: true,
      },
    });

    // Подсчет общего количества постов
    const totalParsedPosts = await this.prisma.post.count();

    const avgParsed = await this.prisma.statPublicJob.aggregate({
      _avg: { parsedCount: true },
    });

    const finished = await this.prisma.statPublicJob.findMany({
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
      totalParsedPosts, // Добавляем общее количество постов
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
