import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { TelegramModule } from "./telegram/telegram.module";
import { ChannelModule } from "./channel/channel.module";
import { ArticleModule } from "./article/article.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    ChannelModule,
    TelegramModule,
    ArticleModule,
  ],
})
export class AppModule {}
