import { Module } from "@nestjs/common";
import { StatPublicService } from "./services/stat-public.service";
import { Stage3Service } from "./services/stage-3.service";
import { Stage2Service } from "./services/stage-2.service";
import { Stage1Service } from "./services/stage-1.service";
import { PrismaService } from "@/prisma.service";
import { StatPublicController } from "./stat-public.controller";
import { StatPublicCronService } from "./stat-public.cron";

@Module({
  controllers: [StatPublicController],
  providers: [
    StatPublicService,
    StatPublicCronService,
    PrismaService,
    Stage1Service,
    Stage2Service,
    Stage3Service,
  ],
})
export class StatPublicModule {}
