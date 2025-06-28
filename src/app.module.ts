import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { TelegramModule } from "./telegram/telegram.module";
import { ChannelModule } from "./channel/channel.module";
import { ArticleModule } from "./article/article.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { ChannelReviewsModule } from "./reviews/channel-reviews.module";
import { SitemapModule } from "./sitemap/sitemap.module";
import { ScheduleModule } from "@nestjs/schedule";
import { StatPublicModule } from "./stats/stat-public/stat-public.module";
import { ChannelPostsModule } from "./posts/channel-posts.module";
import { OrderUmaBotModule } from "./orders/order-uma-bot/order-uma-bot.module";
import { OrderPackagesModule } from "./orders/order-packages/order-packages.module";

@Module({
  imports: [
    ScheduleModule.forRoot(),
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
    SitemapModule,
    ChannelPostsModule,
    OrderUmaBotModule,
    OrderPackagesModule,
  ],
})
export class AppModule {}
