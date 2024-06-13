'use client'
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Section,
    SectionContent,
    SectionDescription,
    SectionHeader,
    SectionTitle,
} from '@/components/layout/Section';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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


interface Props {
    wallets: IWallet[];
}

export default function Insight({ wallets }: Props) {
    const { isLoading: isAiLoading, error: aiError, data: ai } = useQuery({
        queryKey: ['ai'],
        queryFn: () => getAi(),
        refetchInterval: 300000,
    });

    if (aiError) return <div>Failed to load data, please try again.</div>;

    if (isAiLoading)
        return (
            <Section variant="vertical">
                <SectionHeader variant="vertical">
                    <SectionTitle>Insights & Analytics</SectionTitle>
                    <SectionDescription>
                        Transform data into actionable intelligence for smarter decisions and strategic growth.
                    </SectionDescription>
                </SectionHeader>
                <SectionContent variant="vertical">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        {Array(3)
                            .fill(true)
                            .map((_, id) => (
                                <Card
                                    key={id}
                                    className="w-full relative overflow-hidden flex flex-col justify-center gap-1 p-4"
                                >
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
        );

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
                            <CardTitle>Smart Money</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {wallets.map((wallet, i) => (
                                <React.Fragment key={wallet.walletAddress}>
                                    <div className="flex items-start justify-between hover:bg-muted/50 rounded-md hover:cursor-pointer py-3">
                                        <Avatar>
                                            <AvatarFallback>{i + 1}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col items-start justify-center gap-2">
                                            <Copy
                                                className="text-muted-foreground"
                                                href={`/wallet/${wallet.walletAddress}`}
                                                text={minifyContract(wallet.walletAddress)}
                                                value={wallet.walletAddress}
                                            />
                                            <span
                                                className={clsx(
                                                    'text-base-content whitespace-nowrap leading-none',
                                                    wallet.netProfit > 0 ? 'text-success' : 'text-red-300'
                                                )}
                                            >
                                                {separate3digits(wallet.netProfit.toFixed(2))}
                                            </span>
                                        </div>
                                        <span>{Math.ceil(wallet.winRate / 10)}/10</span>
                                    </div>
                                    {i !== wallets.length - 1 && <Separator />}
                                </React.Fragment>
                            ))}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Ai Trend Detector</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <span>{ai?.trend}</span>
                            <div className="mt-5 text-muted-foreground">{ai?.categoryTrend}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Strength Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <StrengthAnalysis />
                        </CardContent>
                    </Card>
                </div>
            </SectionContent>
        </Section>
    );
}
