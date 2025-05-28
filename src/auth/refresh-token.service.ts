import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Response } from "express";

@Injectable()
export class RefreshTokenService {
  readonly EXPIRE_DAY_REFRESH_TOKEN = 1;
  readonly REFRESH_TOKEN_NAME = "refreshToken";
  private readonly domain: string;
  private readonly secure: boolean;
  private readonly sameSite: boolean | "lax" | "strict" | "none";

  constructor(private configService: ConfigService) {
    this.domain =
      this.configService.get<string>("COOKIE_DOMAIN") || "localhost";
    this.secure = this.configService.get<string>("COOKIE_SECURE") === "true";
    this.sameSite = this.configService.get<string>("COOKIE_SAMESITE") as
      | "lax"
      | "strict"
      | "none";
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: this.domain,
      expires: expiresIn,
      secure: this.secure,
      sameSite: this.sameSite,
    });
  }

  removeRefreshTokenFromResponse(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, "", {
      httpOnly: true,
      domain: this.domain,
      expires: new Date(0),
      secure: this.secure,
      sameSite: this.sameSite,
    });
  }
}
