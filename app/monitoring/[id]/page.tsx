
import { getToken, searchToken } from "@/http/token.http";
import { Metadata } from "next";
import { getLogo } from "@/http/image.http";
import TokenOverview from "@/components/features/token/token-overview";
import TokenDetail from "@/components/features/token/token-detail";
import { merge } from "@/utils/merger";

interface Props {
    params: params
    searchParams: searchParams
}

type params = {
    id: string
}


type searchParams = {
    network: string
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const data = await searchToken({
            params: {
                currencyAddress: params.id,
            },
        })
        const tokenName = data?.data?.[0]?.attributes?.name || "";
        const tokenPrice = data?.data?.[0]?.attributes?.base_token_price_usd || "";
        const liquidity = data.SecurityData?.tokenSecurity?.details?.dex_listings?.[0]?.total_liquidity || "";
        const score = data?.ScoreData ? `overall score is ${data.ScoreData.score3}/${data.ScoreData.totalScore}` : "";
        return {
            title: `${tokenName ? `${tokenName} | $${tokenPrice}` : "Token"}`,
            description: `${tokenName} price is ${tokenPrice} ${liquidity ? `liquidity is $${liquidity}` : ""}, ${score ? `token overal score is ${score}/400` : ''}`
        };
    } catch (error) {
        return {
            title: 'token page',
            description: 'token description'
        };
    }
}

export default async function Token({ params }: Props) {
    // FIXME: no 500 when image is non-existant
    const logo = await getLogo(params.id);
    const searchedToken = await searchToken({
        params: {
            currencyAddress: params.id,
        }
    });
    const token = await getToken(
        params.id,
        //FIXME: backend must return empty or null with the proper status code not 500 :|
        {
            params: { network: 'eth' }, // FIXME: must be dynamic
        });

    const mergedToken = merge(searchedToken, token)

    return (
        <div className="flex flex-col gap-6 items-center justify-center w-full" >
            <TokenOverview token={mergedToken} logo={logo} tokenAddress={params.id} />
            <TokenDetail token={mergedToken} logo={logo} tokenAddress={params.id} />
        </div >
    )
}
