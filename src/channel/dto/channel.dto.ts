import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

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
}
