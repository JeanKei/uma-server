import { Context as TelegrafContext } from "telegraf";

export interface TelegramContext extends TelegrafContext {
  session?: Record<string, any>;
}
