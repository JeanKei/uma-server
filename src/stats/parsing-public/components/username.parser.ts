import { CheerioAPI } from "cheerio";

export function parseUsername($: CheerioAPI): string | null {
  return $(".tgme_channel_info_header_username a").text().trim() || null;
}
