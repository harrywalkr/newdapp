"use client";

import { useAccount } from 'wagmi';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getWalletSummary } from '@/services/http/wallets.http';
import { Overview } from './overview';
import { Watchlist } from './dashboard-watchlist';
import { DashboardCard, ConnectWalletMessage } from './DashboardComponents';
import LoginForm from '@/components/features/login/Login-form'
import { Skeleton } from '@/components/ui/skeleton';

export default function OverviewTab() {
    const { isConnected, address } = useAccount();
    const { mutate: fetchWalletSummary, data: walletSummary } = useMutation({
        mutationKey: ['userWallet', address],
        mutationFn: (walletAddress: string) => getWalletSummary(walletAddress),
    });

    useEffect(() => {
        if (typeof window !== 'undefined' && isConnected && address) {
            fetchWalletSummary(address);
        }
    }, [isConnected, address, fetchWalletSummary]);

    if (!isConnected) {
        return (
            <div className="grid grid-cols-6 grid-rows-4 gap-4">
                <div className="col-span-3 row-span-2">
                    <Skeleton className="h-full rounded-xl" />
                </div>
                <div className="col-span-3 col-start-4">
                    <Skeleton className="h-full rounded-xl" />
                </div>
                <div className="col-span-3 col-start-4 row-start-2">
                    <Skeleton className="h-full rounded-xl" />
                </div>
                <div className="col-span-3 col-start-4 row-start-3">
                    <Skeleton className="h-full rounded-xl" />
                </div>
                <div className="col-span-3 col-start-4 row-start-4">
                    <Skeleton className="h-full rounded-xl" />
                </div>
                <div className="col-span-3 row-span-2 col-start-1 row-start-3">
                    <Skeleton className="h-full rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-6 grid-rows-4 gap-4">
            <div className="col-span-3 row-span-2 w-full h-full">
                <DashboardCard title="Premium" iconPath="M22 12h-4l-3 9L9 3l-3 9H2">
                    <LoginForm classname='h-full w-full' />
                </DashboardCard>
            </div>
            <div className="col-span-3 col-start-4 h-full">
                <DashboardCard title="Money Flow" iconPath="M22 12h-4l-3 9L9 3l-3 9H2">
                    {walletSummary?.totalDeposit !== undefined &&
                        walletSummary?.totalWithdraw !== undefined && (
                            <div className="text-2xl font-bold">
                                <div className="text-sm text-muted-foreground">
                                    Inflow: {walletSummary.totalDeposit}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Outflow: {walletSummary.totalWithdraw}
                                </div>
                            </div>
                        )}
                </DashboardCard>
            </div>
            <div className="col-span-3 col-start-4 row-start-2">
                <DashboardCard title="Highest Profitable Trade" iconPath="M2 10h20">
                    {walletSummary?.highestProfit !== undefined ? (
                        <div className="text-2xl font-bold">
                            {walletSummary.highestProfit[0]}
                        </div>
                    ) : (
                        <ConnectWalletMessage />
                    )}
                </DashboardCard>
            </div>
            <div className="col-span-3 col-start-4 row-start-3">
                {walletSummary?.transactionMetrics?.totalTransactions !== undefined && (
                    <DashboardCard
                        title="Total Transactions"
                        iconPath="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 1 0 7.75M22 21v-2a4 4 0 0 0-3-3.87"
                    >
                        <div className="text-2xl font-bold">
                            {walletSummary.transactionMetrics.totalTransactions}
                        </div>
                    </DashboardCard>
                )}
            </div>
            <div className="col-span-3 col-start-4 row-start-4">
                <DashboardCard
                    title="Net Profit"
                    iconPath="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                >
                    {walletSummary?.netProfit !== undefined ? (
                        <div className="text-2xl font-bold">${walletSummary.netProfit}</div>
                    ) : (
                        <ConnectWalletMessage />
                    )}
                </DashboardCard>
            </div>
            <div className="col-span-3 row-span-2 col-start-1 row-start-3">
                <DashboardCard
                    title="Overview"
                    iconPath="M22 12h-4l-3 9L9 3l-3 9H2"
                    classNames='h-full'
                >
                    {walletSummary && <Overview walletInfo={walletSummary} />}
                </DashboardCard>
            </div>
        </div>
    );
}