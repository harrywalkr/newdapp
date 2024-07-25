import { NFTTradeReportType } from '@/types/nft.type';
import {fetchData} from "@/services/http/axios.config";

export const getTopNFTs = async (limit = 10, daysBack = 6): Promise<NFTTradeReportType> => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - daysBack);

    const url = `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/topNft`;
    const options = {
        params: {
            network: 'eth',
            limit: limit,
            from: from.toISOString().split('T')[0],
            till: to.toISOString().split('T')[0],
        },
    };

    const queryString = new URLSearchParams(options.params).toString();
    return fetchData(`${url}?${queryString}`);
};