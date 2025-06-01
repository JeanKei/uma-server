import { getCounter } from "@/utils/get-counter";
import { parseMetricToNumber } from "@/utils/parse-metric-to-number";
import { CheerioAPI } from "cheerio";

export function parseFiles($: CheerioAPI): number | null {
  const raw = getCounter($, "files");
  return parseMetricToNumber(raw);
}
