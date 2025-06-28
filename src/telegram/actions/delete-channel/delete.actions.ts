// import { Injectable } from "@nestjs/common";
// import { PrismaService } from "@/prisma.service";
// import { TELEGRAM_MODERATORS } from "@/telegram/telegram.constants";
// import { Telegraf } from "telegraf";
// import { InjectBot } from "nestjs-telegraf";

// @Injectable()
// export class DeleteChannelActions {
//   constructor(
//     private readonly prisma: PrismaService,
//     @InjectBot() private readonly bot: Telegraf
//   ) {}

//   async notifyOnDelete(channelId: string) {
//     const channel = await this.prisma.channel.findUnique({
//       where: { id: channelId },
//       select: {
//         url: true,
//         user: {
//           select: {
//             telegramId: true,
//             name: true,
//           },
//         },
//       },
//     });

//     if (!channel) return;

//     const clientName = channel.user?.name ?? "Клиент";
//     const clientTelegramId = channel.user?.telegramId;

//     // Уведомление клиенту
//     if (clientTelegramId) {
//       await this.bot.telegram.sendMessage(
//         clientTelegramId,
//         `✅ Вы успешно удалили канал <b>${channel.url}</b>.`,
//         { parse_mode: "HTML" }
//       );
//     }

//     // Уведомление модераторам
//     for (const modId of TELEGRAM_MODERATORS) {
//       await this.bot.telegram.sendMessage(
//         modId,
//         `🗑 Клиент @${clientName} удалил канал ${channel.url}`
//       );
//     }
//   }
// }

import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma.service";
import {
  MODERATOR_CHANNELS,
  TELEGRAM_GROUP_CHAT_ID,
} from "@/telegram/telegram.constants";
import { Telegraf } from "telegraf";
import { InjectBot } from "nestjs-telegraf";

@Injectable()
export class DeleteChannelActions {
  constructor(
    private readonly prisma: PrismaService,
    @InjectBot() private readonly bot: Telegraf
  ) {}

  async notifyOnDelete(channelId: string) {
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
      select: {
        url: true,
        user: {
          select: {
            telegramId: true,
            name: true,
          },
        },
      },
    });

    if (!channel) return;

    const clientName = channel.user?.name ?? "Клиент";
    const clientTelegramId = channel.user?.telegramId;

    if (clientTelegramId) {
      await this.bot.telegram.sendMessage(
        clientTelegramId,
        `✅ Вы успешно удалили канал <b>${channel.url}</b>.`,
        { parse_mode: "HTML" }
      );
    }

    // Уведомляем модератора каналов и группу
    await this.bot.telegram.sendMessage(
      MODERATOR_CHANNELS,
      `🗑 Клиент @${clientName} удалил канал ${channel.url}`
    );

    await this.bot.telegram.sendMessage(
      TELEGRAM_GROUP_CHAT_ID,
      `🗑 Клиент @${clientName} удалил канал ${channel.url}`
    );
  }
}
