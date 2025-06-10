import { Module } from "@nestjs/common";
import { ChannelReviewsService } from "./channel-reviews.service";
import { ChannelReviewsController } from "./channel-reviews.controller";
import { PrismaService } from "src/prisma.service";

@Module({
  controllers: [ChannelReviewsController],
  providers: [ChannelReviewsService, PrismaService],
})
export class ChannelReviewsModule {}
