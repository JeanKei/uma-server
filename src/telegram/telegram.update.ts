import { Update, Ctx, Start, On, Action } from "nestjs-telegraf";
import { Context } from "telegraf";
import { TelegramService } from "./telegram.service";
import { PrismaService } from "@/prisma.service";

@Update()
export class TelegramUpdate {
  constructor(
    private readonly telegramService: TelegramService,
    private readonly prisma: PrismaService
  ) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    await ctx.reply("Бот запущен. Ожидаю действий.");
  }

  @Action(
    /^(approve|reject|start_chat|verify_approve|verify_reject):(.+):(.+)$/
  )
  async onAction(@Ctx() ctx: Context) {
    const data = "data" in ctx.callbackQuery ? ctx.callbackQuery.data : null;
    if (!data) return;

    const [action, channelId, clientId] = data.split(":");
    await this.telegramService.handleAction(ctx, action, channelId, clientId);
  }

  @On("text")
  async onText(@Ctx() ctx: Context) {
    const moderatorId = String(ctx.from?.id);

    const session = await this.prisma.moderatorChatSession.findUnique({
      where: { moderatorId },
    });

    if (session?.pendingRejection) {
      await this.telegramService.handleRejectionReason(ctx);
    } else {
      await this.telegramService.handleReply(ctx);
    }
  }
}
