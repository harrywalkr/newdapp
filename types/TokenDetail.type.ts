export interface ITokenDetail {
  tokenName: string;
  contractAddress: string;
  count: number;
  latestDate: string;
  countRank: number;
  timeRank: number;
  score: number;
  averageRank: number;
  id: string;
  type: string;
  attributes: Attributes;
  relationships: Relationships;
}

export interface Attributes {
  [key: string]: any;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  total_supply: string;
  price_usd: string;
  fdv_usd: string;
  total_reserve_in_usd: string;
  volume_usd: VolumeUsd;
  market_cap_usd?: string;
}

export interface VolumeUsd {
  h24: string;
}

export interface Relationships {
  top_pools: TopPools;
}

export interface TopPools {
  data: Daum[];
}

export interface Daum {
  id: string;
  type: string;
}
