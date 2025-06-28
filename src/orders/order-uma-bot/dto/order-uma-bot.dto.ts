import { IsString, IsOptional } from "class-validator";

export class OrderUmaBotDto {
  @IsString()
  title: string;

  @IsString()
  price: string;

  @IsOptional()
  @IsString()
  priceYear?: string;
}
