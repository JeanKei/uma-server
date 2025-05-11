import { Injectable } from "@nestjs/common";
import { InjectBot } from "nestjs-telegraf";
import { Telegraf, Context } from "telegraf";
import { ChatActions } from "./actions/add-channel/chat.actions";
import { ModerationActions } from "./actions/add-channel/moderation.actions";
import { DeleteChannelActions } from "./actions/delete-channel/delete.actions";

@Injectable()
export class TelegramService {
  constructor(
    @InjectBot() private readonly bot: Telegraf,
    private readonly chatActions: ChatActions,
    private readonly moderationActions: ModerationActions,
    private readonly deleteActions: DeleteChannelActions
  ) {}

  async sendMessage(
    chatId: number,
    text: string,
    extra: Record<string, any> = {}
  ): Promise<void> {
    await this.bot.telegram.sendMessage(chatId, text, extra);
  }

  async handleAction(
    ctx: Context,
    action: string,
    channelId: string,
    clientId: string
  ) {
    switch (action) {
      case "approve":
      case "reject":
        return this.moderationActions.handle(ctx, action, channelId, clientId);
      case "start_chat":
        return this.chatActions.startChat(ctx, channelId, clientId);
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
