import { CheerioAPI } from "cheerio";
import { parseMetricToNumber } from "../utils/parse-metric-to-number";

export interface PostData {
  dataPost: string;
  messageUrl: string;
  messageText: string | null;
  views: number | null;
  datetime: Date | null;
  photos: string[];
  videos: string[];
}

export function parsePosts($: CheerioAPI): PostData[] {
  const posts: PostData[] = [];
  const messageWraps = $(".tgme_widget_message_wrap");

  messageWraps.each((_, el) => {
    const $el = $(el);
    const dataPost = $el.find(".tgme_widget_message").attr("data-post");
    if (!dataPost) return;

    const messageText =
      $el.find(".tgme_widget_message_text").text().trim() || null;
    const viewsRaw = $el.find(".tgme_widget_message_views").text().trim();
    const views = viewsRaw ? parseMetricToNumber(viewsRaw) : null;
    const datetimeRaw = $el.find("time").attr("datetime");
    const datetime = datetimeRaw ? new Date(datetimeRaw) : null;

    const photos: string[] = [];
    $el.find(".tgme_widget_message_photo_wrap").each((_, photo) => {
      const style = $(photo).attr("style");
      const url = style?.match(/url\('(.+?)'\)/)?.[1];
      if (url) photos.push(url);
    });

    const videos: string[] = [];
    $el.find(".tgme_widget_message_video").each((_, video) => {
      const src = $(video).attr("src");
      if (src) videos.push(src);
    });

    posts.push({
      dataPost,
      messageUrl: `https://t.me/${dataPost}`,
      messageText,
      views,
      datetime,
      photos,
      videos,
    });
  });

  return posts;
}
