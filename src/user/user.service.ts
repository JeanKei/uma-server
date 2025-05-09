import { TUserSocial } from "@/auth/telegram/telegram-auth.types";
import { Injectable } from "@nestjs/common";
import type { User } from "@prisma/client";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
      },
    });
  }

  async getById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  // async findOrCreateSocialUser(profile: TUserSocial) {
  //   const user = await this.prisma.user.findFirst({
  //     where: { telegramId: profile.telegramId },
  //   });

  //   if (!user) {
  //     return this._createSocialUser(profile);
  //   }

  //   return user;
  // }

  // private async _createSocialUser(profile: TUserSocial): Promise<User> {
  //   return this.prisma.user.create({
  //     data: {
  //       name: profile.name || "",
  //       avatarPath: profile.avatarPath || null,
  //       telegramId: profile.telegramId,
  //     },
  //   });
  // }

  async findOrCreateSocialUser(profile: TUserSocial) {
    console.log(">>> FIND OR CREATE: incoming profile =", profile);

    const user = await this.prisma.user.findFirst({
      where: { telegramId: profile.telegramId },
    });

    if (!user) {
      console.log(">>> No user found. Creating new...");
      return this._createSocialUser(profile);
    }

    console.log(">>> Found existing user:", user);
    return user;
  }

  private async _createSocialUser(profile: TUserSocial): Promise<User> {
    console.log(">>> Creating user with profile:", profile);
    return this.prisma.user.create({
      data: {
        name: profile.name || "",
        avatarPath: profile.avatarPath || null,
        telegramId: profile.telegramId,
      },
    });
  }
}
