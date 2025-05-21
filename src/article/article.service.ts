import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { ArticleDto } from "./dto/article.dto";

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return this.prisma.article.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async getById(id: string) {
    const article = await this.prisma.article.findUnique({
      where: { id },
    });

    if (!article) throw new NotFoundException("Канал не найден");
    return article;
  }

  async getBySlug(slug: string) {
    const article = await this.prisma.article.findUnique({
      where: { slug },
    });

    if (!article) throw new NotFoundException("Статья не найдена");
    return article;
  }

  async create(dto: ArticleDto, userId: string) {
    const createdArticle = await this.prisma.article.create({
      data: {
        title: dto.title,
        content: dto.content,
        slug: dto.slug,
        userId,
      },
    });

    return createdArticle;
  }

  async update(id: string, dto: ArticleDto) {
    await this.getById(id);

    return this.prisma.article.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    return this.prisma.article.delete({
      where: { id },
    });
  }
}
