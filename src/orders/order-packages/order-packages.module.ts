import { Module } from "@nestjs/common";
import { OrderPackagesController } from "./order-packages.controller";
import { OrderPackagesService } from "./order-packages.service";
import { PrismaService } from "@/prisma.service";
import { TelegramModule } from "@/telegram/telegram.module"; // ✅ нужный импорт

@Module({
  imports: [TelegramModule],
  controllers: [OrderPackagesController],
  providers: [OrderPackagesService, PrismaService],
})
export class OrderPackagesModule {}
