import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ArticleDto {
  @IsString({
    message: "Введите текст!",
  })
  @IsNotEmpty({
    message: "Введите заголовок!",
  })
  title: string;

  @IsString({
    message: "Введите текст!",
  })
  @IsNotEmpty({
    message: "Напишите статью!",
  })
  content: string;

  @IsString({
    message: "Введите текст!",
  })
  @IsNotEmpty({
    message: "Введите чпу!",
  })
  slug: string;
}
