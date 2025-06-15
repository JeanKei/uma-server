import { getCounter } from "@/stats/stat-public/utils/get-counter";
import { parseMetricToNumber } from "@/stats/stat-public/utils/parse-metric-to-number";
import { CheerioAPI } from "cheerio";

export function parsePhotos($: CheerioAPI): number | null {
  const raw = getCounter($, "photos");
  return parseMetricToNumber(raw);
}
