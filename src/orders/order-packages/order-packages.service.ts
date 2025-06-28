import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma.service";
import { TelegramService } from "@/telegram/telegram.service";
import {
  MODERATOR_PACKAGES,
  TELEGRAM_GROUP_CHAT_ID,
} from "@/telegram/telegram.constants";
import { OrderPackagesDto } from "./dto/order-packages.dto";

@Injectable()
export class OrderPackagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telegram: TelegramService
  ) {}

  async createOrder(dto: OrderPackagesDto, userId: string) {
    const order = await this.prisma.orderPackages.create({
      data: {
        userId,
        title: dto.title,
        subtitle: dto.title,
        price: dto.price,
      },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, telegramId: true },
    });

    // Уведомление пользователю
    if (user?.telegramId) {
      await this.telegram.sendMessage(
        Number(user.telegramId),
        `🧾 Заявка на Интеграция под ключ\nТариф <b>${dto.title}</b> успешно отправлена. Мы скоро свяжемся с вами.`,
        { parse_mode: "HTML" }
      );
    }

    // Уведомление модератору Packages
    if (MODERATOR_PACKAGES) {
      const message = `📥 Новый заказ <b>"Интеграция под ключ"</b>\n👤 Пользователь: @${user?.name ?? "неизвестно"}\n📦 Тариф: <b>${dto.title}</b>\n📦<b>${dto.subtitle}</b>\n💰 Цена: ${dto.price}`;

      await this.telegram.sendMessage(MODERATOR_PACKAGES, message, {
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
