// backend/src/sitemap/sitemap.module.ts
import { Module } from "@nestjs/common";
import { SitemapService } from "./sitemap.service";
import { SitemapController } from "./sitemap.controller";
import { ChannelModule } from "../channel/channel.module";

@Module({
  imports: [ChannelModule],
  providers: [SitemapService],
  controllers: [SitemapController],
})
export class SitemapModule {}
