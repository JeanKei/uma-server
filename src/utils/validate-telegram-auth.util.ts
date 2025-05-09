import { ConfigService } from "@nestjs/config";
import * as crypto from "crypto";

export function validateTelegramAuth(query: Record<string, string>): boolean {
  const configService = new ConfigService();
  const token = configService.get<string>("TELEGRAM_BOT_TOKEN");

  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is not defined");
  }

  const { hash, ...authData } = query;

  const dataCheckString = Object.entries(authData)
    .filter(([_, value]) => typeof value !== "undefined")
    .map(([key, value]) => `${key}=${value}`)
    .sort() // сортировка ключей по алфавиту
    .join("\n");

  const secretKey = crypto.createHash("sha256").update(token).digest();

  const computedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  return computedHash === hash;
}
