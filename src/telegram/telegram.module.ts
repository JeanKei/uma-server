import { Module } from "@nestjs/common";
import { TelegrafModule } from "nestjs-telegraf";
import { TelegramUpdate } from "./telegram.update";
import { TelegramService } from "./telegram.service";
import { PrismaService } from "@/prisma.service";
import { TELEGRAM_BOT_TOKEN } from "./telegram.constants";
import { ModerationActions } from "./actions/add-channel/moderation.actions";
import { ChatActions } from "./actions/add-channel/chat.actions";
import { DeleteChannelActions } from "./actions/delete-channel/delete.actions";

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: TELEGRAM_BOT_TOKEN,
    }),
  ],
  providers: [
    TelegramUpdate,
    TelegramService,
    PrismaService,
    ModerationActions,
    ChatActions,
    DeleteChannelActions,
  ],
  exports: [TelegramService],
})
export class TelegramModule {}
