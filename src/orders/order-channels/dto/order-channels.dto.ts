import {
  IsString,
  IsArray,
  IsInt,
  ValidateNested,
  ArrayNotEmpty,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";

class ChannelDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  link: string;

  @IsInt()
  price: number;

  @IsInt()
  subscribers: number;
}

class PublishDateDto {
  @IsString()
  date: string;

  @IsString()
  time: string;
}

export class OrderChannelsDto {
  @IsString()
  postText: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ChannelDto)
  channels: ChannelDto[];

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PublishDateDto)
  publishDates: PublishDateDto[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  imageUrls: string[];

  @IsInt()
  totalPrice: number;

  @IsInt()
  totalSubscribers: number;
}
