import { req, res } from "@/types/http.type";
import axiosInstance from "../axios.config";
import { SpotlightSearchType } from "@/types/features/spotlight.type";
import { AxiosRequestConfig } from "axios";

export const spotlightSearch = (
  options: AxiosRequestConfig
): res<SpotlightSearchType> => {
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/search`,
    options
  );
};
