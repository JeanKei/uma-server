import { Controller, Get } from "@nestjs/common";
import { SitemapService } from "./sitemap.service";

@Controller("sitemap")
export class SitemapController {
  constructor(private readonly sitemapService: SitemapService) {}

  @Get("generate")
  async generateSitemap() {
    await this.sitemapService.generateSitemap();
    return { message: "Sitemap generated successfully" };
  }
}
