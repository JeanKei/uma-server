import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { TelegramModule } from "./telegram/telegram.module";
import { ChannelModule } from "./channel/channel.module";
import { ArticleModule } from "./article/article.module";
import { StatPublicModule } from "./stats/stat-public/stat-public.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { ChannelReviewsModule } from "./reviews/channel-reviews.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "uploads"),
      serveRoot: "/uploads",
    }),
    AuthModule,
    UserModule,
    ChannelModule,
    TelegramModule,
    ArticleModule,
    StatPublicModule,
    ChannelReviewsModule,
  ],
})
export class AppModule {}
