export interface ChannelFilterInput {
  minSubscribers?: number;
  maxSubscribers?: number;
  minView?: number;
  maxView?: number;
  minPrice?: number;
  maxPrice?: number;
  minEr?: number;
  maxEr?: number;
  minCpv?: number;
  maxCpv?: number;
  searchQuery?: string;
  categories?: string[];
  isVerified?: boolean;
  gender?: number;
}

export type SortField = "subscribers" | "view" | "er" | "cpv" | "price";
export type SortOrder = "asc" | "desc";

export interface ChannelQueryInput {
  page?: number;
  limit?: number;
  filter?: ChannelFilterInput;
  sortBy?: SortField;
  sortOrder?: SortOrder;
}
