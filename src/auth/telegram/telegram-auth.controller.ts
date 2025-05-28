import { Controller, Get, Query, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import { AuthService } from "@/auth/auth.service";
import { RefreshTokenService } from "@/auth/refresh-token.service";
import { TelegramAuthService } from "@/auth/telegram/telegram-auth.service";
import { validateTelegramAuth } from "@/utils/validate-telegram-auth.util";

@Controller("auth")
export class TelegramAuthController {
  private readonly clientBaseUrl: string;

  constructor(
    private readonly telegramAuthService: TelegramAuthService,
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly configService: ConfigService
  ) {
    this.clientBaseUrl = this.configService.getOrThrow("CLIENT_BASE_URL");
  }

  @Get("telegram/redirect")
  async telegramAuthRedirect(
    @Query() query: Record<string, string>,
    @Res({ passthrough: true }) res: Response
  ) {
    console.log(">>> RAW Telegram Query:", query);

    if (!validateTelegramAuth(query)) {
      throw new Error("Invalid Telegram authentication data");
    }

    const user = await this.telegramAuthService.login({
      user: {
        telegramId: query.id,
        name: query.username || `${query.first_name} ${query.last_name}`,
        avatarPath: query.photo_url || "",
      },
    });

    const { accessToken, refreshToken } =
      await this.authService.buildResponseObject(user);

    this.refreshTokenService.addRefreshTokenToResponse(res, refreshToken);

    const redirectUrl = `${this.clientBaseUrl}${accessToken}`;
    return res.redirect(redirectUrl);
  }
}
