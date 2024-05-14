import { res } from "@/types/http.type";
import { fetchData } from "./axios.config";
import { AxiosRequestConfig } from "axios";
import { ImageEndpoint, ImageType } from "@/types/Image.type";
;

export const getImages = (
  options?: AxiosRequestConfig
): Promise<ImageEndpoint> =>
  fetchData<ImageEndpoint>(
    `${process.env.NEXT_PUBLIC_BASE_URL_TWO}/images`,
    options
  );

export const getLogo = (
  tokenAddress: string,
  options?: AxiosRequestConfig
): Promise<ImageType> =>
  fetchData<ImageType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_TWO}/${tokenAddress}/logo`,
    options
  );
