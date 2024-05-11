// nft.http.ts
import axiosInstance from "./axios.config";
import { AxiosRequestConfig } from "axios";
import { NFTTradeReportType } from "@/types/nft.type"; // Ensure this type is defined in your types directory

/**
 * Fetches the top NFT trades data from the API.
 * @param limit The maximum number of records to fetch.
 * @param daysBack The number of days back from today to include in the search.
 * @returns The top NFT trades data.
 */
export const getTopNFTs = async (
  limit: number = 10,
  daysBack: number = 6
): Promise<NFTTradeReportType> => {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - daysBack);

  const options: AxiosRequestConfig = {
    params: {
      network: "eth",
      limit: limit,
      from: from.toISOString().split("T")[0],
      till: to.toISOString().split("T")[0],
    },
  };

  try {
    const response = await axiosInstance.get<NFTTradeReportType>(
      `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/topNft`,
      options
    );
    return response.data; // Assuming the response data structure matches your type
  } catch (error) {
    console.error("Error fetching top NFTs:", error);
    throw error; // Consider throwing an error so the caller can handle it
  }
};
