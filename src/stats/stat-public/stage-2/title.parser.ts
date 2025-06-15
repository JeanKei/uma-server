import { CheerioAPI } from "cheerio";

export function parseTitle($: CheerioAPI): string | null {
  return $(".tgme_channel_info_header_title span").text().trim() || null;
}
