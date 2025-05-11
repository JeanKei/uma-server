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
import { UserChannelService } from "./user-channel.service";
import { UserChannelDto } from "./dto/user-channel.dto";
import { Auth } from "src/auth/decorators/auth.decorator";
import { CurrentUser } from "@/auth/decorators/user.decorator";

@Controller("user-channel")
export class UserChannelController {
  constructor(private readonly userChannelService: UserChannelService) {}

  @Auth()
  @Get()
  async getAll() {
    return this.userChannelService.getAll();
  }

  @Auth()
  @Get("my")
  async getMyChannels(@CurrentUser("id") userId: string) {
    return this.userChannelService.getUserChannels(userId);
  }

  @Auth()
  @Get("by-id/:id")
  async getById(@Param("id") id: string) {
    return this.userChannelService.getById(id);
  }

  @Auth()
  @Post()
  @HttpCode(200)
  async create(@Body() dto: UserChannelDto, @CurrentUser("id") userId: string) {
    return await this.userChannelService.create(dto, userId);
  }

  @Auth()
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: UserChannelDto) {
    return this.userChannelService.update(id, dto);
  }

  @Auth()
  @HttpCode(200)
  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.userChannelService.delete(id);
  }
}
