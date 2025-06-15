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

import { ChannelPostsService } from "./channel-rposts.service";

@Controller("channel-posts")
export class ChannelPostsController {
  constructor(private readonly channelPostsService: ChannelPostsService) {}

  @Get("by-channel/:channelId")
  async getByChannelId(@Param("channelId") channelId: string) {
    return this.channelPostsService.getByChannelId(channelId);
  }
}
