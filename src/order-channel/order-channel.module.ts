import { Module } from "@nestjs/common";
import { PrismaService } from "@/prisma.service";
import { OrderChannelController } from "./order-channel.controller";
import { OrderChannelService } from "./order-channel.service";

@Module({
  controllers: [OrderChannelController],
  providers: [OrderChannelService, PrismaService],
})
export class OrderChannelModule {}
