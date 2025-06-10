import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { ChannelReviewsDto } from "./dto/channel-reviews.dto";

@Injectable()
export class ChannelReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return this.prisma.channelReviews.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        channel: true,
      },
    });
  }

  async getById(id: string) {
    const review = await this.prisma.channelReviews.findUnique({
      where: { id },
      include: {
        channel: true,
      },
    });

    if (!review) throw new NotFoundException("Отзыв не найден");
    return review;
  }

  async getByChannelId(channelId: string) {
    return this.prisma.channelReviews.findMany({
      where: { channelId },
      orderBy: { createdAt: "desc" },
      include: {
        channel: true,
      },
    });
  }

  async create(dto: ChannelReviewsDto) {
    // Check if channel exists
    const channel = await this.prisma.channel.findUnique({
      where: { id: dto.channelId },
    });
    if (!channel) throw new NotFoundException("Канал не найден");

    const createdReview = await this.prisma.channelReviews.create({
      data: {
        name: dto.name,
        description: dto.description,
        review: dto.review,
        rating: dto.rating,
        channelId: dto.channelId,
      },
    });

    return createdReview;
  }

  async update(id: string, dto: ChannelReviewsDto) {
    // Check if review exists
    await this.getById(id);

    // Check if channel exists
    const channel = await this.prisma.channel.findUnique({
      where: { id: dto.channelId },
    });
    if (!channel) throw new NotFoundException("Канал не найден");

    return this.prisma.channelReviews.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        review: dto.review,
        rating: dto.rating,
        channelId: dto.channelId,
      },
    });
  }

  async delete(id: string) {
    await this.getById(id);
    return this.prisma.channelReviews.delete({
      where: { id },
    });
  }
}
