export type ILatestToken = LatestTokenType[];

export interface LatestTokenType {
  tokenName: string;
  contractAddress: string;
  count: number;
  latestDate: string;
  rank: number;
}
