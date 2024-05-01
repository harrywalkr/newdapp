export interface WalletBalanceType {
  balances: Balance[];
  totalBalance: TotalBalance;
}

export interface Balance {
  value: number;
  currency: Currency;
  tokenPrice: any;
  totalReserveInUSD?: string;
  valueInUsd?: number;
}

export interface Currency {
  symbol: string;
  tokenType: string;
  address: string;
}

export interface TotalBalance {
  valueInUsd?: number;
}
