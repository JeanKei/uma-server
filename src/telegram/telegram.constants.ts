export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

export const TELEGRAM_GROUP_CHAT_ID =
  Number(process.env.TELEGRAM_GROUP_CHAT_ID) || 0;

export const MODERATOR_UMA = Number(process.env.MODERATOR_UMA) || 0;
export const MODERATOR_PACKAGES = Number(process.env.MODERATOR_PACKAGES) || 0;
export const MODERATOR_CHANNELS = Number(process.env.MODERATOR_CHANNELS) || 0;

export const TELEGRAM_MODERATORS = [
  MODERATOR_UMA,
  MODERATOR_PACKAGES,
  MODERATOR_CHANNELS,
];
