import { Module } from "@nestjs/common";
import { ChannelService } from "./channel.service";
import { ChannelController } from "./channel.controller";
import { PrismaService } from "src/prisma.service";
import { TelegramModule } from "@/telegram/telegram.module";

@Module({
  imports: [TelegramModule],
  controllers: [ChannelController],
  providers: [ChannelService, PrismaService],
})
export class ChannelModule {}
