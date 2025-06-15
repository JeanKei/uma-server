import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { SitemapStream, streamToPromise } from "sitemap";
import { createWriteStream } from "fs";
import { mkdir } from "fs/promises";
import { join } from "path";
import { Cron } from "@nestjs/schedule";
import { ChannelService } from "../channel/channel.service";

@Injectable()
export class SitemapService implements OnApplicationBootstrap {
  constructor(private readonly channelService: ChannelService) {
    console.log(
      "SitemapService initialized at",
      new Date().toISOString(),
      "Server timezone:",
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );
  }

  private readonly staticPages = [
    { url: "/", changefreq: "daily", priority: 1.0 },
    { url: "/auth", changefreq: "monthly", priority: 0.5 },
    { url: "/auth/login", changefreq: "monthly", priority: 0.5 },
    { url: "/catalog", changefreq: "daily", priority: 0.9 },
    { url: "/blog", changefreq: "weekly", priority: 0.7 },
    { url: "/uma-bot", changefreq: "monthly", priority: 0.6 },
    { url: "/faq", changefreq: "monthly", priority: 0.6 },
    { url: "/owner", changefreq: "monthly", priority: 0.6 },
    { url: "/contact", changefreq: "monthly", priority: 0.6 },
    { url: "/privacy-policy", changefreq: "yearly", priority: 0.4 },
    { url: "/processing", changefreq: "yearly", priority: 0.4 },
    { url: "/user-agreement", changefreq: "yearly", priority: 0.4 },
    { url: "/oferta", changefreq: "yearly", priority: 0.4 },
    { url: "/payment-and-refund", changefreq: "yearly", priority: 0.4 },
    { url: "/cookies", changefreq: "yearly", priority: 0.4 },
  ];

  private readonly URLS_PER_SITEMAP = 5000;

  async onApplicationBootstrap() {
    // console.log("Generating sitemap on startup at", new Date().toISOString());
    // await this.generateSitemap();
  }

  // @Cron("*/10 * * * * *") // Every 10 seconds for debugging message
  // async debugCron() {
  //   console.log("Debug cron triggered at", new Date().toISOString());
  // }

  // @Cron("0 */5 * * * *") // Every 5 minutes
  @Cron("0 0 10 * * MON")
  async generateSitemap() {
    console.log("Cron sitemap generation started at", new Date().toISOString());
    try {
      const publicDir = join(process.cwd(), "..", "uma-client", "public");
      await mkdir(publicDir, { recursive: true });

      // Static sitemap
      const staticSitemapPath = join(publicDir, "sitemap-static.xml");
      const staticStream = new SitemapStream({
        hostname: "https://umamall.ru",
      });
      for (const page of this.staticPages) {
        staticStream.write({
          url: page.url,
          changefreq: page.changefreq,
          priority: page.priority,
          lastmod: new Date(),
        });
      }
      staticStream.end();
      const staticWriteStream = createWriteStream(staticSitemapPath);
      staticStream.pipe(staticWriteStream);
      await streamToPromise(staticStream);

      // Channel sitemaps
      let page = 1;
      const limit = 100;
      let sitemapCount = 1;
      let urlCount = 0;
      let currentStream: SitemapStream | null = null;
      let currentWriteStream: any = null;
      let currentStreamPromise: Promise<any> | null = null;
      const sitemapFiles: string[] = ["sitemap-static.xml"];

      while (true) {
        const approvedChannels = await this.channelService.getApproved({
          page,
          limit,
          filter: {},
        });

        if (approvedChannels.items.length === 0) {
          if (currentStream && currentWriteStream && currentStreamPromise) {
            currentStream.end();
            await currentStreamPromise;
          }
          break;
        }

        for (const channel of approvedChannels.items) {
          if (!currentStream || urlCount % this.URLS_PER_SITEMAP === 0) {
            if (currentStream && currentWriteStream && currentStreamPromise) {
              currentStream.end();
              await currentStreamPromise;
            }

            const sitemapPath = join(
              publicDir,
              `sitemap-channels-${sitemapCount}.xml`
            );
            currentWriteStream = createWriteStream(sitemapPath);
            currentStream = new SitemapStream({
              hostname: "https://umamall.ru",
            });
            currentStream.pipe(currentWriteStream);
            currentStreamPromise = streamToPromise(currentStream);
            sitemapFiles.push(`sitemap-channels-${sitemapCount}.xml`);
            sitemapCount++;
          }

          currentStream.write({
            url: `/catalog/${encodeURIComponent(channel.url)}`,
            changefreq: "weekly",
            priority: 0.8,
            lastmod: channel.updatedAt || new Date(),
          });
          urlCount++;
        }

        page++;
      }

      // Sitemap index
      const indexStream = new SitemapStream({ hostname: "https://umamall.ru" });
      for (const file of sitemapFiles) {
        indexStream.write({
          url: `https://umamall.ru/${file}`,
          lastmod: new Date(),
        });
      }
      indexStream.end();
      const indexPath = join(publicDir, "sitemap.xml");
      const indexWriteStream = createWriteStream(indexPath);
      indexStream.pipe(indexWriteStream);
      await streamToPromise(indexStream);

      console.log(
        "Sitemap generation completed at",
        new Date().toISOString(),
        "Total URLs:",
        urlCount
      );
    } catch (error) {
      console.error(
        "Sitemap generation failed at",
        new Date().toISOString(),
        error
      );
      throw error;
    }
  }
}
