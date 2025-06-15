import type { CheerioAPI } from "cheerio";

export function parseDescription($: CheerioAPI): string | null {
  return $(".tgme_channel_info_description").text().trim() || null;
}
