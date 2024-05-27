import { AxiosRequestConfig } from "axios";
import { fetchData } from "./axios.config";
import { IToken } from "@/types/token.type";

export const getTrends = (
  network: string,
  options?: AxiosRequestConfig
): Promise<IToken> =>
  fetchData<IToken>(
    `${process.env.NEXT_PUBLIC_BASE_URL_FOUR}/trends/${network}`, // FIXME: remove 'eth' when wallet provider is ready and backend supports header chain
    options
  );
