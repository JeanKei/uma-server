// telegram/telegram.module.ts
import { Module } from "@nestjs/common";
import { TelegrafModule } from "nestjs-telegraf";
import { TelegramService } from "./telegram.service";
import { TelegramUpdate } from "./telegram.update";
import { PrismaService } from "@/prisma.service";
import { TELEGRAM_BOT_TOKEN } from "./telegram.constants";

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: TELEGRAM_BOT_TOKEN,
    }),
  ],
  providers: [TelegramService, TelegramUpdate, PrismaService],
  exports: [TelegramService],
})
export class TelegramModule {}
