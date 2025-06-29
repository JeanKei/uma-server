import { Injectable } from "@nestjs/common";
import { InjectBot } from "nestjs-telegraf";
import { Telegraf, Context } from "telegraf";
import { ChatActions } from "./actions/add-channel/chat.actions";
import { ModerationActions } from "./actions/add-channel/moderation.actions";
import { DeleteChannelActions } from "./actions/delete-channel/delete.actions";
import {
  MODERATOR_UMA,
  MODERATOR_PACKAGES,
  MODERATOR_CHANNELS,
  TELEGRAM_GROUP_CHAT_ID,
} from "./telegram.constants";

@Injectable()
export class TelegramService {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly chatActions: ChatActions,
    private readonly moderationActions: ModerationActions,
    private readonly deleteActions: DeleteChannelActions
  ) {}

  async sendMessage(
    chatId: number,
    text: string,
    extra: Record<string, any> = {}
  ): Promise<void> {
    await this.bot.telegram.sendMessage(chatId, text, {
      parse_mode: "HTML",
      ...extra,
    });
  }

  async sendMediaGroup(
    chatId: number,
    media: Array<{ type: "photo" | "video"; media: string; caption?: string }>
  ): Promise<void> {
    await this.bot.telegram.sendMediaGroup(chatId, media);
  }

  // Уведомление модератору UMA + в группу
  async notifyUmaModerator(message: string): Promise<void> {
    await this.sendMessage(MODERATOR_UMA, message);
    await this.sendMessage(TELEGRAM_GROUP_CHAT_ID, message);
  }

  // Уведомление модератору Packages + в группу
  async notifyPackagesModerator(message: string): Promise<void> {
    await this.sendMessage(MODERATOR_PACKAGES, message);
    await this.sendMessage(TELEGRAM_GROUP_CHAT_ID, message);
  }

  // Уведомление модератору Channels (включая Verification) + в группу
  async notifyChannelsModerator(message: string): Promise<void> {
    await this.sendMessage(MODERATOR_CHANNELS, message);
    await this.sendMessage(TELEGRAM_GROUP_CHAT_ID, message);
  }

  // Отправка только в групповой чат (при необходимости)
  async sendToGroup(message: string): Promise<void> {
    await this.sendMessage(TELEGRAM_GROUP_CHAT_ID, message);
  }

  // Обработка экшенов, переданных из Telegram callback (кнопки и т.д.)
  async handleAction(
    ctx: Context,
    action: string,
    id: string,
    clientId: string
  ) {
    switch (action) {
      case "approve":
      case "reject":
        return this.moderationActions.handle(ctx, action, id, clientId);

      // verification относится к модераторам каналов
      case "verify_approve":
      case "verify_reject":
        return this.moderationActions.handleVerification(
          ctx,
          action,
          id,
          clientId
        );

      case "start_chat":
        return this.chatActions.startChat(ctx, id, clientId);
    }
  }

  async handleReply(ctx: Context) {
    return this.chatActions.handleReply(ctx);
  }

  async handleRejectionReason(ctx: Context) {
    return this.moderationActions.handleRejectionReason(ctx);
  }

  async notifyChannelDeleted(channelId: string) {
    return this.deleteActions.notifyOnDelete(channelId);
  }
}
