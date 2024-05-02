import { Metadata } from "next";
import { getWalletBalance, getWalletParams, getWalletSummary } from "@/http/wallets.http";
import { ImageType } from "@/types/Image.type";
import { getImages } from "@/http/image.http";
import WalletDetail from "@/components/features/wallet/wallet-detail";
import WalletOverview from "@/components/features/wallet/wallet-overview";

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
    } catch (error) {
        return {
            title: 'wallet page',
            description: 'wallet description'
        };
    }
}

export default async function Token({ params }: Props) {
    // FIXME: catch all 500 errors
    const dateRange = await getWalletParams({ walletAddress: params.id });
    const { data: walletSummary } = await getWalletSummary({
        walletAddress: params.id,
        options: {
            params: dateRange
        }
    })
    const { data: walletBalance } = await getWalletBalance({
        walletAddress: params.id,
        options: {}
    });

    return (
        <div className="flex flex-col gap-6 items-center justify-center w-full" >
            <WalletOverview walletSummary={walletSummary} walletBalance={walletBalance} walletAddress={params.id} />
            <WalletDetail walletSummary={walletSummary} walletBalance={walletBalance} walletAddress={params.id} dateRange={dateRange} />
        </div >
    )
}
