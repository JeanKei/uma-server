import { getCounter } from "@/utils/get-counter";
import { CheerioAPI } from "cheerio";

export function parseSubscribers($: CheerioAPI): string | null {
  return getCounter($, "subscribers");
}
