import { CheerioAPI } from "cheerio";
import { parseMetricToNumber } from "../utils/parse-metric-to-number";

export function parseSubscribers($: CheerioAPI): number | null {
  const raw = $(".tgme_page_extra")
    .text()
    .match(/([\d\s,]+) subscribers/i)?.[1];
  return raw ? parseMetricToNumber(raw.replace(/[\s,]/g, "")) : null;
}
