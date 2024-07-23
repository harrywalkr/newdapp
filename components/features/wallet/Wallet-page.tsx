'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getWalletBalance, getWalletSummary, getWalletParams } from '@/services/http/wallets.http';
import WalletOverview from '@/components/features/wallet/wallet-overview';
import WalletDetail from '@/components/features/wallet/wallet-detail';
import { WalletBalanceType } from '@/types/wallet-balance.type';
import { WalletSummaryType } from '@/types/wallet-summary.type';
import { useLoadingStore, useTokenChainStore } from '@/store';
import { useSearchParams } from 'next/navigation';

interface Props {
    walletAddress: string;
    initialWalletSummary: WalletSummaryType;
    initialWalletBalance: WalletBalanceType;
    chain: string;
}

const WalletPage: React.FC<Props> = ({ walletAddress, initialWalletSummary, initialWalletBalance, chain }) => {
    const [dateRange, setDateRange] = useState<{ from?: Date; till?: Date }>({});
    const [walletParams, setWalletParams] = useState<{ limit?: number; from?: Date; till?: Date; network?: string }>({});
    const { selectedChain, availableChains, setSelectedChain } = useTokenChainStore();
    const searchParams = useSearchParams();
    const setLoading = useLoadingStore((state) => state.setLoading);

    useEffect(() => {
        setLoading(false);
    }, [setLoading]);

    useEffect(() => {
        const network = searchParams.get('network') || availableChains[0]?.symbol;
        if (network) {
            const chain = availableChains.find((chain) => chain.symbol === network);
            if (chain) {
                setSelectedChain(chain.id);
                setWalletParams((params) => ({ ...params, network }));
            }
        }
    }, [availableChains, searchParams, setSelectedChain]);

    const { data: walletSummary, refetch: refetchSummary } = useQuery({
        queryKey: ['walletSummary', walletAddress, dateRange, walletParams],
        queryFn: () => getWalletSummary(walletAddress, { params: { ...dateRange, ...walletParams, network: chain } }),
        initialData: initialWalletSummary,
        enabled: !!dateRange,
    });

    const { data: walletBalance } = useQuery({
        queryKey: ['walletBalance', walletAddress, selectedChain.symbol],
        queryFn: () => getWalletBalance(walletAddress, { params: { network: chain } }),
        initialData: initialWalletBalance,
    });

    useEffect(() => {
        const fetchWalletParams = async () => {
            const params = await getWalletParams(walletAddress, { params: { network: chain } });
            setWalletParams(params);
            setDateRange({ from: params.from!, till: params.till! });
        };
        fetchWalletParams();
    }, [walletAddress, selectedChain]);

    useEffect(() => {
        if (dateRange) {
            refetchSummary();
        }
    }, [dateRange, refetchSummary, walletParams, selectedChain]);

    const handleDateChange = (newDateRange: { from: Date; till: Date }) => {
        setDateRange(newDateRange);
    };

    const handleChainChange = (chainSymbol: string) => {
        const selectedChain = availableChains.find((chain) => chain.symbol === chainSymbol);
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
                walletSummary={walletSummary}
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
