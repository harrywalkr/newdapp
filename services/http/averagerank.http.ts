import { res } from "@/types/http.type";
import axiosInstance from "./axios.config";
import { AxiosRequestConfig } from "axios";
import { HotPairs } from "@/types/hotpair.type";

export const getAverageRank = (
  network: string,
  options?: AxiosRequestConfig
): res<HotPairs[]> => {
  return axiosInstance.get(
    // FIXME: network/chain must be send as a query param to the backend. backend must fix this
    `${process.env.NEXT_PUBLIC_BASE_URL_THREE}/processedData/averageRank/${network}`,
    options
  );
};
