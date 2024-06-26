export interface IWallet {
  walletAddress: string;
  winRate: number;
  netProfit: number;
  avgHoldingTime?: number;
  buyAmountLabel: "Medium Size" | "Large Size" | "Small Size";
  totalScore: number;
  age: number;
  dayActive: number;
  SwapTime: [string] | [null];
  TotalFee: number;
  BotActivity: "Not Bot activity" | "Bot activity";
  details: "Dex Trader" | "Not a Dex Trader";
  totalnumPartiallyClosedData: number;
  totalNumofFullyOpenedData: number;
  totalTransactions: number;
  HotTokenHolders: HotTokenHolder[];
  firstTopTokenHolder: any;
  timestamp: number;
  rank: number;
}

export interface HotTokenHolder {
  tokenName: string;
  isPartiallyClosed?: boolean;
  balance?: number;
  balanceType: string;
  "Buy Amount": number;
  "Buy Amount (USD)": number;
  "Sell Amount": number;
  "Sell Amount (USD)": number;
  Profit: number;
  "Entry Price": number;
  "Exit Price"?: number;
  "Buy Times": Date[];
  "Sell Times": Date[];
  "Num of Buy Times": number;
  "Num of Sell Times": number;
  "Sell Amount of GPU"?: number;
  "Buy Amount of GPU"?: number;
  Balance: number;
  "Currency Address": string;
  tokenPrice?: string;
  currentValue: number;
  currentProfit: number;
  "Sell Amount of DS"?: number;
  "Buy Amount of DS"?: number;
  "Sell Amount of JOE"?: number;
  "Buy Amount of JOE"?: number;
  "Sell Amount of NeonAI"?: number;
  "Buy Amount of NeonAI"?: number;
  "Sell Amount of XRGB"?: number;
  "Buy Amount of XRGB"?: number;
  "Sell Amount of ZKML"?: number;
  "Buy Amount of ZKML"?: number;
  "Sell Amount of PORK"?: number;
  "Buy Amount of PORK"?: number;
  "Sell Amount of MND"?: number;
  "Buy Amount of MND"?: number;
  "Sell Amount of PANDORA"?: number;
  "Buy Amount of PANDORA"?: number;
  "Sell Amount of BITCOIN"?: number;
  "Buy Amount of BITCOIN"?: number;
  "Sell Amount of wBAI"?: number;
  "Buy Amount of wBAI"?: number;
  "Sell Amount of SAVM"?: number;
  "Buy Amount of SAVM"?: number;
  "Sell Amount of dogwifhat"?: number;
  "Buy Amount of dogwifhat"?: number;
  "Sell Amount of RBN"?: number;
  "Buy Amount of RBN"?: number;
  "Sell Amount of VEC"?: number;
  "Buy Amount of VEC"?: number;
  "Sell Amount of HEMULE"?: number;
  "Buy Amount of HEMULE"?: number;
  "Sell Amount of Metis"?: number;
  "Buy Amount of Metis"?: number;
  "Sell Amount of PEPE2.0"?: number;
  "Buy Amount of PEPE2.0"?: number;
  "Sell Amount of POWR"?: number;
  "Buy Amount of POWR"?: number;
  "Sell Amount of SHIDO"?: number;
  "Buy Amount of SHIDO"?: number;
  "Sell Amount of SYNC"?: number;
  "Buy Amount of SYNC"?: number;
  "Sell Amount of FR33"?: number;
  "Buy Amount of FR33"?: number;
  "Sell Amount of OPSEC"?: number;
  "Buy Amount of OPSEC"?: number;
  "Sell Amount of MATIC"?: number;
  "Buy Amount of MATIC"?: number;
  "Sell Amount of BTC"?: number;
  "Buy Amount of BTC"?: number;
  "Sell Amount of Mog"?: number;
  "Buy Amount of Mog"?: number;
  "Sell Amount of PEAS"?: number;
  "Buy Amount of PEAS"?: number;
  "Sell Amount of PRIME"?: number;
  "Buy Amount of PRIME"?: number;
  "Sell Amount of USDe"?: number;
  "Buy Amount of USDe"?: number;
  "Sell Amount of GTC"?: number;
  "Buy Amount of GTC"?: number;
  "Sell Amount of PEPE"?: number;
  "Buy Amount of PEPE"?: number;
  "Sell Amount of ORDS"?: number;
  "Buy Amount of ORDS"?: number;
  "Sell Amount of LINK"?: number;
  "Buy Amount of LINK"?: number;
  "Sell Amount of GTROK"?: number;
  "Buy Amount of GTROK"?: number;
  "Sell Amount of SUPER"?: number;
  "Buy Amount of SUPER"?: number;
  "Sell Amount of TRUMP"?: number;
  "Buy Amount of TRUMP"?: number;
  "Sell Amount of RNDR"?: number;
  "Buy Amount of RNDR"?: number;
  "Sell Amount of PNDC"?: number;
  "Buy Amount of PNDC"?: number;
  "Sell Amount of UNIBOT"?: number;
  "Buy Amount of UNIBOT"?: number;
  "Sell Amount of TAS"?: number;
  "Buy Amount of TAS"?: number;
  "Sell Amount of NRG"?: number;
  "Buy Amount of NRG"?: number;
  "Sell Amount of DNODE"?: number;
  "Buy Amount of DNODE"?: number;
  "Sell Amount of wCOMAI"?: number;
  "Buy Amount of wCOMAI"?: number;
  "Sell Amount of ENQAI"?: number;
  "Buy Amount of ENQAI"?: number;
  "Sell Amount of AIUS"?: number;
  "Buy Amount of AIUS"?: number;
  "Sell Amount of ALT"?: number;
  "Buy Amount of ALT"?: number;
  "Sell Amount of @LFG"?: number;
  "Buy Amount of @LFG"?: number;
  "Sell Amount of FTM"?: number;
  "Buy Amount of FTM"?: number;
  "Sell Amount of NAO"?: number;
  "Buy Amount of NAO"?: number;
  "Sell Amount of шайлушай"?: number;
  "Buy Amount of шайлушай"?: number;
  "Sell Amount of FLOKI"?: number;
  "Buy Amount of FLOKI"?: number;
  "Sell Amount of MUTE"?: number;
  "Buy Amount of MUTE"?: number;
  "Sell Amount of PLT"?: number;
  "Buy Amount of PLT"?: number;
  "Sell Amount of FTX Token"?: number;
  "Buy Amount of FTX Token"?: number;
  "Sell Amount of PC"?: number;
  "Buy Amount of PC"?: number;
  "Sell Amount of $MONG"?: number;
  "Buy Amount of $MONG"?: number;
  "Sell Amount of ONDO"?: number;
  "Buy Amount of ONDO"?: number;
  "Sell Amount of ENS"?: number;
  "Buy Amount of ENS"?: number;
  "Sell Amount of wTAO"?: number;
  "Buy Amount of wTAO"?: number;
  "Sell Amount of FLIP"?: number;
  "Buy Amount of FLIP"?: number;
}
