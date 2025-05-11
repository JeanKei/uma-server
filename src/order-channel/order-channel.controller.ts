import { Controller, Get } from "@nestjs/common";
import { OrderChannelService } from "./order-channel.service";

@Controller("channels")
export class OrderChannelController {
  constructor(private readonly orderChannelService: OrderChannelService) {}

  @Get()
  async getOrder() {
    return this.orderChannelService.getOrder();
  }
}
