import { Module } from "@nestjs/common";
import { OrderUmaBotController } from "./order-uma-bot.controller";
import { OrderUmaBotService } from "./order-uma-bot.service";
import { PrismaService } from "@/prisma.service";
import { TelegramModule } from "@/telegram/telegram.module"; // ✅ нужный импорт

@Module({
  imports: [TelegramModule], // ✅ используем модуль, а не напрямую сервис
  controllers: [OrderUmaBotController],
  providers: [OrderUmaBotService, PrismaService],
})
export class OrderUmaBotModule {}
