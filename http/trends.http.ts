import { res } from "@/types/http.type";
import axiosInstance from "./axios.config";
import { AxiosRequestConfig } from "axios";
import { ImageEndpoint } from "@/types/Image.type";
import { Trend } from "@/types/trend.type";

export const getTrends = (options: AxiosRequestConfig): res<Trend> => {
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_BASE_URL_FOUR}/trends/eth`, // FIXME: remove 'eth' when wallet provider is ready and backend supports header chain
    options
  );
};
