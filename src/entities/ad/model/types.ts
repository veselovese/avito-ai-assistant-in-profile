export type AdsGetOut = {
  items: Ad[];
  total: number;
};

export type AdUpdateIn = {
  category: 'auto' | 'real_estate' | 'electronics';
  title: string;
  description?: string;
  price: number;
  params: AutoAdParams | RealEstateAdParams | ElectronicsAdParams;
};

export type AutoAdParams = {
  brand?: string;
  model?: string;
  yearOfManufacture?: number;
  transmission?: 'automatic' | 'manual';
  mileage?: number;
  enginePower?: number;
};

export type RealEstateAdParams = {
  type?: 'flat' | 'house' | 'room';
  address?: string;
  area?: number;
  floor?: number;
};

export type ElectronicsAdParams = {
  type?: 'phone' | 'laptop' | 'misc';
  brand?: string;
  model?: string;
  condition?: 'new' | 'used';
  color?: string;
};

export type AutoAd = {
  id: string;
  category: 'auto';
  title: string;
  description?: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
  params: AutoAdParams;
  needsRevision: boolean;
};

export type RealEstateAd = {
  id: string;
  category: 'real_estate';
  title: string;
  description?: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
  params: RealEstateAdParams;
  needsRevision: boolean;
};

export type ElectronicsAd = {
  id: string;
  category: 'electronics';
  title: string;
  description?: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
  params: ElectronicsAdParams;
  needsRevision: boolean;
};

export type Ad = AutoAd | RealEstateAd | ElectronicsAd;