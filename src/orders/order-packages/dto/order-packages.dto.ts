import { IsString, IsOptional } from "class-validator";

export class OrderPackagesDto {
  @IsString()
  title: string;

  @IsString()
  subtitle: string;

  @IsString()
  price: string;
}
