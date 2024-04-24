import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { getToken, searchToken } from "@/http/token.http";
import { Metadata } from "next";
import Image from "next/image";
import { getLogo } from "@/http/image.http";
import TokenOverview from "@/components/features/token/token-overview";

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
    const { data } = await searchToken({
        params: {
            currencyAddress: params.id,
        },
    })
    const tokenName = data?.data?.[0]?.attributes?.name || "";
    const tokenPrice = data?.data?.[0]?.attributes?.base_token_price_usd || "";
    const liquidity = data?.SecurityData?.tokenSecurity?.details?.dex_listings?.[0]?.total_liquidity || "";
    const score = data?.ScoreData ? `overall score is ${data.ScoreData.score3}/${data.ScoreData.totalScore}` : "";
    return {
        title: `${tokenName ? `${tokenName} | $${tokenPrice}` : "Token"}`,
        description: `${tokenName} price is ${tokenPrice} ${liquidity ? `liquidity is $${liquidity}` : ""}, ${score ? `token overal score is ${score}/400` : ''}`
    };
}


export default async function Token({ params }: Props) {

    const { data: logo } = await getLogo({
        tokenAddress: params.id,
        options: {}
    });

    const { data: searchedToken } = await searchToken({
        params: {
            currencyAddress: params.id,
        }
    });

    const { data: token } = await getToken({
        tokenAddress: params.id,
        options: {
            params: { network: 'eth' }, // FIXME: must be dynamic
        }
    });




    return (
        <div className="flex flex-col gap-6 items-center justify-center w-full" >
            <TokenOverview token={searchedToken} logo={logo} />
            <Card className="w-full">
                <CardContent className="mt-5">
                    <Tabs defaultValue="account" >
                        <TabsList>
                            <TabsTrigger value="account">Summary</TabsTrigger>
                            <TabsTrigger value="password">Markets</TabsTrigger>
                            <TabsTrigger value="password">Scoring</TabsTrigger>
                        </TabsList>
                        <TabsContent value="account">Token summary is here</TabsContent>
                        <TabsContent value="password">Find out more about token markets</TabsContent>
                        <TabsContent value="password">Token scoring and vuln</TabsContent>
                    </Tabs>
                </CardContent>

            </Card>

        </div >

    )
}
