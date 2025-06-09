import { Transform, Type } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

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
  minGenderM?: number;

  @IsOptional()
  @Type(() => Number)
  minView?: number;

  @IsOptional()
  @Type(() => Number)
  maxView?: number;

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

  @IsOptional()
  @IsString()
  searchQuery?: string;
}
