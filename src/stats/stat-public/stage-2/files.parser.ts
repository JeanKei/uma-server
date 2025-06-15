import { getCounter } from "@/stats/stat-public/utils/get-counter";
import { parseMetricToNumber } from "@/stats/stat-public/utils/parse-metric-to-number";
import { CheerioAPI } from "cheerio";

export function parseFiles($: CheerioAPI): number | null {
  const raw = getCounter($, "files");
  return parseMetricToNumber(raw);
}
