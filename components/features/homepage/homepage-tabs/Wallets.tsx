import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useTokenChainStore } from "@/store";
import { getWallets } from "@/services/http/wallets.http";
import WalletsTable from './WalletsTable';
import { Filter } from '@/components/ui/smart-table/FilterDialog';
import { format } from 'date-fns';

export default function Wallets() {
    const { selectedChain } = useTokenChainStore();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState<string>('totalScore');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [searchValue, setSearchValue] = useState<string>("");

    const [rankRange, setRankRange] = useState<[number, number]>([0, 100000]);
    const [winRateRange, setWinRateRange] = useState<[number, number]>([0, 100]);
    const [netProfitRange, setNetProfitRange] = useState<[number, number]>([-500000000, 500000000]);
    const [ageRange, setAgeRange] = useState<[number, number]>([0, 10000]);
    const [label, setLabel] = useState<string>("");
    const [dayActiveRange, setDayActiveRange] = useState<[number, number]>([0, 10000]);
    const [avgHoldingTimeRange, setAvgHoldingTimeRange] = useState<[number, number]>([0, 10000]);
    const [totalScoreRange, setTotalScoreRange] = useState<[number, number]>([0, 1600]);
    const [totalFeeRange, setTotalFeeRange] = useState<[number, number]>([0, 10000]);
    const [dateRange, setDateRange] = useState<{ from: Date | undefined, to: Date | undefined }>({ from: undefined, to: undefined });

    const { data: walletsData = [], isLoading } = useQuery({
        queryKey: [
            'wallets', selectedChain.symbol, page, pageSize, sortBy, sortOrder,
            rankRange, winRateRange, netProfitRange, ageRange, dayActiveRange,
            avgHoldingTimeRange, totalScoreRange, totalFeeRange, searchValue, dateRange
        ],
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
                totalFeeMax: totalFeeRange[1],
                search: searchValue,
                SwapTimeFrom: dateRange.from ? format(dateRange.from, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'") : undefined,
                SwapTimeTill: dateRange.to ? format(dateRange.to, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'") : undefined,
            }
        }),
    });

    const filters: Filter[] = [
        {
            name: 'Rank Range',
            type: 'range',
            state: rankRange,
            setState: setRankRange,
            defaultRange: [0, 100000],
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
            name: 'Net Profit Range',
            type: 'range',
            state: netProfitRange,
            setState: setNetProfitRange,
            defaultRange: [-500000000, 500000000],
        },
        {
            name: 'Age Range',
            type: 'range',
            state: ageRange,
            setState: setAgeRange,
            defaultRange: [0, 10000],
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
            defaultRange: [0, 10000],
        },
        {
            name: 'Average Holding Time Range',
            type: 'range',
            state: avgHoldingTimeRange,
            setState: setAvgHoldingTimeRange,
            defaultRange: [0, 10000],
        },
        {
            name: 'Total Score Range',
            type: 'range',
            state: totalScoreRange,
            setState: setTotalScoreRange,
            defaultRange: [0, 1600],
        },
        {
            name: 'Total Fee Range',
            type: 'range',
            state: totalFeeRange,
            setState: setTotalFeeRange,
            defaultRange: [0, 10000],
        },
        {
            name: 'Date Range',
            type: 'date-range',
            state: dateRange,
            setState: setDateRange,
        },
    ];

    return (
        <WalletsTable
            walletsData={walletsData}
            page={page} setPage={setPage}
            pageSize={pageSize} setPageSize={setPageSize}
            sortBy={sortBy} setSortBy={setSortBy}
            sortOrder={sortOrder} setSortOrder={setSortOrder}
            searchValue={searchValue} setSearchValue={setSearchValue}
            filters={filters}
            loading={isLoading}
        />
    );
}
