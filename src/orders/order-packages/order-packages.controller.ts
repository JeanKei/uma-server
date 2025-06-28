import {
  Controller,
  Post,
  Body,
  HttpCode,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";

import { OrderPackagesService } from "./order-packages.service";
import { Auth } from "@/auth/decorators/auth.decorator";
import { CurrentUser } from "@/auth/decorators/user.decorator";
import { OrderPackagesDto } from "./dto/order-packages.dto";

@Controller("order-packages")
export class OrderPackagesController {
  constructor(private readonly orderService: OrderPackagesService) {}

  @Auth()
  @Post()
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async order(
    @Body() dto: OrderPackagesDto,
    @CurrentUser("id") userId: string
  ) {
    return this.orderService.createOrder(dto, userId);
  }
}
