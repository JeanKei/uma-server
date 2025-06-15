import { CheerioAPI } from "cheerio";

export function parseAvatar($: CheerioAPI): string | null {
  return $(".tgme_page_photo_image").attr("src") || null;
}
