'use client'
import { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "./components/overview"
import { RecentSales } from "./components/recent-sales"
import ProfileWallet from "../profile-wallet"
import { useAccount, useConnect } from 'wagmi'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosRequestConfig } from 'axios'
import { useEffect } from "react"
import { getWalletSummary } from "@/services/http/wallets.http"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
}

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

  // Fetch wallet summary when the wallet connects
  useEffect(() => {
    if (isConnected && address) {
      fetchWalletSummary(address);
    }
  }, [isConnected, address, fetchWalletSummary]);

  return (
    <>
      <div className=" flex-col md:flex">
        <div className="flex-1 space-y-4 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="wallets">
                Wallets
              </TabsTrigger>
              <TabsTrigger value="analytics" disabled>
                Reports
              </TabsTrigger>
              <TabsTrigger value="notifications" disabled>
                Notifications
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              {isConnected ?
                <>
                  <div className="grid gap-4 grid-cols-1 w-full md:grid-cols-2 lg:grid-cols-4">
                    <Card className="w-full">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Net Profit
                        </CardTitle>
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
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                      </CardHeader>
                      <CardContent>
                        {
                          walletSummary?.netProfit != undefined &&
                          <div className="text-2xl font-bold">${walletSummary.netProfit}</div>
                        }
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Total Transactions
                        </CardTitle>
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
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      </CardHeader>
                      <CardContent>
                        {
                          walletSummary?.transactionMetrics?.totalTransactions != undefined &&
                          <div className="text-2xl font-bold">{walletSummary.transactionMetrics.totalTransactions}</div>
                        }
                        {/* <p className="text-xs text-muted-foreground">
                          +180.1% from last month
                        </p> */}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Highest Profitable Trade</CardTitle>
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
                          <rect width="20" height="14" x="2" y="5" rx="2" />
                          <path d="M2 10h20" />
                        </svg>
                      </CardHeader>
                      <CardContent>
                        {/* FIXME: LOGO */}
                        {
                          walletSummary?.highestProfit != undefined &&
                          <div className="text-2xl font-bold">{walletSummary.highestProfit[0]}</div>
                        }
                        {/* <p className="text-xs text-muted-foreground">
                          +19% from last month
                        </p> */}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Money Flow
                        </CardTitle>
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
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                      </CardHeader>
                      <CardContent>

                        {
                          walletSummary?.totalDeposit != undefined &&
                          walletSummary?.totalWithdraw != undefined &&
                          <div className="text-2xl font-bold">
                            <div>inflow: {walletSummary.totalDeposit}</div>
                            <div>outflow: {walletSummary.totalWithdraw}</div>
                          </div>
                        }

                        {/* <div className="text-2xl font-bold">+573</div> */}

                        {/* <p className="text-xs text-muted-foreground">
                          +201 since last hour
                        </p> */}
                      </CardContent>
                    </Card>
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
                </> : <>
                  <div className="grid gap-4 grid-cols-1 w-full md:grid-cols-2 lg:grid-cols-4">
                    <Card className="w-full">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Total Revenue
                        </CardTitle>
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
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                      </CardHeader>
                      <div className="flex items-center justify-center">
                        Connect your wallet to see your pnl history
                      </div>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Trades
                        </CardTitle>
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
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      </CardHeader>
                      <div className="flex items-center justify-center">
                        Connect your wallet to see your pnl history
                      </div>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Gains</CardTitle>
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
                          <rect width="20" height="14" x="2" y="5" rx="2" />
                          <path d="M2 10h20" />
                        </svg>
                      </CardHeader>
                      <div className="flex items-center justify-center">
                        Connect your wallet to see your pnl history
                      </div>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Active Now
                        </CardTitle>
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
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-center">
                          Connect your wallet to see your pnl history
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-3 md:col-span-4">
                      <CardHeader>
                        <CardTitle>Overview</CardTitle>
                      </CardHeader>
                      <CardContent className="md:pl-2">
                        <div className="flex items-center justify-center">
                          Connect your wallet to see your pnl history
                        </div>
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
                </>
              }

            </TabsContent>
            <TabsContent value="wallets" className="space-y-4">
              {isConnected ? (
                <ProfileWallet />
              ) : (
                <div className="flex items-center justify-center h-64">
                  {connectors.map((connector) => (
                    <button
                      key={connector.id}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md"
                      onClick={() => connect({ connector })}
                    >
                      Connect with {connector.name}
                    </button>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
