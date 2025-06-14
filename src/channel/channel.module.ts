import { Module } from "@nestjs/common";
import { ChannelService } from "./channel.service";
import { ChannelController } from "./channel.controller";
import { PrismaService } from "src/prisma.service";
import { TelegramModule } from "@/telegram/telegram.module";
import { FileModule } from "@/file/file.module";

@Module({
  imports: [TelegramModule, FileModule],
  controllers: [ChannelController],
  providers: [ChannelService, PrismaService],
  exports: [ChannelService],
})
export class ChannelModule {}
