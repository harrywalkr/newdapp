'use client'
import { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "./components/overview";
import { RecentSales } from "./components/recent-sales";
import ProfileWallet from "../profile-wallet";
import { Config, useAccount, useConnect } from 'wagmi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from "react";
import { getWalletSummary } from "@/services/http/wallets.http";
import { ConnectMutate } from "wagmi/query";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default function ProfileDashboard() {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const queryClient = useQueryClient();

  const { mutate: fetchWalletSummary, data: walletSummary } = useMutation(
    {
      mutationKey: ['userWallet', address],
      mutationFn: (walletAddress: string) => getWalletSummary(walletAddress),
    }
  );

  useEffect(() => {
    if (isConnected && address) {
      fetchWalletSummary(address);
    }
  }, [isConnected, address, fetchWalletSummary]);

  return (
    <>
      <div className="flex-col md:flex">
        <div className="flex-1 space-y-4 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="wallets">Wallets</TabsTrigger>
              <TabsTrigger value="analytics" disabled>Reports</TabsTrigger>
              <TabsTrigger value="notifications" disabled>Notifications</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              {isConnected ? (
                <div className="space-y-4">
                  <div className="grid gap-4 grid-cols-1 w-full md:grid-cols-2 lg:grid-cols-4">
                    <DashboardCard
                      title="Net Profit"
                      value={walletSummary?.netProfit !== undefined ? `$${walletSummary.netProfit}` : null}
                      iconPath="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                    />
                    {
                      walletSummary?.transactionMetrics?.totalTransactions != undefined &&
                      <DashboardCard
                        title="Total Transactions"
                        value={walletSummary?.transactionMetrics?.totalTransactions}
                        iconPath="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 1 0 7.75M22 21v-2a4 4 0 0 0-3-3.87"
                      />
                    }
                    <DashboardCard
                      title="Highest Profitable Trade"
                      value={walletSummary?.highestProfit !== undefined ? walletSummary.highestProfit[0] : null}
                      iconPath="M2 10h20"
                    />
                    <DashboardCard
                      title="Money Flow"
                      value={
                        walletSummary?.totalDeposit !== undefined && walletSummary?.totalWithdraw !== undefined
                          ? `Inflow: ${walletSummary.totalDeposit}, Outflow: ${walletSummary.totalWithdraw}`
                          : null
                      }
                      iconPath="M22 12h-4l-3 9L9 3l-3 9H2"
                    />
                  </div>
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-3 md:col-span-4">
                      <CardHeader>
                        <CardTitle>Overview</CardTitle>
                      </CardHeader>
                      <CardContent className="md:pl-2">
                        {
                          walletSummary != undefined &&
                          <Overview walletInfo={walletSummary} />
                        }
                      </CardContent>
                    </Card>
                    <Card className="col-span-3">
                      <CardHeader>
                        <CardTitle>Watchlist</CardTitle>
                        <CardDescription>
                          List of your favorite tokens
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <RecentSales />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <ConnectWalletMessage connectors={connectors} connect={connect} />
              )}
            </TabsContent>
            <TabsContent value="wallets" className="space-y-4">
              {isConnected ? <ProfileWallet /> : <ConnectWalletMessage connectors={connectors} connect={connect} />}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}

interface DashboardCardProps {
  title: string;
  value: string | number | null;
  iconPath: string;
}

function DashboardCard({ title, value, iconPath }: DashboardCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <path d={iconPath} />
        </svg>
      </CardHeader>
      <CardContent>
        {value !== null ? (
          <div className="text-2xl font-bold">{value}</div>
        ) : (
          <div className="flex items-center justify-center">Connect your wallet to see your pnl history</div>
        )}
      </CardContent>
    </Card>
  );
}

interface Connector {
  id: string;
  name: string;
}

interface ConnectWalletMessageProps {
  connectors: readonly Connector[];
  // connect: (options: { connector: Connector }) => void;
  connect: ConnectMutate<Config, unknown>
}

function ConnectWalletMessage({ connectors, connect }: ConnectWalletMessageProps) {
  return (
    <div className="flex items-center justify-center h-64">
      {connectors.map((connector) => (
        <button
          key={connector.id}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={() => connect({ connector: connector as any })}
        >
          Connect with {connector.name}
        </button>
      ))}
    </div>
  );
}
