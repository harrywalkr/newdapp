'use client';

import {
    AreaChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    Legend,
} from 'recharts';
import { useState } from 'react';
import { WalletSummaryType } from '@/types/wallet-summary.type';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
    walletSummary: WalletSummaryType,
}

export default function WalletOverviewChart({ walletSummary }: Props) {
    const [sortBy, setSortBy] = useState<'month' | 'week' | 'year'>('month')

    const convertWallet = (sortBy: 'month' | 'week' | 'year'): any[] => {
        const summary: WalletSummaryType = walletSummary;
        const totalBuySellTimes = summary.totalBuySellTimes || { month: {}, week: {}, year: {} };
        const totalBuyAmounts = summary.totalBuyAmounts || { month: {}, week: {}, year: {} };
        const totalSellAmounts = summary.totalSellAmounts || { month: {}, week: {}, year: {} };

        return Object.keys(totalBuySellTimes[sortBy] || {}).map((item: string, index) => {
            return {
                name: index,
                totalBuyAmounts: totalBuyAmounts[sortBy][item] || 0,
                totalSellAmounts: totalSellAmounts[sortBy][item] || 0,
                totalBuySellTimes: totalBuySellTimes[sortBy][item] || 0,
            }
        });
    }

    const data = convertWallet(sortBy);
    const isDataPresent = data.length > 0;
    const firstTotalBuyAmount = isDataPresent ? data[0].totalBuyAmounts : 0;
    const lastTotalSellAmount = isDataPresent ? data[data.length - 1].totalSellAmounts : 0;
    const isBuyAmountLess = firstTotalBuyAmount < lastTotalSellAmount;

    return (
        <div className='w-full h-full'>
            <Select onValueChange={value => setSortBy(value as 'month' | 'week' | 'year')}>
                <SelectTrigger>
                    <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
                </SelectContent>
            </Select>
            <ResponsiveContainer className='mt-2' width="100%" height="100%">
                <AreaChart width={500} height={500} data={data}>
                    <defs>
                        <linearGradient id="error" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="success" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Tooltip />
                    <Area type="monotone" dataKey="totalBuyAmounts" stackId="1"
                        stroke={isBuyAmountLess ? '#4ade80' : '#ef4444'}
                        fill={isBuyAmountLess ? 'url(#success)' : 'url(#error)'}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
