import { Controller, Get, Post, Body } from "@nestjs/common";
import { StatPublicService } from "./stat-public.service";

@Controller("stats-public")
export class StatPublicController {
  constructor(private readonly statService: StatPublicService) {}

  @Get("summary")
  async getSummary() {
    return this.statService.getSummary();
  }

  @Post("interval")
  async setInterval(@Body() body: { minutes: number }) {
    const seconds = body.minutes * 60;
    await this.statService.setIntervalSeconds(seconds);
    return { message: "Интервал обновлён", intervalSeconds: seconds };
  }

  @Get("last-job")
  async getLastJob() {
    const [last] = await this.statService.getLastJobs(1);
    return last || {};
  }

  @Get("jobs")
  async getLastJobs() {
    return this.statService.getLastJobs(10);
  }
}
