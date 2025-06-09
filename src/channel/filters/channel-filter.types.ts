export interface ChannelFilterInput {
  minSubscribers?: number;
  maxSubscribers?: number;
  minView?: number;
  maxView?: number;
  minEr?: number;
  maxEr?: number;
  minCpv?: number;
  maxCpv?: number;
}

export type SortField = "subscribers" | "view" | "er" | "cpv";
export type SortOrder = "asc" | "desc";

export interface ChannelQueryInput {
  page?: number;
  limit?: number;
  filter?: ChannelFilterInput;
  sortBy?: SortField;
  sortOrder?: SortOrder;
}
