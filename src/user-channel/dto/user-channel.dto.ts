import { IsNotEmpty, IsString } from "class-validator";

export class UserChannelDto {
  @IsString({
    message: "Ссылка url обязательна",
  })
  @IsNotEmpty({
    message: "Поле ее может быть пустым",
  })
  url: string;
}
