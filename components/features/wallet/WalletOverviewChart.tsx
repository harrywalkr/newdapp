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
    const [sortBy, setSortBy] = useState<'month' | 'week' | 'year'>('month');

    const getProfitData = (): { name: string, totalProfit: number }[] => {
        const profits = walletSummary.totalProfits ? walletSummary.totalProfits[sortBy] : {};
        const profitData = Object.entries(profits).map(([period, totalProfit]) => ({
            name: period,
            totalProfit: totalProfit as number,
        }));
        return profitData.reverse();
    };

    const data = getProfitData();

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
                    <Area
                        type="monotone"
                        dataKey="totalProfit"
                        stroke="#82ca9d"
                        fill="url(#success)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
