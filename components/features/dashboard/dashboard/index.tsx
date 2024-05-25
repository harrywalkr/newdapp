'use client';
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
import { Button } from "@/components/ui/button";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import clsx from "clsx";

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
                      iconPath="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                    >
                      {walletSummary?.netProfit !== undefined ? (
                        <div className="text-2xl font-bold">${walletSummary.netProfit}</div>
                      ) : (
                        <ConnectWalletMessage2 />
                      )}
                    </DashboardCard>
                    {walletSummary?.transactionMetrics?.totalTransactions !== undefined && (
                      <DashboardCard
                        title="Total Transactions"
                        iconPath="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 1 0 7.75M22 21v-2a4 4 0 0 0-3-3.87"
                      >
                        <div className="text-2xl font-bold">{walletSummary.transactionMetrics.totalTransactions}</div>
                      </DashboardCard>
                    )}
                    <DashboardCard
                      title="Highest Profitable Trade"
                      iconPath="M2 10h20"
                    >
                      {walletSummary?.highestProfit !== undefined ? (
                        <div className="text-2xl font-bold">{walletSummary.highestProfit[0]}</div>
                      ) : (
                        <ConnectWalletMessage2 />
                      )}
                    </DashboardCard>
                    <DashboardCard
                      title="Money Flow"
                      iconPath="M22 12h-4l-3 9L9 3l-3 9H2"
                    >
                      {walletSummary?.totalDeposit !== undefined && walletSummary?.totalWithdraw !== undefined ? (
                        <div className="text-2xl font-bold">
                          <div className="text-sm text-muted-foreground">Inflow: {walletSummary.totalDeposit}</div>
                          <div className="text-sm text-muted-foreground">Outflow: {walletSummary.totalWithdraw}</div>
                        </div>
                      ) : (
                        <ConnectWalletMessage2 />
                      )}
                    </DashboardCard>
                  </div>
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
                    <DashboardCard
                      title="Overview"
                      iconPath="M22 12h-4l-3 9L9 3l-3 9H2"
                      classNames="col-span-3 md:col-span-4">
                      {walletSummary && <Overview walletInfo={walletSummary} />}
                    </DashboardCard>

                    <DashboardCard
                      title="Watchlist"
                      iconPath="M22 12h-4l-3 9L9 3l-3 9H2"
                      classNames="col-span-3">
                      <RecentSales />
                    </DashboardCard>


                  </div>
                </div>
              ) : (
                <ConnectWalletMessage />
              )}
            </TabsContent>
            <TabsContent value="wallets" className="space-y-4">
              {isConnected ? <ProfileWallet /> : <ConnectWalletMessage />}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}

interface DashboardCardProps {
  title: string;
  iconPath: string;
  children: React.ReactNode;
  classNames?: string;
}

function DashboardCard({ title, iconPath, children, classNames }: DashboardCardProps) {
  return (
    <Card className={clsx('w-full', classNames)}>
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
        {children}
      </CardContent>
    </Card>
  );
}

function ConnectWalletMessage() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-1 w-full md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Net Profit"
          iconPath="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
        >
          <ConnectWalletMessage2 />
        </DashboardCard>
        <DashboardCard
          title="Total Transactions"
          iconPath="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 1 0 7.75M22 21v-2a4 4 0 0 0-3-3.87"
        >
          <ConnectWalletMessage2 />
        </DashboardCard>
        <DashboardCard
          title="Highest Profitable Trade"
          iconPath="M2 10h20"
        >
          <ConnectWalletMessage2 />
        </DashboardCard>
        <DashboardCard
          title="Money Flow"
          iconPath="M22 12h-4l-3 9L9 3l-3 9H2"
        >
          <ConnectWalletMessage2 />
        </DashboardCard>
      </div>
    </div>
  );
}

function ConnectWalletMessage2() {
  const { open } = useWeb3Modal();

  return (
    <div className="flex flex-col items-center justify-center gap-2 my-5">
      <Button variant="outline" onClick={() => open()}>
        Connect with wallet to see info
      </Button>
    </div>
  );
}
