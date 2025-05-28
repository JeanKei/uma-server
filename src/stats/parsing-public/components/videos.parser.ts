import { getCounter } from "@/utils/get-counter";
import { CheerioAPI } from "cheerio";

export function parseVideos($: CheerioAPI): string | null {
  return getCounter($, "videos");
}
