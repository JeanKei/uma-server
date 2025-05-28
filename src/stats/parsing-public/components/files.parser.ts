import { getCounter } from "@/utils/get-counter";
import { CheerioAPI } from "cheerio";

export function parseFiles($: CheerioAPI): string | null {
  return getCounter($, "files");
}
