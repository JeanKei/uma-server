import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class ChannelDto {
  @IsString({
    message: "url обязательно",
  })
  @IsNotEmpty({
    message: "Поле не может быть пустым",
  })
  url: string;

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
}
