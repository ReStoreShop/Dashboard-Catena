export interface BaseMetric {
  rank: number;
  storeName: string;
}

export interface PppData extends BaseMetric {
  qty: number;
  revenue: number;
  totalRevenue: number;
  pppPerTotal: number; // %
  attachRate: number; // %
}

export interface ThirdPartyData extends BaseMetric {
  revenue3PP: number;
  totalRevenue: number;
  share: number; // %
}

export interface GlassData extends BaseMetric {
  iphoneSell: number;
  glassSell: number;
  revenue: number;
  attachRate: number; // %
}

export interface PowerData extends BaseMetric {
  iphoneSell: number;
  powerSell: number;
  revenue: number;
  attachRate: number; // %
}

export interface CampusData extends BaseMetric {
  qty: number;
  revenue: number;
  revenuePerInvoice: number;
}

export interface ParsedData {
  ppp: PppData[];
  thirdParty: ThirdPartyData[];
  glass: GlassData[];
  power: PowerData[];
  campus: CampusData[];
  allStores: string[];
}

export type CategoryKey = 'ppp' | 'thirdParty' | 'glass' | 'power' | 'campus';

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  ppp: 'PPP (Protection Plans)',
  thirdParty: 'Terze Parti (3PP)',
  glass: 'Vetri (Glass)',
  power: 'Alim (Power)',
  campus: 'Campus',
};