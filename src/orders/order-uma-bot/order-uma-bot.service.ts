import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma.service";
import { TelegramService } from "@/telegram/telegram.service";
import {
  MODERATOR_UMA,
  TELEGRAM_GROUP_CHAT_ID,
} from "@/telegram/telegram.constants";
import { OrderUmaBotDto } from "./dto/order-uma-bot.dto";

@Injectable()
export class OrderUmaBotService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telegram: TelegramService
  ) {}

  async createOrder(dto: OrderUmaBotDto, userId: string) {
    const order = await this.prisma.orderUmaBot.create({
      data: {
        userId,
        title: dto.title,
        price: dto.price,
        priceYear: dto.priceYear,
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
        `🧾 Заявка <b>"UMA Бот"</b>\n Тариф <b>${dto.title}</b> успешно отправлена. Мы скоро свяжемся с вами.`,
        { parse_mode: "HTML" }
      );
    }

    // Уведомление модератору UMA
    if (MODERATOR_UMA) {
      const message = `📥 Новый заказ UMA Бот\n👤 Пользователь: @${user?.name ?? "неизвестно"}\n📦 Тариф: <b>${dto.title}</b>\n💰 Цена: ${dto.price}${dto.priceYear ? ` / ${dto.priceYear}` : ""}`;

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
