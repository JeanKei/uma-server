import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma.service";
import { TelegramService } from "@/telegram/telegram.service";
import {
  MODERATOR_UMA,
  TELEGRAM_GROUP_CHAT_ID,
} from "@/telegram/telegram.constants";
import { OrderChannelsDto } from "./dto/order-channels.dto";

@Injectable()
export class OrderChannelsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telegram: TelegramService
  ) {}

  async createOrder(dto: OrderChannelsDto, userId: string) {
    const order = await this.prisma.orderChannels.create({
      data: {
        userId,
        postText: dto.postText,
        totalPrice: dto.totalPrice,
        totalSubscribers: dto.totalSubscribers,
        images: dto.imageUrls, // <- соответствие по названию

        publishDates: JSON.parse(JSON.stringify(dto.publishDates)),
        channels: JSON.parse(JSON.stringify(dto.channels)),
      },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, telegramId: true },
    });

    if (user?.telegramId) {
      await this.telegram.sendMessage(
        Number(user.telegramId),
        `🧾 Заявка на рекламу успешно отправлена. Мы скоро свяжемся с вами.`,
        { parse_mode: "HTML" }
      );
    }

    if (MODERATOR_UMA) {
      const message = `📥 Новый заказ рекламы\n👤 Пользователь: @${user?.name ?? "неизвестно"}\n📦 Каналов: ${dto.channels.length}\n💰 Сумма: ${dto.totalPrice}₽\n🧑‍🤝‍🧑 Подписчиков: ${dto.totalSubscribers}`;

      await this.telegram.sendMessage(MODERATOR_UMA, message, {
        parse_mode: "HTML",
      });

      if (TELEGRAM_GROUP_CHAT_ID) {
        await this.telegram.sendMessage(TELEGRAM_GROUP_CHAT_ID, message, {
          parse_mode: "HTML",
        });
      }
    }

    return { message: "Заявка успешно отправлена" };
  }
}
