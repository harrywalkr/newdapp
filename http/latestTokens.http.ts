import { res } from "@/types/http.type";
import axiosInstance from "./axios.config";
import { AxiosRequestConfig } from "axios";
import { ILatestToken } from "@/types/latestToke.type";

export const getLatestTokens = (options?: AxiosRequestConfig): res<ILatestToken> => {
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_BASE_URL_THREE}/processedData/latesttime`,
    options
  );
};
