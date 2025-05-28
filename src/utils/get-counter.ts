import { CheerioAPI } from "cheerio";

export function getCounter($: CheerioAPI, type: string): string | null {
  const el = $(".tgme_channel_info_counter")
    .filter((_, el) => $(el).text().toLowerCase().includes(type.toLowerCase()))
    .find(".counter_value")
    .text()
    .trim();

  return el || null;
}
