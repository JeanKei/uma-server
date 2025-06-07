import { Prisma } from "@prisma/client";

export interface ChannelFilterInput {
  minPrice?: number;
  maxPrice?: number;

  minSubscribers?: number;
  maxSubscribers?: number;

  minPhotos?: number;
  maxPhotos?: number;

  minVideos?: number;
  maxVideos?: number;

  minFiles?: number;
  maxFiles?: number;

  minLinks?: number;
  maxLinks?: number;

  // Новое:
  genderCenter?: number;
  genderDelta?: number;

  minViews?: number;
  maxViews?: number;

  minEr?: number;
  maxEr?: number;

  minCpv?: number;
  maxCpv?: number;

  isVerified?: boolean;
}

export function buildChannelFilter(
  params: ChannelFilterInput
): Prisma.ChannelWhereInput {
  const {
    minPrice,
    maxPrice,
    minSubscribers,
    maxSubscribers,
    minPhotos,
    maxPhotos,
    minVideos,
    maxVideos,
    minFiles,
    maxFiles,
    minLinks,
    maxLinks,
    genderCenter,
    genderDelta,
    minViews,
    maxViews,
    minEr,
    maxEr,
    minCpv,
    maxCpv,
    isVerified,
  } = params;

  const genderFilter =
    genderCenter !== undefined && genderDelta !== undefined
      ? {
          gender: {
            gte: Math.max(0, genderCenter - genderDelta),
            lte: Math.min(100, genderCenter + genderDelta),
          },
        }
      : {};

  return {
    price: {
      ...(minPrice !== undefined && { gte: minPrice }),
      ...(maxPrice !== undefined && { lte: maxPrice }),
    },

    statPublic: {
      ...(isVerified !== undefined && { isVerified }),

      ...(minSubscribers !== undefined || maxSubscribers !== undefined
        ? {
            subscribers: {
              ...(minSubscribers !== undefined && { gte: minSubscribers }),
              ...(maxSubscribers !== undefined && { lte: maxSubscribers }),
            },
          }
        : {}),

      ...(minPhotos !== undefined || maxPhotos !== undefined
        ? {
            photos: {
              ...(minPhotos !== undefined && { gte: minPhotos }),
              ...(maxPhotos !== undefined && { lte: maxPhotos }),
            },
          }
        : {}),

      ...(minVideos !== undefined || maxVideos !== undefined
        ? {
            videos: {
              ...(minVideos !== undefined && { gte: minVideos }),
              ...(maxVideos !== undefined && { lte: maxVideos }),
            },
          }
        : {}),

      ...(minFiles !== undefined || maxFiles !== undefined
        ? {
            files: {
              ...(minFiles !== undefined && { gte: minFiles }),
              ...(maxFiles !== undefined && { lte: maxFiles }),
            },
          }
        : {}),

      ...(minLinks !== undefined || maxLinks !== undefined
        ? {
            links: {
              ...(minLinks !== undefined && { gte: minLinks }),
              ...(maxLinks !== undefined && { lte: maxLinks }),
            },
          }
        : {}),
    },

    statInitial: {
      ...genderFilter,

      ...(minViews !== undefined || maxViews !== undefined
        ? {
            view: {
              ...(minViews !== undefined && { gte: minViews }),
              ...(maxViews !== undefined && { lte: maxViews }),
            },
          }
        : {}),

      ...(minEr !== undefined || maxEr !== undefined
        ? {
            er: {
              ...(minEr !== undefined && { gte: minEr }),
              ...(maxEr !== undefined && { lte: maxEr }),
            },
          }
        : {}),

      ...(minCpv !== undefined || maxCpv !== undefined
        ? {
            cpv: {
              ...(minCpv !== undefined && { gte: minCpv }),
              ...(maxCpv !== undefined && { lte: maxCpv }),
            },
          }
        : {}),
    },
  };
}
