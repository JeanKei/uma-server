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
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { ChannelService } from "./channel.service";
import { ChannelDto, VerifyChannelDto } from "./dto/channel.dto";
import { Auth } from "src/auth/decorators/auth.decorator";
import { CurrentUser } from "@/auth/decorators/user.decorator";
import {
  ChannelQueryInput,
  SortField,
  SortOrder,
} from "./filters/channel-filter.types";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("channel")
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get("categories")
  async getCategories() {
    return this.channelService.getCategories();
  }

  @Get("max-values")
  async getMaxValues() {
    return this.channelService.getMaxValues();
  }

  @Get()
  async getAll(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
    @Query("minSubscribers") minSubscribers?: string,
    @Query("maxSubscribers") maxSubscribers?: string,
    @Query("minView") minView?: string,
    @Query("maxView") maxView?: string,
    @Query("minEr") minEr?: string,
    @Query("maxEr") maxEr?: string,
    @Query("minPrice") minPrice?: string,
    @Query("maxPrice") maxPrice?: string,
    @Query("minCpv") minCpv?: string,
    @Query("maxCpv") maxCpv?: string,
    @Query("sortBy") sortBy?: SortField,
    @Query("sortOrder") sortOrder?: SortOrder,
    @Query("searchQuery") searchQuery?: string,
    @Query("categories") categories?: string,
    @Query("isVerified") isVerified?: string
  ) {
    const filter: ChannelQueryInput = {
      page: Number(page),
      limit: Number(limit),
      filter: {
        minSubscribers: minSubscribers ? Number(minSubscribers) : undefined,
        maxSubscribers: maxSubscribers ? Number(maxSubscribers) : undefined,
        minView: minView ? Number(minView) : undefined,
        maxView: maxView ? Number(maxView) : undefined,
        minEr: minEr ? Number(minEr) : undefined,
        maxEr: maxEr ? Number(maxEr) : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        minCpv: minCpv ? Number(minCpv) : undefined,
        maxCpv: maxCpv ? Number(maxCpv) : undefined,
        searchQuery,
        categories: categories ? categories.split(",") : undefined,
        isVerified: isVerified ? isVerified === "true" : undefined,
      },
      sortBy,
      sortOrder,
    };
    return this.channelService.getAll(filter);
  }

  @Get("approved")
  async getApproved(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
    @Query("minSubscribers") minSubscribers?: string,
    @Query("maxSubscribers") maxSubscribers?: string,
    @Query("minView") minView?: string,
    @Query("maxView") maxView?: string,
    @Query("minEr") minEr?: string,
    @Query("maxEr") maxEr?: string,
    @Query("minPrice") minPrice?: string,
    @Query("maxPrice") maxPrice?: string,
    @Query("minCpv") minCpv?: string,
    @Query("maxCpv") maxCpv?: string,
    @Query("sortBy") sortBy?: SortField,
    @Query("sortOrder") sortOrder?: SortOrder,
    @Query("searchQuery") searchQuery?: string,
    @Query("categories") categories?: string,
    @Query("isVerified") isVerified?: string
  ) {
    const filter: ChannelQueryInput = {
      page: Number(page),
      limit: Number(limit),
      filter: {
        minSubscribers: minSubscribers ? Number(minSubscribers) : undefined,
        maxSubscribers: maxSubscribers ? Number(maxSubscribers) : undefined,
        minView: minView ? Number(minView) : undefined,
        maxView: maxView ? Number(maxView) : undefined,
        minEr: minEr ? Number(minEr) : undefined,
        maxEr: maxEr ? Number(maxEr) : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        minCpv: minCpv ? Number(minCpv) : undefined,
        maxCpv: maxCpv ? Number(maxCpv) : undefined,
        searchQuery,
        categories: categories ? categories.split(",") : undefined,
        isVerified: isVerified ? isVerified === "true" : undefined,
      },
      sortBy,
      sortOrder,
    };
    return this.channelService.getApproved(filter);
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
  async create(
    @Body() dto: ChannelDto,
    @CurrentUser("id") userId: string,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return await this.channelService.create(dto, userId, file);
  }

  @Auth()
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Patch(":id")
  @UseInterceptors(FileInterceptor("image"))
  async update(
    @Param("id") id: string,
    @Body() dto: ChannelDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.channelService.update(id, dto, file);
  }

  @Auth()
  @HttpCode(200)
  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.channelService.delete(id);
  }

  @Auth()
  @Post("verify")
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async verify(
    @Body() dto: VerifyChannelDto,
    @CurrentUser("id") userId: string
  ) {
    return this.channelService.verify(dto, userId);
  }
}
