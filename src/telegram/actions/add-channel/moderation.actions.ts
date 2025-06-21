import { Injectable } from "@nestjs/common";
import { Context } from "telegraf";
import { PrismaService } from "@/prisma.service";

@Injectable()
export class ModerationActions {
  constructor(private readonly prisma: PrismaService) {}

  private isTextMessage(message: any): message is { text: string } {
    return typeof message?.text === "string";
  }

  async handle(
    ctx: Context,
    action: string,
    channelId: string,
    clientId: string
  ) {
    const chatId = ctx.chat?.id;
    const messageId = ctx.callbackQuery?.message?.message_id;
    if (!chatId || !messageId) return;

    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
      select: { url: true, userId: true },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: channel?.userId },
      select: { name: true, telegramId: true },
    });

    const channelUrl = channel?.url ?? "Неизвестно";
    const clientName = user?.name ?? "Клиент";

    if (action === "approve") {
      await this.prisma.channel.update({
        where: { id: channelId },
        data: { status: "APPROVED" },
      });

      await ctx.editMessageText(
        `✅ Модерация завершена: одобрено\n👤 Клиент: @${clientName}\n📎 Канал: ${channelUrl}`
      );

      await ctx.telegram.sendMessage(
        Number(clientId),
        `✅ Ваш канал <b>${channelUrl}</b> одобрен!`,
        { parse_mode: "HTML" }
      );

      await ctx.answerCbQuery("Одобрено");
    }

    if (action === "reject") {
      await this.prisma.moderatorChatSession.upsert({
        where: { moderatorId: String(ctx.from?.id) },
        update: { clientId, pendingRejection: channelId },
        create: {
          moderatorId: String(ctx.from?.id),
          clientId,
          pendingRejection: channelId,
        },
      });

      await ctx.telegram.sendMessage(
        ctx.from!.id,
        "❗️Введите причину отказа клиенту:"
        // БЕЗ force_reply — теперь обычное сообщение
      );

      await ctx.answerCbQuery("Введите причину отказа");
    }
  }

  async handleVerification(
    ctx: Context,
    action: string,
    verificationId: string,
    clientId: string
  ) {
    const chatId = ctx.chat?.id;
    const messageId = ctx.callbackQuery?.message?.message_id;
    if (!chatId || !messageId) return;

    const verification = await this.prisma.channelVerification.findUnique({
      where: { id: verificationId },
      include: {
        channel: { select: { url: true } },
        user: { select: { name: true, telegramId: true } },
      },
    });

    if (!verification) return;

    const channelUrl = verification.channel.url;
    const clientName = verification.user?.name ?? "Клиент";

    if (action === "verify_approve") {
      await this.prisma.$transaction([
        this.prisma.channelVerification.update({
          where: { id: verificationId },
          data: { status: "APPROVED" },
        }),
        this.prisma.channel.update({
          where: { id: verification.channelId },
          data: { userId: verification.userId },
        }),
      ]);

      await ctx.editMessageText(
        `✅ Верификация завершена: права подтверждены\n👤 Клиент: @${clientName}\n📎 Канал: ${channelUrl}`
      );

      await ctx.telegram.sendMessage(
        Number(clientId),
        `✅ Права на канал <b>${channelUrl}</b> подтверждены!`,
        { parse_mode: "HTML" }
      );

      await ctx.answerCbQuery("Права подтверждены");
    }

    if (action === "verify_reject") {
      await this.prisma.moderatorChatSession.upsert({
        where: { moderatorId: String(ctx.from?.id) },
        update: { clientId, pendingRejection: verificationId },
        create: {
          moderatorId: String(ctx.from?.id),
          clientId,
          pendingRejection: verificationId,
        },
      });

      await ctx.telegram.sendMessage(
        ctx.from!.id,
        "❗️Введите причину отказа клиенту:"
      );

      await ctx.answerCbQuery("Введите причину отказа");
    }
  }

  // async handleRejectionReason(ctx: Context) {
  //   const moderatorId = String(ctx.from?.id);
  //   const session = await this.prisma.moderatorChatSession.findUnique({
  //     where: { moderatorId },
  //   });

  //   if (!session?.pendingRejection) return;

  //   const message = ctx.message;
  //   if (!this.isTextMessage(message)) return;

  //   const reason = message.text;

  //   const channel = await this.prisma.channel.findUnique({
  //     where: { id: session.pendingRejection },
  //     select: { url: true, userId: true },
  //   });

  //   const user = await this.prisma.user.findUnique({
  //     where: { id: channel?.userId },
  //     select: { name: true, telegramId: true },
  //   });

  //   // Обновляем статус
  //   await this.prisma.channel.update({
  //     where: { id: session.pendingRejection },
  //     data: { status: "REJECTED" },
  //   });

  //   const channelUrl = channel?.url ?? "неизвестно";

  //   // 🔴 1. Сообщение: отклонение
  //   await ctx.telegram.sendMessage(
  //     Number(session.clientId),
  //     `❌ Ваш канал <b>${channelUrl}</b> отклонён модерацией.`,
  //     { parse_mode: "HTML" }
  //   );

  //   // 🔴 2. Причина отказа
  //   await ctx.telegram.sendMessage(
  //     Number(session.clientId),
  //     `❗️ <b>Причина отказа</b>:\n${reason}`,
  //     { parse_mode: "HTML" }
  //   );

  //   // 🧑‍💼 Подтверждение модератору
  //   await ctx.reply(
  //     `📨 Причина отказа отправлена клиенту.\n\n👤 Клиент: @${user?.name} (ID: ${user?.telegramId})\n📎 Канал: ${channel?.url}\n📄 Причина: ${reason}`,
  //     { parse_mode: "HTML" }
  //   );

  //   // Очистка флага
  //   await this.prisma.moderatorChatSession.update({
  //     where: { moderatorId },
  //     data: { pendingRejection: null },
  //   });
  // }

  async handleRejectionReason(ctx: Context) {
    const moderatorId = String(ctx.from?.id);
    const session = await this.prisma.moderatorChatSession.findUnique({
      where: { moderatorId },
    });

    if (!session?.pendingRejection) return;

    const message = ctx.message;
    if (!this.isTextMessage(message)) return;

    const reason = message.text;

    const verification = await this.prisma.channelVerification.findUnique({
      where: { id: session.pendingRejection },
      include: {
        channel: { select: { url: true } },
        user: { select: { name: true, telegramId: true } },
      },
    });

    const channel = await this.prisma.channel.findUnique({
      where: { id: session.pendingRejection },
      select: { url: true, userId: true },
    });

    const user = channel
      ? await this.prisma.user.findUnique({
          where: { id: channel.userId },
          select: { name: true, telegramId: true },
        })
      : verification?.user;

    const isVerification = !!verification;

    const channelUrl =
      verification?.channel.url ?? channel?.url ?? "неизвестно";

    if (isVerification) {
      await this.prisma.channelVerification.update({
        where: { id: session.pendingRejection },
        data: { status: "REJECTED" },
      });
    } else {
      await this.prisma.channel.update({
        where: { id: session.pendingRejection },
        data: { status: "REJECTED" },
      });
    }

    await ctx.telegram.sendMessage(
      Number(session.clientId),
      `❌ ${isVerification ? "Запрос на подтверждение прав" : "Канал"} <b>${channelUrl}</b> отклонён модерацией.`,
      { parse_mode: "HTML" }
    );

    await ctx.telegram.sendMessage(
      Number(session.clientId),
      `❗️ <b>Причина отказа</b>:\n${reason}`,
      { parse_mode: "HTML" }
    );

    await ctx.reply(
      `📨 Причина отказа отправлена клиенту.\n\n👤 Клиент: @${user?.name} (ID: ${user?.telegramId})\n📎 ${isVerification ? "Запрос на подтверждение прав" : "Канал"}: ${channelUrl}\n📄 Причина: ${reason}`,
      { parse_mode: "HTML" }
    );

    await this.prisma.moderatorChatSession.update({
      where: { moderatorId },
      data: { pendingRejection: null },
    });
  }
}
