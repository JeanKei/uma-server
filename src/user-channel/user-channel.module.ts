import { Module } from "@nestjs/common";
import { UserChannelService } from "./user-channel.service";
import { UserChannelController } from "./user-channel.controller";
import { PrismaService } from "src/prisma.service";

@Module({
  controllers: [UserChannelController],
  providers: [UserChannelService, PrismaService],
})
export class userChannelModule {}
