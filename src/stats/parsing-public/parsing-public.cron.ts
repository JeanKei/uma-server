import { Injectable, OnModuleInit } from "@nestjs/common";
import { ParsingPublicService } from "./parsing-public.service";

@Injectable()
export class ParsingPublicCronService implements OnModuleInit {
  constructor(private readonly statService: ParsingPublicService) {}

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
