'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Copy from '@/components/ui/copy';
import { KeyValue } from '@/components/ui/key-value';
import { WalletBalanceType } from '@/types/wallet-balance.type';
import { WalletSummaryType } from '@/types/wallet-summary.type';
import { separate3digits } from '@/utils/numbers';
import { minifyContract, minifyTokenName } from '@/utils/truncate';
import { useMedia } from 'react-use';
import { AvatarPlaceholder } from '@/components/ui/avatar';
import { DatePicker } from '@/components/ui/date-picker';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import WalletTimelineActivity from './WalletTimelineActivity';
import WalletOverviewChart from './WalletOverviewChart';
import { IoIosWine } from 'react-icons/io';
import { Progress } from '@/components/ui/progress';
import { MdOutlineScoreboard } from 'react-icons/md';
import { useTokenChainStore } from '@/store';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface Props {
    walletAddress: string;
    initialWalletSummary: WalletSummaryType;
    walletBalance: WalletBalanceType;
    dateRange: { from?: Date, till?: Date };
    onDateChange: (newDateRange: { from: Date, till: Date }) => void;
    onChainChange: (chainSymbol: string) => void;
}

export default function WalletOverview({ walletAddress, initialWalletSummary, walletBalance, onDateChange, onChainChange, dateRange }: Props) {
    const isDesktop = useMedia('(min-width: 1024px)');
    const [fromDate, setFromDate] = useState<Date | undefined>(dateRange.from);
    const [toDate, setToDate] = useState<Date>();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const handleDateChange = () => {
        if (fromDate && toDate) {
            onDateChange({
                from: fromDate,
                till: toDate
            });
        }
    };

    useEffect(() => {
        handleDateChange();
    }, [fromDate, toDate]);

    const { availableChains, setSelectedChain, selectedChain } = useTokenChainStore();

    const handleChainChange = (symbol: string) => {
        const chain = availableChains.find(chain => chain.symbol === symbol);
        if (chain) {
            setSelectedChain(chain.id);
            onChainChange(chain.symbol);
            const currentParams = new URLSearchParams(searchParams.toString());
            currentParams.set('network', chain.symbol);
            router.push(`${pathname}?${currentParams.toString()}`);
        }
    };

    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 w-full gap-5'>
            <Card>
                <CardHeader>
                    <CardTitle>Trader Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='top flex flex-col md:flex-row items-start justify-between'>
                        <div className='left flex items-start justify-start gap-4'>
                            <AvatarPlaceholder />
                            <div>
                                <div className='text-sm hidden md:block'>
                                    <Copy text={walletAddress} value={walletAddress} />
                                </div>
                                <div className='text-sm block md:hidden'>
                                    <Copy text={minifyContract(walletAddress)} value={walletAddress} />
                                </div>
                                <div className='flex items-center justify-start gap-3'>
                                    {initialWalletSummary?.transactionMetrics?.walletAge != undefined &&
                                        <KeyValue
                                            title='Age'
                                            value={initialWalletSummary.transactionMetrics.walletAge + ' Days'}
                                            variant='default' />
                                    }
                                    {initialWalletSummary.totalScore &&
                                        <KeyValue
                                            title='Score'
                                            titleIcon={<MdOutlineScoreboard />}
                                            value={initialWalletSummary.totalScore}
                                            variant={initialWalletSummary.totalScore > 1000 ? 'good' : 'bad'} />
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="right mt-3 md:mt-0">
                            {initialWalletSummary.holdingTimeLabel != undefined &&
                                <div>{initialWalletSummary.holdingTimeLabel}</div>
                            }
                        </div>
                    </div>
                    <div className='bottom'>
                        <WalletTimelineActivity walletSummary={initialWalletSummary} />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col md:flex-row items-start justify-between gap-5 md:gap-5'>
                    <div className="left flex flex-1 flex-col gap-2">
                        {initialWalletSummary.netProfit != undefined &&
                            <KeyValue
                                title='Net Profit'
                                value={
                                    separate3digits(initialWalletSummary.netProfit?.toFixed(2)) + '$'
                                }
                                variant={
                                    initialWalletSummary.netProfit > 0
                                        ? "good"
                                        : "bad"
                                } />
                        }
                        {initialWalletSummary.overallAverageHoldingTimeAndProfit?.HoldingTime != undefined &&
                            <KeyValue
                                title='Avg Holding Time'
                                value={initialWalletSummary.overallAverageHoldingTimeAndProfit?.HoldingTime}
                                variant='default' />
                        }
                        {initialWalletSummary?.highestProfit && initialWalletSummary.highestProfit[1] != undefined &&
                            initialWalletSummary.highestProfit[0] != undefined &&
                            <KeyValue
                                title="Highest Profit"
                                value={minifyTokenName(initialWalletSummary.highestProfit[1]) + ' : $' + separate3digits(initialWalletSummary.highestProfit[0]?.toFixed(2))}
                                valueIcon={<Copy value={initialWalletSummary.highestProfit[2]} />}
                                variant="default"
                            />
                        }
                        {initialWalletSummary.overallAverageHoldingTimeAndProfit?.Profit != undefined &&
                            <KeyValue
                                symbol='dollar'
                                title="Avg P&L"
                                value={
                                    separate3digits(
                                        initialWalletSummary.overallAverageHoldingTimeAndProfit.Profit?.toFixed(2)
                                    )
                                }
                                variant="default"
                            />
                        }
                        {initialWalletSummary.winRate != undefined &&
                            <div>
                                <KeyValue
                                    title='Winrate'
                                    className='mt-1'
                                    titleIcon={<IoIosWine />}
                                    value={(+initialWalletSummary.winRate / 10).toFixed(2)}
                                    variant='default' />
                                <Progress className='mt-2' value={+initialWalletSummary.winRate} />
                            </div>
                        }
                        <div className="mt-4 flex items-center justify-start gap-4">
                            <DatePicker label="From Date" selectedDate={fromDate} onSelect={setFromDate} />
                            <DatePicker label="To Date" selectedDate={toDate} onSelect={setToDate} />
                            <Select value={selectedChain.symbol} onValueChange={handleChainChange}>
                                <SelectTrigger className="w-44">
                                    <SelectValue placeholder="Select Chain" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableChains.map((chain) => (
                                        <SelectItem key={chain.id} value={chain.symbol}>
                                            {chain.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="right h-32 flex-1 my-10 md:mt-0 w-full ">
                        <WalletOverviewChart walletSummary={initialWalletSummary} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
