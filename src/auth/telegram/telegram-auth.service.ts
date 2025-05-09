import { TUserSocial } from "@/auth/telegram/telegram-auth.types";
import { UserService } from "@/user/user.service";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class TelegramAuthService {
  constructor(private userService: UserService) {}

  async login(req: { user: TUserSocial }) {
    if (!req.user) {
      throw new BadRequestException("User not found by social media");
    }

    return this.userService.findOrCreateSocialUser(req.user);
  }
}
