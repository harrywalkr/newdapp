import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Metadata } from "next";
import { getWalletBalance, getWalletParams, getWalletSummary } from "@/http/wallets.http";
import { ImageType } from "@/types/Image.type";
import { getImages } from "@/http/image.http";
import WalletDetail from "@/components/features/wallet/wallet-detail";

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
    const { data } = await getWalletSummary({
        walletAddress: params.id,
        options: {}
    })

    const totalProfit = data.totalProfit || 0;
    const totalLoss = data.totalLoss || 0;
    const trader = data.labelTrader || 'Unknown';

    return {
        title: `${params.id} | $${data?.netProfit}`,
        description: `${params.id} - Total Profit: $${totalProfit} - Total Loss: $${totalLoss} | Trader: ${trader}`,
    };
}

export default async function Token({ params }: Props) {
    const queryParams = await getWalletParams({ walletAddress: params.id });
    const walletInfo = await getWalletSummary({
        walletAddress: params.id,
        options: {
            params: queryParams
        }
    })
    const walletBalance = await getWalletBalance({
        walletAddress: params.id,
        options: {}
    });
    const images: ImageType[] = (await getImages({})).data.imageUrls

    return (
        <div className="flex flex-col gap-6 items-center justify-center w-full" >
            {/* <WalletOverview token={searchedToken} logo={logo} /> */}
            <WalletDetail />
        </div >
    )
}
