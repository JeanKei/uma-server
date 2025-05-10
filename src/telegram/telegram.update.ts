// telegram.update.ts
import { Update, Ctx, Start, On, Action } from "nestjs-telegraf";
import { Context } from "telegraf";
import { TelegramService } from "./telegram.service";

@Update()
export class TelegramUpdate {
  constructor(private readonly telegramService: TelegramService) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    await ctx.reply("Бот запущен. Ожидаю действий.");
  }

  @Action(/^(approve|reject|start_chat):(.+):(.+)$/)
  async onAction(@Ctx() ctx: Context) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery || !("data" in callbackQuery)) return;

    const data = callbackQuery.data;
    const [action, channelId, clientId] = data.split(":");
    await this.telegramService.handleAction(ctx, action, channelId, clientId);
  }

  @On("text")
  async onText(@Ctx() ctx: Context) {
    await this.telegramService.handleText(ctx);
  }
}
