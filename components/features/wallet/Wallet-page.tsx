'use client'

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getWalletBalance, getWalletSummary, getWalletParams } from '@/services/http/wallets.http';
import WalletOverview from '@/components/features/wallet/wallet-overview';
import WalletDetail from '@/components/features/wallet/wallet-detail';
import { WalletBalanceType } from '@/types/wallet-balance.type';
import { WalletSummaryType } from '@/types/wallet-summary.type';
import { useTokenChainStore } from '@/store';

interface Props {
    walletAddress: string;
    initialWalletSummary: WalletSummaryType;
    initialWalletBalance: WalletBalanceType;
}

const WalletPage: React.FC<Props> = ({ walletAddress, initialWalletSummary, initialWalletBalance }) => {
    const [dateRange, setDateRange] = useState<{ from: Date, till: Date }>({ from: new Date(), till: new Date() });
    const [walletParams, setWalletParams] = useState<{ limit?: number; from?: Date; till?: Date, network?: string }>({});
    const { selectedChain, availableChains } = useTokenChainStore();

    const { data: walletSummary, refetch: refetchSummary } = useQuery({
        queryKey: ['walletSummary', walletAddress, dateRange, walletParams, selectedChain.symbol],
        queryFn: () => getWalletSummary(walletAddress, { params: { ...dateRange, ...walletParams, network: selectedChain.symbol } }),
        initialData: initialWalletSummary,
        enabled: !!dateRange,
    });

    const { data: walletBalance } = useQuery({
        queryKey: ['walletBalance', walletAddress, selectedChain.symbol],
        queryFn: () => getWalletBalance(walletAddress, { params: { network: selectedChain.symbol } }),
        initialData: initialWalletBalance,
    });

    useEffect(() => {
        const fetchWalletParams = async () => {
            const params = await getWalletParams(walletAddress, { params: { network: selectedChain.symbol } });
            setWalletParams(params);
            setDateRange({ from: params.from!, till: params.till! })
        };
        fetchWalletParams();
    }, [walletAddress, selectedChain]);

    useEffect(() => {
        console.log('hello3')
        if (dateRange) {
            console.log('hello2')
            refetchSummary();
        }
    }, [dateRange, refetchSummary, walletParams, selectedChain]);

    const handleDateChange = (newDateRange: { from: Date, till: Date }) => {
        setDateRange(newDateRange);
    };

    const handleChainChange = (chainSymbol: string) => {
        const selectedChain = availableChains.find(chain => chain.symbol === chainSymbol);
        if (selectedChain) {
            setWalletParams({ ...walletParams, network: chainSymbol });
        }
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
                dateRange={dateRange}
                onDateChange={handleDateChange}
                onChainChange={handleChainChange}
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
