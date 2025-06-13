import { ChannelStatus } from "@prisma/client";
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class ChannelDto {
  @IsString()
  @IsNotEmpty({
    message: "Поле не может быть пустым",
  })
  url: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsBoolean()
  isActual: boolean;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsBoolean()
  format24h: boolean;

  @IsBoolean()
  format48h: boolean;

  @IsBoolean()
  format72h: boolean;

  @IsBoolean()
  formatNative: boolean;

  @IsBoolean()
  format7d: boolean;

  @IsBoolean()
  formatRepost: boolean;

  @IsOptional()
  @IsEnum(ChannelStatus)
  status?: ChannelStatus;
}
