import {
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
} from "@nestjs/common";
import { FileService } from "./file.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { Auth } from "../auth/decorators/auth.decorator";

@Controller("file")
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Auth()
  @Post("avatar")
  @HttpCode(200)
  @UseInterceptors(FileInterceptor("image"))
  async saveAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Query("channelUrl") channelUrl: string
  ) {
    return this.fileService.saveAvatar(file, channelUrl);
  }
}
