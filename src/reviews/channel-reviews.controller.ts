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

import { ChannelReviewsDto } from "./dto/channel-reviews.dto";
import { Auth } from "src/auth/decorators/auth.decorator";
import { ChannelReviewsService } from "./channel-reviews.service";

@Controller("channel-reviews")
export class ChannelReviewsController {
  constructor(private readonly channelReviewsService: ChannelReviewsService) {}

  @Auth()
  @Get()
  async getAll() {
    return this.channelReviewsService.getAll();
  }

  @Get("by-id/:id")
  async getById(@Param("id") id: string) {
    return this.channelReviewsService.getById(id);
  }

  @Get("by-channel/:channelId")
  async getByChannelId(@Param("channelId") channelId: string) {
    return this.channelReviewsService.getByChannelId(channelId);
  }

  @Auth()
  @Post()
  @HttpCode(200)
  async create(@Body() dto: ChannelReviewsDto) {
    return await this.channelReviewsService.create(dto);
  }

  @Auth()
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: ChannelReviewsDto) {
    return this.channelReviewsService.update(id, dto);
  }

  @Auth()
  @HttpCode(200)
  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.channelReviewsService.delete(id);
  }
}
