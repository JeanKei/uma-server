import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class ChannelReviewsDto {
  @IsString({ message: "Введите имя!" })
  @IsNotEmpty({ message: "Имя не может быть пустым!" })
  name: string;

  @IsString({ message: "Введите описание!" })
  @IsNotEmpty({ message: "Описание не может быть пустым!" })
  description: string;

  @IsString({ message: "Введите текст отзыва!" })
  @IsNotEmpty({ message: "Отзыв не может быть пустым!" })
  review: string;

  @IsNumber({}, { message: "Рейтинг должен быть числом!" })
  @Min(1, { message: "Рейтинг должен быть не менее 1!" })
  @Max(5, { message: "Рейтинг должен быть не более 5!" })
  rating: number;

  @IsString({ message: "Введите ID канала!" })
  @IsNotEmpty({ message: "ID канала не может быть пустым!" })
  channelId: string;
}
