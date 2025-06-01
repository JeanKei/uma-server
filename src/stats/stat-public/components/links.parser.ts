import { getCounter } from "@/utils/get-counter";
import { parseMetricToNumber } from "@/utils/parse-metric-to-number";
import { CheerioAPI } from "cheerio";

export function parseLinks($: CheerioAPI): number | null {
  const raw = getCounter($, "links");
  return parseMetricToNumber(raw);
}
