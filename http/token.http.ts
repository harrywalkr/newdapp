import { req, res } from "@/types/http.type";
import { SpotlightSearchType } from "@/types/spotlight.type";
import { Token } from "@/types/token.type";
import axiosInstance from "./axios.config";
import { AxiosRequestConfig } from "axios";
import { TradeReportType } from "@/types/trade-report.type";

export const spotlightSearch = (
  options: AxiosRequestConfig
): res<SpotlightSearchType> => {
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/search`,
    options
  );
};

export const searchToken = (options: AxiosRequestConfig): res<Token> => {
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/idsearch`,
    options
  );
};

export const getToken = (data: {
  tokenAddress: string;
  options: AxiosRequestConfig;
}): res<Token> => {
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/token/${data.tokenAddress}`,
    data.options
  );
};

export const getTradeReport = (options: AxiosRequestConfig): res<TradeReportType> => {
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/tradeReport`,
    options
  );
};
