import { Module } from "@nestjs/common";

import { OrderFileController } from "./order-file.controller";
import { OrderFileService } from "./order-file.service";

@Module({
  controllers: [OrderFileController],
  providers: [OrderFileService],
  exports: [OrderFileService],
})
export class OrderFileModule {}
