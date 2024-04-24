import { res } from "@/types/http.type";
import axiosInstance from "./axios.config";
import { AxiosRequestConfig } from "axios";
import { ImageEndpoint, ImageType } from "@/types/Image.type";

export const getImages = (options: AxiosRequestConfig): res<ImageEndpoint> => {
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_BASE_URL_TWO}/images`,
    options
  );
};

// FIXME: create a service to use getImage once and use it everywhere instead of calling getLogo() function
export const getLogo = (data: {
  tokenAddress: string;
  options: AxiosRequestConfig;
}): res<ImageType> => {
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_BASE_URL_TWO}/${data.tokenAddress}/logo`,
    data.options
  );
};
