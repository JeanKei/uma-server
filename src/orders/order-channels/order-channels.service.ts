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
        images: dto.imageUrls,
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

    const moderatorMessage = `📥 Новый заказ рекламы
👤 Пользователь: @${user?.name ?? "неизвестно"}
📦 Каналов: ${dto.channels.length}
💰 Сумма: ${dto.totalPrice}₽
🧑‍🤝‍🧑 Подписчиков: ${dto.totalSubscribers}`;

    // Отправка текста модераторам
    if (MODERATOR_UMA) {
      await this.telegram.sendMessage(MODERATOR_UMA, moderatorMessage, {
        parse_mode: "HTML",
      });

      if (TELEGRAM_GROUP_CHAT_ID) {
        await this.telegram.sendMessage(
          TELEGRAM_GROUP_CHAT_ID,
          moderatorMessage,
          {
            parse_mode: "HTML",
          }
        );
      }
    }

    // Отправка изображений, если есть
    if (dto.imageUrls?.length) {
      const HOST = process.env.API_HOST?.replace(/\/$/, "") || "";

      const mediaGroup = dto.imageUrls.map((url) => ({
        type: "photo" as const,
        media: `${HOST}/uploads${url}`,
      }));

      if (MODERATOR_UMA) {
        await this.telegram.sendMediaGroup(MODERATOR_UMA, mediaGroup);
      }

      if (TELEGRAM_GROUP_CHAT_ID) {
        await this.telegram.sendMediaGroup(TELEGRAM_GROUP_CHAT_ID, mediaGroup);
      }
    }

    return { message: "Заявка успешно отправлена" };
  }
}
