import { AxiosRequestConfig } from "axios";
import { fetchData } from "./axios.config";
import { Trend } from "@/types/trend.type";

export const getTrends = (
  network: string,
  options?: AxiosRequestConfig
): Promise<Trend> =>
  fetchData<Trend>(
    `${process.env.NEXT_PUBLIC_BASE_URL_FOUR}/trends/${network}`, // FIXME: remove 'eth' when wallet provider is ready and backend supports header chain
    options
  );
