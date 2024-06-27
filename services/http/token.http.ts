import { SpotlightSearchType } from "@/types/spotlight.type";
import { IAI, IToken } from "@/types/token.type";
import { fetchData } from "./axios.config";
import { AxiosRequestConfig } from "axios";
import { TradeReportType } from "@/types/trade-report.type";
import { IDatafeed } from "@/types/datafeed.type";
import { IchainInfo } from "@/types/chain-info.type";
import { IStrength } from "@/types/strength-ratio.type";
import { ITradingListResponse } from "@/types/Tradinglist.type";

export const spotlightSearch = (
  options: AxiosRequestConfig
): Promise<SpotlightSearchType> =>
  fetchData<SpotlightSearchType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/search`,
    options
  );

export const searchToken = (options: AxiosRequestConfig): Promise<IToken> =>
  fetchData<IToken>(
    `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/idsearch`,
    options
  );

export const getTradingList = (options: AxiosRequestConfig): Promise<ITradingListResponse> =>
  fetchData<ITradingListResponse>(
    `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/tradinglist`,
    // tradinglist?address=0xe2c845369bdeb94d34bd6f98e33388aef499cd0e&network=eth
    options
  );

export const getToken = (
  tokenAddress: string,
  options: AxiosRequestConfig
): Promise<IToken> =>
  fetchData<IToken>(
    `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/token/${tokenAddress}`,
    options
  );

export const getAi = (options?: AxiosRequestConfig): Promise<IAI> =>
  fetchData<IAI>(`${process.env.NEXT_PUBLIC_BASE_URL_ONE}/ai`, options);

export const getStrengthRatio = (
  options?: AxiosRequestConfig
): Promise<IStrength> =>
  fetchData<IStrength>(
    `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/strengthRatio`,
    options
  );

export const getTradeReport = (
  options: AxiosRequestConfig
): Promise<TradeReportType> =>
  fetchData<TradeReportType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/tradeReport`,
    options
  );

export const getTopTrends = (options: AxiosRequestConfig): Promise<IToken> =>
  fetchData<IToken>(
    `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/toptrends`,
    options
  );

export const getChainData = (
  options: AxiosRequestConfig
): Promise<IchainInfo> =>
  fetchData<IchainInfo>(
    `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/chaindata`,
    options
  );

export const getDataFeed = (options?: AxiosRequestConfig): Promise<IDatafeed> =>
  fetchData<IDatafeed>(
    `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/ohlcv?&timeframe=minute&aggregate=5`,
    options
  );
