import { Metadata } from "next";
import { getWalletBalance, getWalletSummary } from "@/services/http/wallets.http";
import { WalletBalanceType } from "@/types/wallet-balance.type";
import { WalletSummaryType } from "@/types/wallet-summary.type";
import WalletPage from "@/components/features/wallet/Wallet-page";

interface Props {
    params: { id: string };
    searchParams: { network: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const data = await getWalletSummary(params.id);
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

export default async function Token({ params, searchParams }: Props) {
    const walletSummary: WalletSummaryType = await getWalletSummary(params.id, { params: { network: searchParams.network } });
    const walletBalance: WalletBalanceType = await getWalletBalance(params.id, { params: { network: searchParams.network } });

    return (
        <WalletPage
            walletAddress={params.id}
            initialWalletSummary={walletSummary}
            initialWalletBalance={walletBalance}
            chain={searchParams.network}
        />
    );
}
