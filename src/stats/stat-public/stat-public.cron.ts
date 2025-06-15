import { Injectable, OnModuleInit } from "@nestjs/common";
import { StatPublicService } from "./services/stat-public.service";

@Injectable()
export class StatPublicCronService implements OnModuleInit {
  constructor(private readonly statService: StatPublicService) {}

  async onModuleInit() {
    this.scheduleNext();
  }

  private async scheduleNext() {
    const intervalSeconds = await this.statService.getIntervalSeconds();
    setTimeout(async () => {
      await this.statService.parseAndStoreStats();
      this.scheduleNext(); // рекурсивный запуск после паузы
    }, intervalSeconds * 1000);
  }
}
