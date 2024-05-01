export interface WalletSummaryType {
  highestProfit: [number, string, string];
  lowestProfit: [number, string, string];
  highestLoss: [number, string, string];
  lowestLoss: [number, string, string];
  totalProfit: number;
  totalLoss: number;
  netProfit: number;
  totalProfits: TotalProfits;
  totalBuySellTimes: TotalBuySellTimes;
  totalBuyAmounts: TotalBuyAmounts;
  totalSellAmounts: TotalSellAmounts;
  totalBuyTimes: TotalBuyTimes;
  totalSellTimes: TotalSellTimes;
  percentageWeek: PercentageWeek;
  percentageMonth: PercentageMonth;
  percentageYear: PercentageYear;
  averageHoldingTimes: AverageHoldingTimes;
  totalProfitsPerToken: TotalProfitsPerToken;
  overallAverageHoldingTimeAndProfit: OverallAverageHoldingTimeAndProfit;
  mostProfitableTokenWithShortestOpeningTime: MostProfitableTokenWithShortestOpeningTime;
  swapTimeResults: SwapTimeResults;
  avgHoldingTime: string;
  avgProfit: number;
  avgBuyAmount: number;
  holdingTimeLabel: string;
  profitLabel: string;
  buyAmountLabel: string;
  holdingTimeScore: number;
  profitScore: number;
  sizeScore: number;
  totalScore: number;
  winRate: string;
  totalProfitableSwaps: number;
  totalNegativeSwaps: number;
  totalPositions: number;
  newestBoughtToken: NewestBoughtToken;
  newestSoldToken: NewestSoldToken;
  formattedNewestBoughtToken: FormattedNewestBoughtToken;
  formattedNewestSoldToken: FormattedNewestSoldToken;
  transactionMetrics: TransactionMetrics;
  percentageProfitsPerToken: PercentageProfitsPerToken;
  totalWithdraw: number;
  totalDeposit: number;
  sendTokens: SendTokens;
  sentHistory: SentHistory[];
  WithdrawDuration: string;
  receiveTokens: ReceiveTokens;
  receiveHistory: ReceiveHistory[];
  DepositDuration: string;
  totalNotClosedBalance: number;
  totalPartiallyClosed: number;
  CurrentBalance: number;
  totalNumofPartiallyClosed: TotalNumofPartiallyClosed;
  totalNumofFullyOpenedData: TotalNumofFullyOpenedData;
  totalNumTransactionsData: TotalNumTransactionsData;
  Interaction: Interaction;
  SwapTime: string[];
  BotActivity: string;
  details: 'string';
  HotTokenHolders: HotTokenHolder[];
  Top20HotTokenHolders: any[];
  TotalFee: number;
  DextraderScore: number;
  averagePercentageyearly: number;
  labelTrader: 'Day Trader' | 'Night Trader';
  timestamp: number;
}

export interface TotalProfits {
  month: Month;
  week: Week;
  year: Year;
}

export interface Month {
  "March 2023": number;
  "July 2023": number;
  "October 2023": number;
  "February 2023": number;
  "January 2023": number;
}

export interface Week {
  "March 2023 week 1": number;
  "July 2023 week 4": number;
  "October 2023 week 1": number;
  "July 2023 week 1": number;
  "February 2023 week 1": number;
  "March 2023 week 2": number;
  "January 2023 week 1": number;
}

export interface Year {
  "2023": number;
}

export interface TotalBuySellTimes {
  month: Month2;
  week: Week2;
  year: Year2;
}

export interface Month2 {
  "March 2023": number;
  "July 2023": number;
  "October 2023": number;
  "February 2023": number;
  "January 2023": number;
}

export interface Week2 {
  "March 2023 week 1": number;
  "July 2023 week 4": number;
  "October 2023 week 1": number;
  "July 2023 week 1": number;
  "February 2023 week 1": number;
  "March 2023 week 2": number;
  "January 2023 week 1": number;
}

export interface Year2 {
  "2023": number;
}

export interface TotalBuyAmounts {
  month: Month3;
  week: Week3;
  year: Year3;
}

export interface Month3 {
  "March 2023": number;
  "July 2023": number;
  "October 2023": number;
  "February 2023": number;
  "January 2023": number;
}

export interface Week3 {
  "March 2023 week 1": number;
  "July 2023 week 4": number;
  "October 2023 week 1": number;
  "July 2023 week 1": number;
  "February 2023 week 1": number;
  "March 2023 week 2": number;
  "January 2023 week 1": number;
}

export interface Year3 {
  "2023": number;
}

export interface TotalSellAmounts {
  month: Month4;
  week: Week4;
  year: Year4;
}

export interface Month4 {
  "March 2023": number;
  "July 2023": number;
  "October 2023": number;
  "February 2023": number;
  "January 2023": number;
}

