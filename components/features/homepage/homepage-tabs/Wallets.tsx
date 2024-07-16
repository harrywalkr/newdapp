'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useTokenChainStore } from "@/store";
import { getWallets } from "@/services/http/wallets.http";
import TableLoading from '@/components/layout/Table-loading';
import WalletsTable from './WalletsTable';
import { Filter } from '@/components/ui/smart-table/FilterDialog';

export default function Wallets() {
    const { selectedChain } = useTokenChainStore();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState<string>('totalScore');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');



    const [rankRange, setRankRange] = useState<[number, number]>([0, 100000]);
    const [winRateRange, setWinRateRange] = useState<[number, number]>([0, 100]);
    const [netProfitRange, setNetProfitRange] = useState<[number, number]>([-500000000, 500000000]);
    const [ageRange, setAgeRange] = useState<[number, number]>([0, 10000]);
    const [label, setLabel] = useState<string>("");
    const [dayActiveRange, setDayActiveRange] = useState<[number, number]>([0, 10000]);
    const [avgHoldingTimeRange, setAvgHoldingTimeRange] = useState<[number, number]>([0, 10000]);
    const [totalScoreRange, setTotalScoreRange] = useState<[number, number]>([0, 1600]);
    const [totalFeeRange, setTotalFeeRange] = useState<[number, number]>([0, 10000]);

    const { data: walletsData, isLoading } = useQuery({
        queryKey: ['wallets', selectedChain.symbol, page, pageSize, sortBy, sortOrder, rankRange, winRateRange, netProfitRange, ageRange, dayActiveRange, avgHoldingTimeRange, totalScoreRange, totalFeeRange],
        queryFn: () => getWallets({
            params: {
                network: selectedChain.symbol,
                page: page,
                limit: pageSize,
                sortBy,
                sortOrder,
                rankMin: rankRange[0],
                rankMax: rankRange[1],
                winRateMin: winRateRange[0],
                winRateMax: winRateRange[1],
                netProfitMin: netProfitRange[0],
                netProfitMax: netProfitRange[1],
                ageMin: ageRange[0],
                ageMax: ageRange[1],
                dayActiveMin: dayActiveRange[0],
                dayActiveMax: dayActiveRange[1],
                avgHoldingTimeMin: avgHoldingTimeRange[0],
                avgHoldingTimeMax: avgHoldingTimeRange[1],
                totalScoreMin: totalScoreRange[0],
                totalScoreMax: totalScoreRange[1],
                totalFeeMin: totalFeeRange[0],
                totalFeeMax: totalFeeRange[1]
            }
        }),
    });

    if (isLoading) {
        return (
            <div>
                <TableLoading />
            </div>
        );
    }

    if (!walletsData) {
        return (
            <div>
                <p>No data available</p>
            </div>
        );
    }

    const filters: Filter[] = [
        {
            name: 'Rank Range',
            type: 'range',
            state: rankRange,
            setState: setRankRange,
            defaultRange: [0, 100],
        },
        {
            name: 'Win Rate Range',
            type: 'range',
            state: winRateRange,
            setState: setWinRateRange,
            defaultRange: [0, 100],
            premium: true
        },
        {
            name: 'Net Profit Range (Million)',
            type: 'range',
            state: netProfitRange,
            setState: setNetProfitRange,
            defaultRange: [0, 100],
        },
        {
            name: 'Age Range',
            type: 'range',
            state: ageRange,
            setState: setAgeRange,
            defaultRange: [0, 100],
        },
        {
            name: 'Label',
            type: 'dropdown',
            state: label,
            setState: setLabel,
            defaultRange: ['Medium Size', 'Large Size', 'Small Size'],
        },
        {
            name: 'Day Active Range',
            type: 'range',
            state: dayActiveRange,
            setState: setDayActiveRange,
            defaultRange: [0, 100],
        },
        {
            name: 'Average Holding Time Range',
            type: 'range',
            state: avgHoldingTimeRange,
            setState: setAvgHoldingTimeRange,
            defaultRange: [0, 100],
        },
        {
            name: 'Total Score Range',
            type: 'range',
            state: totalScoreRange,
            setState: setTotalScoreRange,
            defaultRange: [0, 100],
        },
        {
            name: 'Total Fee Range',
            type: 'range',
            state: totalFeeRange,
            setState: setTotalFeeRange,
            defaultRange: [0, 100],
        },
    ];

    return (
        <div>
            <WalletsTable
                walletsData={walletsData}
                page={page} setPage={setPage}
                pageSize={pageSize} setPageSize={setPageSize}
                sortBy={sortBy} setSortBy={setSortBy}
                sortOrder={sortOrder} setSortOrder={setSortOrder}
                filters={filters}
            />
        </div>
    );
}

