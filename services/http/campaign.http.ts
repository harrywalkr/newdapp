import { AxiosRequestConfig } from "axios";
import { fetchData } from "./axios.config";
import { NFTTradeReportType } from "@/types/nft.type"; // Ensure this type is defined in your types directory
import { ICampaign } from "@/types/campaign.type";

export const getCampaignStatus = (
  options?: AxiosRequestConfig
): Promise<ICampaign> =>
  fetchData<ICampaign>(
    `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/campaign`,
    options
  );
