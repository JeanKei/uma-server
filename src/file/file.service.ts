// import { Injectable } from "@nestjs/common";
// import { path } from "app-root-path";
// import { ensureDir, writeFile } from "fs-extra";
// import * as sharp from "sharp";
// import { FileResponse } from "./file.interface";

// @Injectable()
// export class FileService {
//   async saveAvatar(
//     file: Express.Multer.File,
//     channelUrl: string
//   ): Promise<FileResponse> {
//     try {
//       const uploadedFolder = `${path}/uploads/channels-img`;
//       await ensureDir(uploadedFolder);

//       const sanitizedUrl = channelUrl.replace(/[^a-zA-Z0-9]/g, "_");
//       const fileExtension = file.originalname.split(".").pop() || "jpg";
//       const fileName = `${sanitizedUrl}.${fileExtension}`;

//       const resizedBuffer = await sharp(file.buffer)
//         .resize(500, 500, { fit: "cover" })
//         .toBuffer();

//       await writeFile(`${uploadedFolder}/${fileName}`, resizedBuffer);

//       return {
//         url: `/uploads/channels-img/${fileName}`,
//         name: fileName,
//       };
//     } catch (error) {
//       console.error("Error in FileService:", error.message);
//       throw new Error("File processing error");
//     }
//   }
// }

import { Injectable } from "@nestjs/common";
import { path } from "app-root-path";
import { ensureDir, writeFile } from "fs-extra";
import * as sharp from "sharp";
import { FileResponse } from "./file.interface";

@Injectable()
export class FileService {
  async saveAvatar(
    file: Express.Multer.File,
    channelUrl: string
  ): Promise<FileResponse> {
    try {
      const uploadedFolder = `${path}/uploads/channels-img`;
      await ensureDir(uploadedFolder);

      const sanitizedUrl = channelUrl.replace(/[^a-zA-Z0-9]/g, "_");
      const fileExtension = file.originalname.split(".").pop() || "jpg";
      const fileName = `${sanitizedUrl}.${fileExtension}`;

      const resizedBuffer = await sharp(file.buffer)
        .resize(500, 500, { fit: "cover" })
        .toBuffer();

      await writeFile(`${uploadedFolder}/${fileName}`, resizedBuffer);

      return {
        url: `/channels-img/${fileName}`,
        name: fileName,
      };
    } catch (error) {
      console.error("Error in FileService:", error.message);
      throw new Error("File processing error");
    }
  }
}
