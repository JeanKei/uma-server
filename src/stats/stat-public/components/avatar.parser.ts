import type { CheerioAPI } from "cheerio";

export function parseAvatar($: CheerioAPI): string | null {
  const src = $(".tgme_page_photo_image img").attr("src");
  return src?.trim() || null;
}
