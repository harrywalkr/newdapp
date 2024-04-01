import { req, res } from "@/types/http.type";
import { SpotlightSearchType } from "@/types/features/spotlight.type";
import { Token } from "@/types/token.type";
import axiosInstance from "./axios.config";

export const spotlightSearch = (config: req): res<SpotlightSearchType> => {
  return axiosInstance.get(`${process.env.NEXT_PUBLIC_BASE_URL_ONE}/search`, {
    params: config.params,
  });
};

export const searchToken = (config: req): res<Token> => {
  return axiosInstance.get(`${process.env.NEXT_PUBLIC_BASE_URL_ONE}/idsearch`, {
    params: config.params,
  });
};
