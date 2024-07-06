'use client'
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Section,
    SectionContent,
    SectionDescription,
    SectionHeader,
    SectionTitle,
} from '@/components/layout/Section';
import { AvatarPlaceholder } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Copy from '@/components/ui/copy';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { getAi } from '@/services/http/token.http';
import { IWallet } from '@/types/Wallet.type';
import { separate3digits } from '@/utils/numbers';
import { minifyContract } from '@/utils/truncate';
import clsx from 'clsx';
import StrengthAnalysis from './StrengthAnalysis';
import { KeyValue } from '@/components/ui/key-value';
import { RiMedal2Fill } from 'react-icons/ri';
import { Progress } from '@/components/ui/progress';
import { FaSackDollar } from 'react-icons/fa6';
import { useTokenChainStore } from '@/store';
import { getWallets } from '@/services/http/wallets.http';
import { useRouter } from 'next/navigation';



export default function Insight() {
    const { selectedChain } = useTokenChainStore();
    const router = useRouter()

    // Query to fetch AI data
    const { isLoading: isAiLoading, error: aiError, data: ai } = useQuery({
        queryKey: ['ai'],
        queryFn: () => getAi(),
        refetchInterval: 300000,
    });

    const {
        isLoading: isWalletsLoading,
        error: walletsError,
        data: walletsData,
        refetch: refetchWallets
    } = useQuery({
        queryKey: ['wallets', selectedChain.symbol, 1, 10],
        queryFn: () => getWallets({
            params: {
                "network": selectedChain.symbol,
                "page": 1,
                "limit": 10
            },
        }),
        staleTime: 60000,
    });

    // Refetch wallets data when selectedChain changes
    useEffect(() => {
        refetchWallets();
    }, [selectedChain, refetchWallets]);

    if (aiError || walletsError) return <div>Failed to load data, please try again.</div>;

    return (
        <Section variant="vertical">
            <SectionHeader variant="vertical">
                <SectionTitle>Insight & Analytics</SectionTitle>
                <SectionDescription>
                    Transform data into actionable intelligence for smarter decisions and strategic growth.
                </SectionDescription>
            </SectionHeader>
            <SectionContent variant="vertical">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
                    <Card>
                        <CardHeader>
                            <CardTitle>Trending Traders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {
                                isWalletsLoading ? (
                                    <div className="w-full relative overflow-hidden flex flex-col justify-center gap-1 p-4">
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-[210px]" />
                                        </div>
                                        <div className="space-y-2 mt-5">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-[210px]" />
                                        </div>
                                    </div>)
                                    : walletsData?.slice(0, 3).map((wallet: IWallet, i: number) => (
                                        <React.Fragment key={wallet.walletAddress}>
                                            <div
                                                className="flex items-start justify-between hover:bg-muted/50 rounded-md hover:cursor-pointer py-3"
                                                onClick={() => router.push(`/wallet/${wallet.walletAddress}`)}
                                            >
                                                <div className='flex items-center justify-start gap-5'>
                                                    <AvatarPlaceholder />
                                                    <div className="flex flex-col items-start justify-center gap-2">
                                                        <Copy
                                                            className="text-muted-foreground"
                                                            href={`/wallet/${wallet.walletAddress}`}
                                                            text={minifyContract(wallet.walletAddress)}
                                                            value={wallet.walletAddress}
                                                        />
                                                        <div className='flex items-center justify-start gap-2'>
                                                            <span className='text-muted-foreground text-sm'>
                                                                <FaSackDollar />
                                                            </span>
                                                            <span
                                                                className={clsx(
                                                                    'text-base-content font-semibold whitespace-nowrap leading-none',
                                                                    wallet.netProfit > 0 ? 'text-success' : 'text-red-300'
                                                                )}
                                                            >
                                                                +{separate3digits(wallet.netProfit.toFixed(0))}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <KeyValue
                                                        title='Winrate'
                                                        titleIcon={<RiMedal2Fill />}
                                                        className='text-sm'
                                                        value={`${Math.ceil((wallet.winRate / 100) * 100)}%`}
                                                        variant='default' />
                                                    <Progress className='mt-2' value={+wallet.winRate} />
                                                </div>

                                            </div>
                                            {i !== walletsData.length - 1 && <Separator />}
                                        </React.Fragment>
                                    ))}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Ai Trend Detector</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {
                                isAiLoading ? (
                                    <div className="w-full relative overflow-hidden flex flex-col justify-center gap-1 p-4">
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-[210px]" />
                                        </div>
                                        <div className="space-y-2 mt-5">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-[210px]" />
                                        </div>
                                    </div>)
                                    :
                                    <>
                                        <span>{ai?.trend}</span>
                                        <div className="mt-5 text-muted-foreground">{ai?.categoryTrend}</div>
                                    </>
                            }
                        </CardContent>
                    </Card>
                    <Card>
                        {
                            isAiLoading ? (
                                <div className="w-full relative overflow-hidden flex flex-col justify-center gap-1 p-4">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-[210px]" />
                                    </div>
                                    <div className="space-y-2 mt-5">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-[210px]" />
                                    </div>
                                </div>)
                                :
                                <>
                                    <StrengthAnalysis />
                                </>
                        }
                    </Card>
                </div>
            </SectionContent>
        </Section >
    );
}
