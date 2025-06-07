import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ChannelService } from "./channel.service";
import { ChannelDto } from "./dto/channel.dto";
import { Auth } from "src/auth/decorators/auth.decorator";
import { CurrentUser } from "@/auth/decorators/user.decorator";
import { ChannelFilterDto } from "./dto/channel-filter.dto";

@Controller("channel")
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  // @Auth()
  // @Get()
  // async getAll(@Query("page") page?: string, @Query("limit") limit?: string) {
  //   const pageNumber = parseInt(page ?? "1", 10);
  //   const limitNumber = parseInt(limit ?? "10", 10);
  //   return this.channelService.getAll(pageNumber, limitNumber);
  // }

  // @Get("approved")
  // async getApproved(
  //   @Query("page") page?: string,
  //   @Query("limit") limit?: string
  // ) {
  //   const pageNumber = parseInt(page ?? "1", 10);
  //   const limitNumber = parseInt(limit ?? "10", 10);
  //   return this.channelService.getApproved(pageNumber, limitNumber);
  // }

  @Auth()
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAll(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query() filter?: ChannelFilterDto
  ) {
    const pageNumber = parseInt(page ?? "1", 10);
    const limitNumber = parseInt(limit ?? "10", 10);
    return this.channelService.getAll(pageNumber, limitNumber, filter);
  }

  @Get("approved")
  @UsePipes(new ValidationPipe({ transform: true })) // ✅
  async getApproved(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query() filter?: ChannelFilterDto
  ) {
    const pageNumber = parseInt(page ?? "1", 10);
    const limitNumber = parseInt(limit ?? "10", 10);
    return this.channelService.getApproved(pageNumber, limitNumber, filter);
  }

  @Get("actual")
  async getIsActual() {
    return this.channelService.getIsActual();
  }

  @Get("url/:url")
  async getByUrl(@Param("url") url: string) {
    return this.channelService.getByUrl(url);
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
