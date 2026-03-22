export type Ad = {
  id: string;
  category: 'auto' | 'real_estate' | 'electronics';
  title: string;
  description?: string;
  price: number;
  createdAt?: string;
  params: AutoAdParams | RealEstateAdParams | ElectronicsAdParams;
  needsRevision: boolean;
};

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