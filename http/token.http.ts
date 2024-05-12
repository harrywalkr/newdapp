import { SpotlightSearchType } from "@/types/spotlight.type";
import { TokenType } from "@/types/token.type";
import { fetchData } from "./axios.config";
import { AxiosRequestConfig } from "axios";
import { TradeReportType } from "@/types/trade-report.type";

// export const spotlightSearch = (
//   options: AxiosRequestConfig
// ): res<SpotlightSearchType> => {
//   return axiosInstance.get(
//     `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/search`,
//     options
//   );
// };

// export const searchToken = (options: AxiosRequestConfig): res<TokenType> => {
//   return axiosInstance.get(
//     `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/idsearch`,
//     options
//   );
// };

// export const getToken = (data: {
//   tokenAddress: string;
//   options: AxiosRequestConfig;
// }): res<TokenType> => {
//   return axiosInstance.get(
//     `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/token/${data.tokenAddress}`,
//     data.options
//   );
// };

// export const getTradeReport = (
//   options: AxiosRequestConfig
// ): res<TradeReportType> => {
//   return axiosInstance.get(
//     `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/tradeReport`,
//     options
//   );
// };

// API methods
export const spotlightSearch = (
  options: AxiosRequestConfig
): Promise<SpotlightSearchType> =>
  fetchData<SpotlightSearchType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/search`,
    options
  );

export const searchToken = (options: AxiosRequestConfig): Promise<TokenType> =>
  fetchData<TokenType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/idsearch`,
    options
  );

export const getToken = (
  tokenAddress: string,
  options: AxiosRequestConfig
): Promise<TokenType> =>
  fetchData<TokenType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/token/${tokenAddress}`,
    options
  );

export const getTradeReport = (
  options: AxiosRequestConfig
): Promise<TradeReportType> =>
  fetchData<TradeReportType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/tradeReport`,
    options
  );
