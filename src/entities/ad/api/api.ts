import { apiClient } from '../../../shared/api/axios';
import type { AdsGetOut, Ad, AdUpdateIn } from '../model/types';;

export type GetAdsParams = {
  q?: string;
  limit?: number;
  skip?: number;
  needsRevision?: boolean;
  categories?: string;
  sortColumn?: 'title' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
};

export const getAds = async (params: GetAdsParams): Promise<AdsGetOut> => {
  const { data } = await apiClient.get('/items', { params });
  return data;
};

export const getAdById = async (id: string): Promise<Ad> => {
  const { data } = await apiClient.get(`/items/${id}`);
  return data;
};

export const updateAdById = async (id: string, payload: AdUpdateIn) => {
  const { data } = await apiClient.put(`/items/${id}`, payload);
  return data;
};