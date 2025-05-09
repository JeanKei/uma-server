import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Role, type User } from "@prisma/client";
import { omit } from "lodash";
import { UserService } from "@/user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private userService: UserService
  ) {}

  private readonly TOKEN_EXPIRATION_ACCESS = "7d";
  private readonly TOKEN_EXPIRATION_REFRESH = "7d";

  async getNewTokens(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken);
    if (!result) {
      throw new UnauthorizedException("Invalid refresh token");
    }
    const user = await this.userService.getById(result.id);
    return this.buildResponseObject(user);
  }

  async buildResponseObject(user: User) {
    const tokens = await this.issueTokens(user.id, user.rights || []);
    return { user: this.omitPassword(user), ...tokens };
  }

  private async issueTokens(userId: string, rights: Role[]) {
    const payload = { id: userId, rights };
    const accessToken = this.jwt.sign(payload, {
      expiresIn: this.TOKEN_EXPIRATION_ACCESS,
    });
    const refreshToken = this.jwt.sign(payload, {
      expiresIn: this.TOKEN_EXPIRATION_REFRESH,
    });
    return { accessToken, refreshToken };
  }

  private omitPassword(user: User) {
    return omit(user, ["password"]);
  }
}
