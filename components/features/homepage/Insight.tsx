'use client'
import { Section, SectionContent, SectionDescription, SectionHeader, SectionTitle } from '@/components/layout/Section';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import Copy from '@/components/ui/copy';
import { Skeleton } from '@/components/ui/skeleton';
import { getAi } from '@/services/http/token.http';
import { IWallet } from '@/types/Wallet.type'
import { IAI } from '@/types/token.type';
import { separate3digits } from '@/utils/numbers';
import { minifyContract } from '@/utils/truncate';
import { CardHeader } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import React from 'react'

interface Props {
    wallets: IWallet[]
}

export default function Insight({ wallets }: Props) {
    const {
        isLoading,
        error,
        data: ai,
    } = useQuery(
        {
            queryKey: ["ai"],
            queryFn: () => getAi(),
            refetchInterval: 300000
        }
    )

    if (error) return <div>Failed to load ai trends, please try again.</div>;
    if (isLoading) return <Section>
        <SectionHeader>
            <SectionTitle>Insights & Analytics</SectionTitle>
            <SectionDescription>
                Transform data into actionable intelligence for smarter decisions and strategic growth.
            </SectionDescription>
        </SectionHeader>
        <SectionContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {Array(3).fill(true).map((data: any, id: number) => (
                    <Card key={id} className="w-full relative overflow-hidden flex flex-col justify-center gap-1 p-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-[210px]" />
                        </div>
                        <div className="space-y-2 mt-5">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-[210px]" />
                        </div>
                    </Card>
                ))}
            </div>
        </SectionContent>
    </Section>

    return (
        <Section>
            <SectionHeader>
                <SectionTitle>Insight & Analytics</SectionTitle>
                <SectionDescription>
                    Transform data into actionable intelligence for smarter decisions and strategic growth.
                </SectionDescription>
            </SectionHeader>
            <SectionContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <Card className="w-full relative overflow-hidden flex flex-col justify-center gap-1 p-4">
                        <CardHeader>
                            <CardTitle>Smart Money</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {
                                wallets.map((wallet: IWallet) => (
                                    <div key={wallet.walletAddress} className='flex items-center justify-between mb-4'>
                                        <Copy className='text-muted-foreground'
                                            href={`/wallet/${wallet.walletAddress}`}
                                            text={minifyContract(wallet.walletAddress)}
                                            value={wallet.walletAddress} />
                                        <span className={clsx('text-base-content whitespace-nowrap', wallet.netProfit > 0 ? "text-green-300" : "text-red-300")}>
                                            {separate3digits(wallet.netProfit.toFixed(2))}
                                        </span>
                                        <span>{Math.ceil(wallet.winRate / 10)}/10</span>
                                    </div>)
                                )
                            }
                        </CardContent>
                    </Card>
                    <Card className="w-full relative overflow-hidden flex flex-col justify-center gap-1 p-4">
                        <CardHeader>
                            <CardTitle>Ai Trend Detector</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {ai?.importantTokens.map((item: string) => (
                                <div key={item} className='mb-2 pb-2 border-b'>
                                    {item}
                                </div>)
                            )}
                        </CardContent>
                    </Card>
                    <Card className="w-full relative overflow-hidden flex flex-col justify-center gap-1 p-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-[210px]" />
                        </div>
                        <div className="space-y-2 mt-5">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-[210px]" />
                        </div>
                    </Card>
                </div>
            </SectionContent>
        </Section >
    )
}