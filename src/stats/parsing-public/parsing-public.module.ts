import { Module } from "@nestjs/common";
import { ParsingPublicService } from "./parsing-public.service";
import { ParsingPublicController } from "./parsing-public.controller";
import { PrismaService } from "src/prisma.service";
import { ParsingPublicCronService } from "./parsing-public.cron";

@Module({
  controllers: [ParsingPublicController],
  providers: [ParsingPublicService, ParsingPublicCronService, PrismaService],
})
export class ParsingPublicModule {}
