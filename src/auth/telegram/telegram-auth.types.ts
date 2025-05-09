import { User } from "@prisma/client";

export interface ITelegramProfile {
  telegramId: string;
  username?: string;
  firstName: string;
  lastName?: string;
  photoUrl?: string;
  authDate: number;
  hash: string;
}

export type TUserSocial = Partial<
  Pick<User, "name" | "avatarPath" | "telegramId">
>;

export type TSocialCallback = (
  error: any,
  user: TUserSocial,
  info?: any
) => void;
