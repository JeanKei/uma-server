import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Patch,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ArticleService } from "./article.service";
import { ArticleDto } from "./dto/article.dto";
import { Auth } from "src/auth/decorators/auth.decorator";
import { CurrentUser } from "@/auth/decorators/user.decorator";

@Controller("article")
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async getAll() {
    return this.articleService.getAll();
  }

  @Get("slug/:slug")
  async getBySlug(@Param("slug") slug: string) {
    return this.articleService.getBySlug(slug);
  }

  @Auth()
  @Get("by-id/:id")
  async getById(@Param("id") id: string) {
    return this.articleService.getById(id);
  }

  @Auth()
  @Post()
  @HttpCode(200)
  async create(@Body() dto: ArticleDto, @CurrentUser("id") userId: string) {
    return await this.articleService.create(dto, userId);
  }

  @Auth()
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: ArticleDto) {
    return this.articleService.update(id, dto);
  }

  @Auth()
  @HttpCode(200)
  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.articleService.delete(id);
  }
}
