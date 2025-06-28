import {
  Controller,
  Post,
  Body,
  HttpCode,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";

import { OrderUmaBotService } from "./order-uma-bot.service";
import { Auth } from "@/auth/decorators/auth.decorator";
import { CurrentUser } from "@/auth/decorators/user.decorator";
import { OrderUmaBotDto } from "./dto/order-uma-bot.dto";

@Controller("order-uma-bot")
export class OrderUmaBotController {
  constructor(private readonly orderService: OrderUmaBotService) {}

  @Auth()
  @Post()
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async order(@Body() dto: OrderUmaBotDto, @CurrentUser("id") userId: string) {
    return this.orderService.createOrder(dto, userId);
  }
}
