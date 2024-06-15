'use client'

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getWalletBalance, getWalletSummary, getWalletParams } from '@/services/http/wallets.http';
import WalletOverview from '@/components/features/wallet/wallet-overview';
import WalletDetail from '@/components/features/wallet/wallet-detail';
import { WalletBalanceType } from '@/types/wallet-balance.type';
import { WalletSummaryType } from '@/types/wallet-summary.type';

interface Props {
    walletAddress: string;
    initialWalletSummary: WalletSummaryType;
    initialWalletBalance: WalletBalanceType;
}

const WalletPage: React.FC<Props> = ({ walletAddress, initialWalletSummary, initialWalletBalance }) => {
    const [dateRange, setDateRange] = useState<{ from: string, till: string } | null>(null);
    const [walletParams, setWalletParams] = useState<{ limit?: number; from?: string; till?: string }>({});

    const { data: walletSummary, refetch: refetchSummary } = useQuery({
        queryKey: ['walletSummary', walletAddress, dateRange, walletParams],
        queryFn: () => getWalletSummary(walletAddress, { params: { ...dateRange, ...walletParams } }),
        initialData: initialWalletSummary,
        enabled: !!dateRange,
    });

    const { data: walletBalance } = useQuery({
        queryKey: ['walletBalance', walletAddress],
        queryFn: () => getWalletBalance(walletAddress),
        initialData: initialWalletBalance,
    });

    useEffect(() => {
        const fetchWalletParams = async () => {
            const params = await getWalletParams(walletAddress, "ethereum"); // Use network as needed
            setWalletParams(params);
        };

        fetchWalletParams();
    }, [walletAddress]);

    useEffect(() => {
        if (dateRange) {
            refetchSummary();
        }
    }, [dateRange, refetchSummary, walletParams]);

    const handleDateChange = (newDateRange: { from: string, till: string }) => {
        setDateRange(newDateRange);
    };

    if (!walletSummary || !walletBalance) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col gap-6 items-center justify-center w-full">
            <WalletOverview
                initialWalletSummary={walletSummary}
                walletBalance={walletBalance}
                walletAddress={walletAddress}
                onDateChange={handleDateChange}
            />
            <WalletDetail
                walletSummary={walletSummary}
                walletBalance={walletBalance}
                walletAddress={walletAddress}
                dateRange={dateRange}
            />
        </div>
    );
};

export default WalletPage;
