import { Module } from "@nestjs/common";
import { UserChannelService } from "./user-channel.service";
import { UserChannelController } from "./user-channel.controller";
import { PrismaService } from "src/prisma.service";
import { TelegramModule } from "@/telegram/telegram.module";

@Module({
  imports: [TelegramModule],
  controllers: [UserChannelController],
  providers: [UserChannelService, PrismaService],
})
export class userChannelModule {}
