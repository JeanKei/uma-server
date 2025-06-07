import { Transform, Type } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional } from "class-validator";

export class ChannelFilterDto {
  @IsOptional()
  @Type(() => Number)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  minSubscribers?: number;

  @IsOptional()
  @Type(() => Number)
  maxSubscribers?: number;

  @IsOptional()
  @Type(() => Number)
  minPhotos?: number;

  @IsOptional()
  @Type(() => Number)
  maxPhotos?: number;

  @IsOptional()
  @Type(() => Number)
  minVideos?: number;

  @IsOptional()
  @Type(() => Number)
  maxVideos?: number;

  @IsOptional()
  @Type(() => Number)
  minFiles?: number;

  @IsOptional()
  @Type(() => Number)
  maxFiles?: number;

  @IsOptional()
  @Type(() => Number)
  minLinks?: number;

  @IsOptional()
  @Type(() => Number)
  maxLinks?: number;

  @IsOptional()
  @Type(() => Number)
  genderCenter?: number;

  @IsOptional()
  @Type(() => Number)
  genderDelta?: number;

  @IsOptional()
  @Type(() => Number)
  minViews?: number;

  @IsOptional()
  @Type(() => Number)
  maxViews?: number;

  @IsOptional()
  @Type(() => Number)
  minEr?: number;

  @IsOptional()
  @Type(() => Number)
  maxEr?: number;

  @IsOptional()
  @Type(() => Number)
  minCpv?: number;

  @IsOptional()
  @Type(() => Number)
  maxCpv?: number;

  @IsOptional()
  @Transform(({ value }) => value === "true")
  @IsBoolean()
  isVerified?: boolean;
}
