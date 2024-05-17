import { res } from "@/types/http.type";
import axiosInstance from "./axios.config";
import { AxiosRequestConfig } from "axios";
import { ILatestToken } from "@/types/latestToke.type";

export const getLatestTokens = (
  network: string,
  options?: AxiosRequestConfig
): res<ILatestToken> => {
  return axiosInstance.get(
    // FIXME: network/chain must be send as a query param to the backend. backend must fix this
    `${process.env.NEXT_PUBLIC_BASE_URL_THREE}/processedData/latesttime/${network}`,
    options
  );
};
