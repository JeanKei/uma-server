import { Injectable } from "@nestjs/common";
import { path } from "app-root-path";
import { ensureDir, writeFile } from "fs-extra";
import * as sharp from "sharp";
import { OrderFileResponse } from "./order-file.interface";

@Injectable()
export class OrderFileService {
  async saveFile(file: Express.Multer.File): Promise<OrderFileResponse> {
    try {
      const uploadedFolder = `${path}/uploads/order-img`;
      await ensureDir(uploadedFolder);

      const fileExtension = file.originalname.split(".").pop() || "jpg";

      const uniqueId = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      const fileName = `${uniqueId}.${fileExtension}`;

      const resizedBuffer = await sharp(file.buffer)
        .resize(500, 500, { fit: "cover" })
        .toBuffer();

      await writeFile(`${uploadedFolder}/${fileName}`, resizedBuffer);

      return {
        url: `/order-img/${fileName}`,
        name: fileName,
      };
    } catch (error) {
      console.error("Error in FileService:", error.message);
      throw new Error("File processing error");
    }
  }
}
