// import { Injectable } from "@nestjs/common";
// import { Context } from "telegraf";
// import { TELEGRAM_MODERATORS } from "@/telegram/telegram.constants";
// import { PrismaService } from "@/prisma.service";

// @Injectable()
// export class ChatActions {
//   constructor(private readonly prisma: PrismaService) {}

//   async startChat(ctx: Context, channelId: string, clientId: string) {
//     const moderatorId = ctx.from?.id;
//     if (!moderatorId) return;

//     // Получаем username клиента
//     const user = await this.prisma.user.findUnique({
//       where: { telegramId: clientId },
//       select: { name: true },
//     });

//     const clientUsername = user?.name ?? clientId;

//     // сохраняем сессию (кто с кем говорит)
//     await this.prisma.moderatorChatSession.upsert({
//       where: { moderatorId: String(moderatorId) },
//       update: { clientId },
//       create: {
//         moderatorId: String(moderatorId),
//         clientId,
//       },
//     });

//     // ❗ отправляем сообщение ТОЛЬКО модератору
//     await ctx.telegram.sendMessage(
//       moderatorId,
//       `✏️ Введите сообщение для клиента @${clientUsername}`
//     );

//     // Всплывающее уведомление
//     await ctx.answerCbQuery("Вы выбрали клиента");
//   }

//   async handleReply(ctx: Context) {
//     const fromId = ctx.from?.id?.toString();
//     const message = ctx.message;

//     if (!message || message.chat.type !== "private" || !("text" in message))
//       return;

//     const text = message.text;

//     // 1. Проверка — это модератор
//     const isModerator = TELEGRAM_MODERATORS.includes(Number(fromId));
//     if (isModerator) {
//       const session = await this.prisma.moderatorChatSession.findUnique({
//         where: { moderatorId: fromId },
//       });

//       if (!session) {
//         await ctx.reply(
//           "❗️Вы не выбрали клиента. Сначала нажмите кнопку «Связаться с клиентом»."
//         );
//         return;
//       }

//       // отправка клиенту
//       await ctx.telegram.sendMessage(
//         Number(session.clientId),
//         `💬 <b>Сообщение от модератора</b>:\n\n${text}`,
//         { parse_mode: "HTML" }
//       );

//       // 👉 Получаем имя клиента
//       const client = await this.prisma.user.findUnique({
//         where: { telegramId: session.clientId },
//         select: { name: true },
//       });

//       await ctx.reply(
//         `📨 Сообщение отправлено клиенту${client?.name ? ` @${client.name}` : ""}.`
//       );
//       return;
//     }

//     // 2. Клиент отвечает → отправить модераторам
//     for (const modId of TELEGRAM_MODERATORS) {
//       await ctx.telegram.sendMessage(
//         modId,
//         `📨 <b>Ответ от клиента</b>:\n@${ctx.from?.username} (ID: ${ctx.from?.id})\n\n${text}`,
//         { parse_mode: "HTML" }
//       );
//     }
//   }
// }

import { Injectable } from "@nestjs/common";
import { Context } from "telegraf";
import {
  TELEGRAM_MODERATORS,
  MODERATOR_CHANNELS,
  TELEGRAM_GROUP_CHAT_ID,
} from "@/telegram/telegram.constants";
import { PrismaService } from "@/prisma.service";

@Injectable()
export class ChatActions {
  constructor(private readonly prisma: PrismaService) {}

  async startChat(ctx: Context, channelId: string, clientId: string) {
    const moderatorId = ctx.from?.id;
    if (!moderatorId) return;

    const user = await this.prisma.user.findUnique({
      where: { telegramId: clientId },
      select: { name: true },
    });

    const clientUsername = user?.name ?? clientId;

    await this.prisma.moderatorChatSession.upsert({
      where: { moderatorId: String(moderatorId) },
      update: { clientId },
      create: { moderatorId: String(moderatorId), clientId },
    });

    await ctx.telegram.sendMessage(
      moderatorId,
      `✏️ Введите сообщение для клиента @${clientUsername}`
    );

    await ctx.answerCbQuery("Вы выбрали клиента");
  }

  async handleReply(ctx: Context) {
    const fromId = ctx.from?.id?.toString();
    const message = ctx.message;

    if (!message || message.chat.type !== "private" || !("text" in message))
      return;

    const text = message.text;

    // 1. Если это модератор — отправляем сообщение клиенту
    const isModerator = TELEGRAM_MODERATORS.includes(Number(fromId));
    if (isModerator) {
      const session = await this.prisma.moderatorChatSession.findUnique({
        where: { moderatorId: fromId },
      });

      if (!session) {
        await ctx.reply(
          "❗️Вы не выбрали клиента. Сначала нажмите кнопку «Связаться с клиентом»."
        );
        return;
      }

      await ctx.telegram.sendMessage(
        Number(session.clientId),
        `💬 <b>Сообщение от модератора</b>:\n\n${text}`,
        { parse_mode: "HTML" }
      );

      const client = await this.prisma.user.findUnique({
        where: { telegramId: session.clientId },
        select: { name: true },
      });

      await ctx.reply(
        `📨 Сообщение отправлено клиенту${client?.name ? ` @${client.name}` : ""}.`
      );
      return;
    }

    // 2. Если это клиент — отправляем сообщение ВСЕМ 3 модераторам (UMA, Packages, Channels)
    for (const modId of TELEGRAM_MODERATORS) {
      await ctx.telegram.sendMessage(
        modId,
        `📨 <b>Ответ от клиента</b>:\n@${ctx.from?.username} (ID: ${ctx.from?.id})\n\n${text}`,
        { parse_mode: "HTML" }
      );
    }
  }
}
