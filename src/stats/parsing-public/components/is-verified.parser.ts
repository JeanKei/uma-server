import { CheerioAPI } from "cheerio";

export function parseIsVerified($: CheerioAPI): boolean {
  return $(".tgme_channel_info_header_labels .verified-icon").length > 0;
}
