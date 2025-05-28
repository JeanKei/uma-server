import { getCounter } from "@/utils/get-counter";
import { CheerioAPI } from "cheerio";

export function parseLinks($: CheerioAPI): string | null {
  return getCounter($, "links");
}
