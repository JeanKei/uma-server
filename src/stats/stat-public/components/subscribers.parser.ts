import { getCounter } from "@/utils/get-counter";
import { parseMetricToNumber } from "@/utils/parse-metric-to-number";
import { CheerioAPI } from "cheerio";

export function parseSubscribers($: CheerioAPI): number | null {
  const raw = getCounter($, "subscribers");
  return parseMetricToNumber(raw);
}
