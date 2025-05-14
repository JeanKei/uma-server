import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Patch,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ChannelService } from "./channel.service";
import { ChannelDto } from "./dto/channel.dto";
import { Auth } from "src/auth/decorators/auth.decorator";
import { CurrentUser } from "@/auth/decorators/user.decorator";

@Controller("channel")
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Auth()
  @Get()
  async getAll() {
    return this.channelService.getAll();
  }

  @Get("approved")
  async getApproved() {
    return this.channelService.getApproved();
  }

  @Get("actual")
  async getIsActual() {
    return this.channelService.getIsActual();
  }

  @Auth()
  @Get("user")
  async getMyChannels(@CurrentUser("id") userId: string) {
    return this.channelService.getUserChannels(userId);
  }

  @Auth()
  @Get("by-id/:id")
  async getById(@Param("id") id: string) {
    return this.channelService.getById(id);
  }

  @Auth()
  @Post()
  @HttpCode(200)
  async create(@Body() dto: ChannelDto, @CurrentUser("id") userId: string) {
    return await this.channelService.create(dto, userId);
  }

  @Auth()
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: ChannelDto) {
    return this.channelService.update(id, dto);
  }

  @Auth()
  @HttpCode(200)
  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.channelService.delete(id);
  }
}
