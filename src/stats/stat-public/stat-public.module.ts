import { Module } from "@nestjs/common";
import { StatPublicService } from "./stat-public.service";
import { StatPublicController } from "./stat-public.controller";
import { PrismaService } from "src/prisma.service";
import { StatPublicCronService } from "./stat-public.cron";

@Module({
  controllers: [StatPublicController],
  providers: [StatPublicService, StatPublicCronService, PrismaService],
})
export class StatPublicModule {}
