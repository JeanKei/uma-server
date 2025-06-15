import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import axios from "axios";

export async function downloadAndSaveAvatar(
  avatarUrl: string,
  channelUrl: string
): Promise<string | null> {
  try {
    const username = channelUrl.replace("https://t.me/", "").trim();
    const folder = join(process.cwd(), "uploads", "channels-img");
    const filename = `${username}.jpg`;
    const fullPath = join(folder, filename);

    // Создать папку, если нет
    if (!existsSync(folder)) mkdirSync(folder, { recursive: true });

    const response = await axios.get(avatarUrl, {
      responseType: "arraybuffer",
    });
    writeFileSync(fullPath, response.data);

    return `public-img/${filename}`; // путь, который будет использовать клиент
  } catch (err) {
    console.warn(`Не удалось сохранить аватарку ${avatarUrl}:`, err.message);
    return null;
  }
}
