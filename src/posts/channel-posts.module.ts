import { Module } from "@nestjs/common";
import { ChannelPostsService } from "./channel-rposts.service";
import { ChannelPostsController } from "./channel-posts.controller";
import { PrismaService } from "src/prisma.service";

@Module({
  controllers: [ChannelPostsController],
  providers: [ChannelPostsService, PrismaService],
})
export class ChannelPostsModule {}
