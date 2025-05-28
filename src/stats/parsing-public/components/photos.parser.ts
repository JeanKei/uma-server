import { getCounter } from "@/utils/get-counter";
import { CheerioAPI } from "cheerio";

export function parsePhotos($: CheerioAPI): string | null {
  return getCounter($, "photos");
}
