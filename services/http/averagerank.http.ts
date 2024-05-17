import { AxiosRequestConfig } from "axios";
import { fetchData } from "./axios.config";
import { HotPairs } from "@/types/hotpair.type";

export const getAverageRank = (
  network: string,
  options?: AxiosRequestConfig
): Promise<HotPairs[]> => {
  return fetchData<HotPairs[]>(
    `${process.env.NEXT_PUBLIC_BASE_URL_THREE}/processedData/averageRank/${network}`,
    options
  );
};
