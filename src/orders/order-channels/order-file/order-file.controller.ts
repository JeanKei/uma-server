import {
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Auth } from "@/auth/decorators/auth.decorator";
import { OrderFileService } from "./order-file.service";

@Controller("order-file")
export class OrderFileController {
  constructor(private readonly orderFileService: OrderFileService) {}

  @Auth()
  @Post("img")
  @HttpCode(200)
  @UseInterceptors(FileInterceptor("image"))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error("No file uploaded");
    }
    return this.orderFileService.saveFile(file);
  }
}
