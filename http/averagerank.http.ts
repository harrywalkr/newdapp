import { res } from "@/types/http.type";
import axiosInstance from "./axios.config";
import { AxiosRequestConfig } from "axios";
import { HotPairs } from "@/types/hotpair.type";

export const getAverageRank = (options?: AxiosRequestConfig): res<HotPairs[]> => {
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_BASE_URL_THREE}/processedData/averageRank`,
    options
  );
};
