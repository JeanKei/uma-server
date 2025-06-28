import { Module } from "@nestjs/common";
import { OrderChannelsService } from "./order-channels.service";
import { OrderChannelsController } from "./order-channels.controller";
import { PrismaService } from "@/prisma.service";
import { TelegramModule } from "@/telegram/telegram.module";
import { OrderFileModule } from "./order-file/order-file.module";

@Module({
  imports: [TelegramModule, OrderFileModule],
  controllers: [OrderChannelsController],
  providers: [OrderChannelsService, PrismaService],
})
export class OrderChannelsModule {}
