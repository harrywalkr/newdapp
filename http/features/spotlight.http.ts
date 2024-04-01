import { req, res } from "@/types/http.type";
import axiosInstance from "../axios.config";
import { SpotlightSearchType } from "@/types/features/spotlight.type";

export const spotlightSearch = (config: req): res<SpotlightSearchType> => {
  return axiosInstance.get(`${process.env.NEXT_PUBLIC_BASE_URL_ONE}/search`, {
    params: config.params,
  });
};