export interface Week4 {
  "March 2023 week 1": number;
  "July 2023 week 4": number;
  "October 2023 week 1": number;
  "July 2023 week 1": number;
  "February 2023 week 1": number;
  "March 2023 week 2": number;
  "January 2023 week 1": number;
}

export interface Year4 {
  "2023": number;
}

export interface TotalBuyTimes {
  month: Month5;
  week: Week5;
  year: Year5;
}

export interface Month5 {
  "March 2023": number;
  "July 2023": number;
  "October 2023": number;
  "February 2023": number;
  "January 2023": number;
}

export interface Week5 {
  "March 2023 week 1": number;
  "July 2023 week 4": number;
  "October 2023 week 1": number;
  "July 2023 week 1": number;
  "February 2023 week 1": number;
  "March 2023 week 2": number;
  "January 2023 week 1": number;
}

export interface Year5 {
  "2023": number;
}

export interface TotalSellTimes {
  month: Month6;
  week: Week6;
  year: Year6;
}

export interface Month6 {
  "March 2023": number;
  "July 2023": number;
  "October 2023": number;
  "February 2023": number;
  "January 2023": number;
}

export interface Week6 {
  "March 2023 week 1": number;
  "July 2023 week 4": number;
  "October 2023 week 1": number;
  "July 2023 week 1": number;
  "February 2023 week 1": number;
  "March 2023 week 2": number;
  "January 2023 week 1": number;
}

export interface Year6 {
  "2023": number;
}

export interface PercentageWeek {
  "March 2023 week 1": number;
  "July 2023 week 4": number;
  "October 2023 week 1": number;
  "July 2023 week 1": number;
  "February 2023 week 1": number;
  "March 2023 week 2": number;
  "January 2023 week 1": number;
}

export interface PercentageMonth {
  "March 2023": number;
  "July 2023": number;
  "October 2023": number;
  "February 2023": number;
  "January 2023": number;
}

export interface PercentageYear {
  "2023": number;
}

export interface AverageHoldingTimes {
  "BUNNI-LP": BunniLp;
  X: X;
  "ethx-f": EthxF;
  bendWETH: BendWeth;
  ipUSDC: IpUsdc;
  aEthUSDT: AEthUsdt;
  ipUSDT: IpUsdt;
  "Av2-WETH-LP": Av2WethLp;
}

export interface BunniLp {
  averageHoldingTime: string;
  currencyAddress: string;
}

export interface X {
  averageHoldingTime: string;
  currencyAddress: string;
}

export interface EthxF {
  averageHoldingTime: string;
  currencyAddress: string;
}

export interface BendWeth {
  averageHoldingTime: string;
  currencyAddress: string;
}

export interface IpUsdc {
  averageHoldingTime: string;
  currencyAddress: string;
}

export interface AEthUsdt {
  averageHoldingTime: string;
  currencyAddress: string;
}

export interface IpUsdt {
  averageHoldingTime: string;
  currencyAddress: string;
}

export interface Av2WethLp {
  averageHoldingTime: string;
  currencyAddress: string;
}

export interface TotalProfitsPerToken {
  "BUNNI-LP": BunniLp2;
  X: X2;
  "ethx-f": EthxF2;
  bendWETH: BendWeth2;
  ipUSDC: IpUsdc2;
  aEthUSDT: AEthUsdt2;
  ipUSDT: IpUsdt2;
  "Av2-WETH-LP": Av2WethLp2;
}

export interface BunniLp2 {
  profit: number;
  currencyAddress: string;
  buyAmount: number;
}

export interface X2 {
  profit: number;
  currencyAddress: string;
  buyAmount: string;
}

export interface EthxF2 {
  profit: number;
  currencyAddress: string;
  buyAmount: number;
}

export interface BendWeth2 {
  profit: number;
  currencyAddress: string;
  buyAmount: number;
}

export interface IpUsdc2 {
  profit: number;
  currencyAddress: string;
  buyAmount: number;
}

export interface AEthUsdt2 {
  profit: number;
  currencyAddress: string;
  buyAmount: number;
}

export interface IpUsdt2 {
  profit: number;
  currencyAddress: string;
  buyAmount: number;
}

export interface Av2WethLp2 {
  profit: number;
  currencyAddress: string;
  buyAmount: number;
}

export interface OverallAverageHoldingTimeAndProfit {
  HoldingTime: string;
  Profit: number;
  BuyAmount: number;
}

export interface MostProfitableTokenWithShortestOpeningTime {
  tokenName: string;
  profit: number;
  averageHoldingTime: string;
  currencyAddress: string;
}

export interface SwapTimeResults {
  longestTime: string;
  shortestTime: string;
  longestTokenInfo: LongestTokenInfo;
  shortestTokenInfo: ShortestTokenInfo;
}

export interface LongestTokenInfo {
  tokenName: string;
  averageHoldingTime: string;
  currencyAddress: string;
  profit: number;
}

export interface ShortestTokenInfo {
  tokenName: string;
  averageHoldingTime: string;
  currencyAddress: string;
  profit: number;
}

