import { req, res } from "@/types/http.type";
import { SpotlightSearchType } from "@/types/features/spotlight.type";
import { Token } from "@/types/token.type";
import axiosInstance from "./axios.config";
import { AxiosRequestConfig } from "axios";

export const spotlightSearch = (
  options: AxiosRequestConfig
): res<SpotlightSearchType> => {
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/search`,
    options
  );
};

export const searchToken = (options: AxiosRequestConfig): res<Token> => {
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/idsearch`,
    options
  );
};
