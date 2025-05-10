import { Injectable } from "@nestjs/common";
import { Telegraf } from "telegraf";
import { InjectBot } from "nestjs-telegraf";
import { PrismaService } from "@/prisma.service";
import { TELEGRAM_MODERATORS } from "./telegram.constants";
import { Context } from "telegraf";

type SendMessageOptions = Parameters<Telegraf["telegram"]["sendMessage"]>[2];

@Injectable()
export class TelegramService {
  // moderatorId -> clientId
  private chatSession = new Map<number, number>();

  // clientId -> moderatorId
  private replyMap = new Map<number, number>();

  constructor(
    private readonly prisma: PrismaService,
    @InjectBot() private readonly bot: Telegraf
  ) {}

  async sendMessage(
    chatId: number,
    text: string,
    extra?: Parameters<Telegraf["telegram"]["sendMessage"]>[2]
  ): Promise<void> {
    await this.bot.telegram.sendMessage(chatId, text, extra);
  }

  async handleAction(
    ctx: Context,
    action: string,
    channelId: string,
    clientId: string
  ) {
    const chatId = ctx.chat?.id;
    const messageId = (ctx.callbackQuery as any)?.message?.message_id;

    if (!chatId || !messageId) return;

    if (action === "start_chat") {
      this.chatSession.set(chatId, Number(clientId)); // сохранили клиента для модератора
      await ctx.answerCbQuery("✏️ Напишите клиенту сообщение");
    }

    // approve и reject — как раньше...
    else if (action === "approve") {
      await this.prisma.telegramChannel.update({
        where: { id: channelId },
        data: { status: "APPROVED" },
      });

      await ctx.editMessageText("✅ Модерация завершена: одобрено");
      await this.sendMessage(Number(clientId), "✅ Ваш канал успешно одобрен.");
      await ctx.answerCbQuery("Одобрено");
    } else if (action === "reject") {
      await this.prisma.telegramChannel.update({
        where: { id: channelId },
        data: { status: "REJECTED" },
      });

      await ctx.editMessageText("❌ Модерация завершена: отклонено");
      await this.sendMessage(
        Number(clientId),
        "❌ Ваш канал отклонён модератором."
      );
      await ctx.answerCbQuery("Отклонено");
    }
  }

  async handleText(ctx: Context) {
    const message = ctx.message as any;
    const senderId = message?.from?.id;
    const text = message?.text;

    if (!message || message.chat.type !== "private" || !senderId || !text)
      return;

    const isModerator = TELEGRAM_MODERATORS.includes(senderId);
    const clientId = this.chatSession.get(senderId);

    if (isModerator && clientId) {
      // модератор → клиент
      await this.sendMessage(
        clientId,
        `💬 <b>Сообщение от модератора</b>:\n\n${text}`,
        { parse_mode: "HTML" }
      );

      this.replyMap.set(clientId, senderId); // сохраняем, кто писал
      return;
    }

    // клиент → модератор
    const moderatorId = this.replyMap.get(senderId);
    if (moderatorId) {
      await this.sendMessage(
        moderatorId,
        `📨 <b>Ответ от клиента</b>:\n@${message.from?.username} (ID: ${senderId})\n\n${text}`,
        { parse_mode: "HTML" }
      );
    }
  }
}
