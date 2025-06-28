import {
  Controller,
  Post,
  Body,
  HttpCode,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";

import { OrderChannelsService } from "./order-channels.service";
import { Auth } from "@/auth/decorators/auth.decorator";
import { CurrentUser } from "@/auth/decorators/user.decorator";
import { OrderChannelsDto } from "./dto/order-channels.dto";

@Controller("order-channels")
export class OrderChannelsController {
  constructor(private readonly orderService: OrderChannelsService) {}

  @Auth()
  @Post()
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async order(
    @Body() dto: OrderChannelsDto,
    @CurrentUser("id") userId: string
  ) {
    return this.orderService.createOrder(dto, userId);
  }
}
