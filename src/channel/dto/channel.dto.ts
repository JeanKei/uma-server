import { IsNotEmpty, IsString } from "class-validator";

export class ChannelDto {
  @IsString({
    message: "url обязательно",
  })
  @IsNotEmpty({
    message: "Поле не может быть пустым",
  })
  url: string;

  // @IsString({
  //   message: "Название обязательно",
  // })
  // @IsNotEmpty({
  //   message: "Поле не может быть пустым",
  // })
  // title: string;
}
