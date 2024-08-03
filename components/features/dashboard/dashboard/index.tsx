"use client";
import { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileWallet from "../profile-wallet";
import { useAccount } from "wagmi";
import OverviewTab from "./components/OverviewTab";
import { ConnectWalletMessage, DashboardCard } from "./components/DashboardComponents";
import { Watchlist } from "./components/dashboard-watchlist";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your dashboard.",
};

export default function ProfileDashboard() {
  const { isConnected } = useAccount();

  return (
    <div className="flex-col md:flex">
      <div className="flex-1 space-y-4 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="wallets">Wallets</TabsTrigger>
            <TabsTrigger value="watchlist" >
              watchlist
            </TabsTrigger>
            {/* <TabsTrigger value="notifications" disabled>
              Notifications
            </TabsTrigger> */}
          </TabsList>
          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>
          <TabsContent value="wallets" className="space-y-4">
            {isConnected ? <ProfileWallet /> : <NoData />}
          </TabsContent>
          <TabsContent value="watchlist">
            <Watchlist />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function NoData() {
  return (
    <div className="space-y-4">
      {/* <div className="grid gap-4 grid-cols-1 w-full md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Net Profit"
          iconPath="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
        >
          <ConnectWalletMessage />
        </DashboardCard>
        <DashboardCard
          title="Total Transactions"
          iconPath="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 1 0 7.75M22 21v-2a4 4 0 0 0-3-3.87"
        >
          <ConnectWalletMessage />
        </DashboardCard>
        <DashboardCard title="Highest Profitable Trade" iconPath="M2 10h20">
          <ConnectWalletMessage />
        </DashboardCard>
        <DashboardCard title="Money Flow" iconPath="M22 12h-4l-3 9L9 3l-3 9H2">
          <ConnectWalletMessage />
        </DashboardCard>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <DashboardCard
          title="Overview"
          iconPath="M22 12h-4l-3 9L9 3l-3 9H2"
          classNames="col-span-3 md:col-span-4"
        >
          <ConnectWalletMessage />
        </DashboardCard>
        <DashboardCard
          title="Watchlist"
          iconPath="M22 12h-4l-3 9L9 3l-3 9H2"
          classNames="col-span-3"
        >
          <Watchlist />
        </DashboardCard>
      </div> */}
    </div>
  );
}