export interface NewestBoughtToken {
  tokenName: string;
  currencyAddress: string;
  buyTime: string;
  profit: number;
}

export interface NewestSoldToken {
  tokenName: string;
  currencyAddress: string;
  sellTime: string;
}

export interface FormattedNewestBoughtToken {
  tokenName: string;
  currencyAddress: string;
  buyTime: string;
  profit: number;
}

export interface FormattedNewestSoldToken {
  tokenName: string;
  currencyAddress: string;
  sellTime: string;
}

export interface TransactionMetrics {
  totalTransactions: number;
  latestTransaction: LatestTransaction;
  firstTransaction: FirstTransaction;
  uniqueDaysActive: number;
  walletAge: number;
}

export interface LatestTransaction {
  time: string;
  details: Details;
}

export interface Details {
  type: string;
  sender: Sender;
  receiver: Receiver;
  amount: number;
  amount_usd: number;
  currency: Currency;
  transaction: Transaction;
  block: Block;
}

export interface Sender {
  address: string;
}

export interface Receiver {
  address: string;
}

export interface Currency {
  symbol: string;
  address: string;
}

export interface Transaction {
  hash: string;
  gasValue: number;
  gasPrice: number;
}

export interface Block {
  height: number;
  timestamp: Timestamp;
}

export interface Timestamp {
  time: string;
}

export interface FirstTransaction {
  time: string;
  details: Details2;
}

export interface Details2 {
  type: string;
  sender: Sender2;
  receiver: Receiver2;
  amount: number;
  amount_usd: number;
  currency: Currency2;
  transaction: Transaction2;
  block: Block2;
}

export interface Sender2 {
  address: string;
}

export interface Receiver2 {
  address: string;
}

export interface Currency2 {
  symbol: string;
  address: string;
}

export interface Transaction2 {
  hash: string;
  gasValue: number;
  gasPrice: number;
}

export interface Block2 {
  height: number;
  timestamp: Timestamp2;
}

export interface Timestamp2 {
  time: string;
}

export interface PercentageProfitsPerToken {
  "BUNNI-LP": BunniLp3;
  X: X3;
  "ethx-f": EthxF3;
  bendWETH: BendWeth3;
  ipUSDC: IpUsdc3;
  aEthUSDT: AEthUsdt3;
  ipUSDT: IpUsdt3;
  "Av2-WETH-LP": Av2WethLp3;
}

export interface BunniLp3 {
  profit: number;
  currencyAddress: string;
}

export interface X3 {
  profit: number;
  currencyAddress: string;
}

export interface EthxF3 {
  profit: number;
  currencyAddress: string;
}

export interface BendWeth3 {
  profit: number;
  currencyAddress: string;
}

export interface IpUsdc3 {
  profit: number;
  currencyAddress: string;
}

export interface AEthUsdt3 {
  profit: number;
  currencyAddress: string;
}

export interface IpUsdt3 {
  profit: number;
  currencyAddress: string;
}

export interface Av2WethLp3 {
  profit: number;
  currencyAddress: string;
}

export interface SendTokens {
  totalSendTransactions: number;
}

export interface SentHistory {
  amount: number;
  amount_usd: number;
  time: string;
  interval?: string;
}

export interface ReceiveTokens {
  totalReceiveTransactions: number;
}

export interface ReceiveHistory {
  amount: number;
  amount_usd: number;
  time: string;
  interval?: string;
}

export interface TotalNumofPartiallyClosed {
  totalnumPartiallyClosedData: number;
}

export interface TotalNumofFullyOpenedData {
  totalnumPartiallyClosedData: number;
}

export interface TotalNumTransactionsData {
  totalTransactions: number;
}

export interface Interaction {
  mostRepeatedSendAddress: MostRepeatedSendAddress;
  mostRepeatedReceiveAddress: MostRepeatedReceiveAddress;
  mostIncludedAddress: MostIncludedAddress;
}

export interface MostRepeatedSendAddress {
  address: string;
  count: number;
}

export interface MostRepeatedReceiveAddress {
  address: string;
  count: number;
}

export interface MostIncludedAddress {
  address: string;
  count: number;
}

export interface HotTokenHolder {
  tokenName: string;
  balanceType: string;
  "Buy Amount": number;
  "Buy Amount (USD)": number;
  "Sell Amount": number;
  "Sell Amount (USD)": number;
  Profit: number;
  "Entry Price": number;
  "Exit Price": any;
  "Buy Times": Time[];
  "Sell Times": any[];
  "Num of Buy Times": number;
  "Num of Sell Times": number;
  "Sell Amount of pufETH": number;
  "Buy Amount of pufETH": number;
  Balance: number;
  "Currency Address": string;
  tokenPrice: string;
  totalReserveInUSD: string;
  currentValue: number;
  currentProfit: number;
}

export interface Time {
  time: string;
}
