import { getCounter } from "@/utils/get-counter";
import { parseMetricToNumber } from "@/utils/parse-metric-to-number";
import { CheerioAPI } from "cheerio";

export function parsePhotos($: CheerioAPI): number | null {
  const raw = getCounter($, "photos");
  return parseMetricToNumber(raw);
}
