"use client";
import { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileWallet from "../profile-wallet";
import { useAccount } from "wagmi";
import OverviewTab from "./components/OverviewTab";
import { ConnectWalletMessage, DashboardCard } from "./components/DashboardComponents";
import { Watchlist } from "./components/dashboard-watchlist";
import WalletPage from "@/components/features/wallet/Wallet-page";
import { getWalletBalance, getWalletSummary } from "@/services/http/wallets.http";
import { useTokenChainStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { WalletSummaryType } from "@/types/wallet-summary.type";
import { WalletBalanceType } from "@/types/wallet-balance.type";

interface WalletContentProps {
  address: string;
  walletSummary?: WalletSummaryType;
  isSummaryLoading: boolean;
  isSummaryError: boolean;
  walletBalance?: WalletBalanceType;
  isBalanceLoading: boolean;
  isBalanceError: boolean;
  selectedChain: {
    symbol: string;
  };
}

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your dashboard.",
};

export default function ProfileDashboard() {
  const { isConnected, address } = useAccount();
  const { selectedChain } = useTokenChainStore();

  const { data: walletSummary, refetch: refetchSummary, isLoading: isSummaryLoading, isError: isSummaryError } = useQuery({
    queryKey: ['walletSummary', selectedChain.symbol],
    queryFn: () => getWalletSummary(address!, { params: { network: selectedChain.symbol } }),
    enabled: isConnected,
  });

  const { data: walletBalance, isLoading: isBalanceLoading, isError: isBalanceError } = useQuery({
    queryKey: ['walletBalance', address!, selectedChain.symbol],
    queryFn: () => getWalletBalance(address!, { params: { network: selectedChain.symbol } }),
    enabled: isConnected,
  });

  return (
    <div className="flex-col md:flex">
      <div className="flex-1 space-y-4 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="resume">resume</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>
          <TabsContent value="resume" className="space-y-4">
            {isConnected &&
              address != undefined ?
              (
                <WalletContent
                  address={address}
                  walletSummary={walletSummary}
                  isSummaryLoading={isSummaryLoading}
                  isSummaryError={isSummaryError}
                  walletBalance={walletBalance}
                  isBalanceLoading={isBalanceLoading}
                  isBalanceError={isBalanceError}
                  selectedChain={selectedChain}
                />
              ) : (
                <NoData />
              )}
          </TabsContent>
          <TabsContent value="watchlist">
            <Watchlist />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function WalletContent({ address, walletSummary, isSummaryLoading, isSummaryError, walletBalance, isBalanceLoading, isBalanceError, selectedChain }: WalletContentProps) {
  if (isSummaryLoading || isBalanceLoading) {
    return <div>Loading...</div>;
  }

  if (isSummaryError || isBalanceError) {
    return <div>Error loading wallet data</div>;
  }

  return (
    <WalletPage
      walletAddress={address}
      initialWalletSummary={walletSummary!}
      initialWalletBalance={walletBalance!}
      chain={selectedChain.symbol}
    />
  );
}

function NoData() {
  return (
    <div className="space-y-4">
      <ConnectWalletMessage />
    </div>
  );
}
