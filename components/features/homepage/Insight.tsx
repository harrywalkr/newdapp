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
import { getAi, getStrengthRatio } from '@/services/http/token.http';
import { IWallet } from '@/types/Wallet.type';
import { separate3digits } from '@/utils/numbers';
import { minifyContract } from '@/utils/truncate';
import clsx from 'clsx';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Label,
} from 'recharts';
import { History } from '@/types/strength-ratio.type';

interface Props {
    wallets: IWallet[];
}

export default function Insight({ wallets }: Props) {
    const { isLoading: isAiLoading, error: aiError, data: ai } = useQuery({
        queryKey: ['ai'],
        queryFn: () => getAi(),
        refetchInterval: 300000,
    });

    const { isLoading: isStrengthRatioLoading, error: strengthRatioError, data: strengthRatio } = useQuery({
        queryKey: ['strength'],
        queryFn: () => getStrengthRatio(),
        refetchInterval: 300000,
    });

    if (aiError || strengthRatioError) return <div>Failed to load data, please try again.</div>;

    if (isAiLoading || isStrengthRatioLoading)
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

    const formattedData = strengthRatio?.history.map((entry: History) => ({
        timestamp: new Date(entry.timestamp).toLocaleDateString(),
        averageMarketStrength: entry.averageMarketStrength,
    }));

    const gradientOffset = () => {
        if (!formattedData) return 0;
        const dataMax = Math.max(...formattedData.map(d => d.averageMarketStrength!));
        const dataMin = Math.min(...formattedData.map(d => d.averageMarketStrength!));
        if (dataMax <= 0) {
            return 0;
        } else if (dataMin >= 0) {
            return 1;
        } else {
            return dataMax / (dataMax - dataMin);
        }
    };

    const off = gradientOffset();

    const renderCustomDot = (props: any) => {
        const { cx, cy, value, index } = props;
        const isLastPoint = index === formattedData!.length - 1;
        return (
            <circle
                cx={cx}
                cy={cy}
                r={0}
                stroke={value >= 0 ? '#86efac' : '#ef4444'}
                strokeWidth={1}
                fill={value >= 0 ? '#86efac' : '#ef4444'}
                className={clsx({ blink: isLastPoint })}
            />
        );
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p>{`Date: ${payload[0].payload.timestamp}`}</p>
                    <p>{`Strength: ${payload[0].value.toFixed(2)}`}</p>
                </div>
            );
        }

        return null;
    };

    const CustomYAxisTick = (props: any) => {
        const { x, y, payload } = props;
        return (
            <text x={x} y={y} fill="rgba(0, 0, 0, 0.5)" textAnchor="end" dominantBaseline="middle">
                {payload.value}
            </text>
        );
    };
    
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
                                    <div className="flex items-start justify-between hover:bg-muted/50 hover:cursor-pointer py-3">
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
                            <ResponsiveContainer width="100%" height={100}>
                                <LineChart data={formattedData}>
                                    <defs>
                                        <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset={off} stopColor="#86efac" />
                                            <stop offset={off} stopColor="#ef4444" />
                                        </linearGradient>
                                    </defs>
                                    <YAxis
                                        interval={2}
                                        tickFormatter={(value) => value.toFixed(2)}
                                        tick={CustomYAxisTick}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line
                                        type="monotone"
                                        dataKey="averageMarketStrength"
                                        stroke="url(#splitColor)"
                                        strokeWidth={1}
                                        dot={renderCustomDot}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                            {
                                strengthRatio?.averageMarketStrength !== undefined &&
                                <div className="text-muted-foreground mt-7">Average Market Strength: {strengthRatio.averageMarketStrength.toFixed(2)}</div>
                            }
                        </CardContent>
                    </Card>
                </div>
            </SectionContent>
        </Section>
    );
}
