export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
export const TELEGRAM_MODERATORS = (process.env.TELEGRAM_MODERATORS || "")
  .split(",")
  .map((id) => Number(id));
