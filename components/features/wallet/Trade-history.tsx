'use client';

import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useTokenChainStore, useWatchlistStore } from "@/store";
import { SwapWallet } from "@/types/swap.type";
import { ImageType } from "@/types/Image.type";
import Copy from "@/components/ui/copy";
import { minifyContract, minifyTokenName } from "@/utils/truncate";
import { Button } from "@/components/ui/button";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage, AvatarPlaceholder } from "@/components/ui/avatar";
import { ServerSideSmartTable } from '@/components/ui/smart-table/ServerSideSmartTable';
import FilterDialog, { Filter } from '@/components/ui/smart-table/FilterDialog';
import PriceFormatter from "@/utils/PriceFormatter";
import { separate3digits } from "@/utils/numbers";
import clsx from 'clsx';
import { ColumnDef } from '@tanstack/react-table';
import { getWalletSwaps } from '@/services/http/wallets.http';
import { getImages } from '@/services/http/image.http';
import { imageUrl } from '@/utils/imageUrl';
import { IWatchlistItem } from '@/store/watchlist';

interface WalletSwapsProps {
    walletAddress: string;
    dateRange: { from?: Date, till?: Date };
}

const TradeHistory: React.FC<WalletSwapsProps> = ({ walletAddress, dateRange }) => {
    const { selectedChain } = useTokenChainStore();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [sortBy, setSortBy] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [searchValue, setSearchValue] = useState<string>("");
    const [buyAmountRange, setBuyAmountRange] = useState<[number, number]>([0, 1000000]);
    const [sellAmountRange, setSellAmountRange] = useState<[number, number]>([0, 1000000]);
    const [profitRange, setProfitRange] = useState<[number, number]>([0, 1000000]);
    const [entryPriceRange, setEntryPriceRange] = useState<[number, number]>([0, 1000000]);
    const [exitPriceRange, setExitPriceRange] = useState<[number, number]>([0, 1000000]);
    const [buyTimesRange, setBuyTimesRange] = useState<[number, number]>([0, 100]);
    const [sellTimesRange, setSellTimesRange] = useState<[number, number]>([0, 100]);
    const [currentValueRange, setCurrentValueRange] = useState<[number, number]>([0, 1000000]);
    const [livePLRange, setLivePLRange] = useState<[number, number]>([0, 1000000]);
    const [statusFilter, setStatusFilter] = useState<string>('All');

    const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlistStore();

    const { data: walletSwaps = [], isLoading } = useQuery({
        queryKey: [
            'swapWallet', walletAddress, 'category=walletSwaps', dateRange, selectedChain.symbol, page, pageSize, sortBy, sortOrder, searchValue, buyAmountRange, sellAmountRange, profitRange, entryPriceRange, exitPriceRange, buyTimesRange, sellTimesRange, currentValueRange, livePLRange, statusFilter
        ],
        queryFn: () => getWalletSwaps({
            params: {
                address: walletAddress,
                network: selectedChain.symbol,
                category: 'swapWallet',
                ...dateRange,
                page,
                pageSize,
                sortBy,
                sortOrder,
                search: searchValue,
                buyAmountMin: buyAmountRange[0],
                buyAmountMax: buyAmountRange[1],
                sellAmountMin: sellAmountRange[0],
                sellAmountMax: sellAmountRange[1],
                profitMin: profitRange[0],
                profitMax: profitRange[1],
                entryPriceMin: entryPriceRange[0],
                entryPriceMax: entryPriceRange[1],
                exitPriceMin: exitPriceRange[0],
                exitPriceMax: exitPriceRange[1],
                buyTimesMin: buyTimesRange[0],
                buyTimesMax: buyTimesRange[1],
                sellTimesMin: sellTimesRange[0],
                sellTimesMax: sellTimesRange[1],
                currentValueMin: currentValueRange[0],
                currentValueMax: currentValueRange[1],
                livePLMin: livePLRange[0],
                livePLMax: livePLRange[1],
                status: statusFilter,
            }
        }),
    });

    const { data: images = [] } = useQuery({
        queryKey: ['images'],
        queryFn: () => getImages({}).then(data => data.imageUrls),
    });

    const toggleSorting = (column: any) => {
        const isSortedAsc = column.getIsSorted() === 'asc';
        const isSortedDesc = column.getIsSorted() === 'desc';

        if (isSortedAsc) {
            setSortOrder('desc');
            column.toggleSorting(true);
        } else if (isSortedDesc) {
            setSortBy('');
            setSortOrder('asc');
            column.clearSorting();
        } else {
            setSortBy(column.id);
            setSortOrder('asc');
            column.toggleSorting(false);
        }
    };

    const handleStarClick = (token: IWatchlistItem) => {
        const isInWatchlist = watchlist.some((w: IWatchlistItem) => w.contractAddress === token.contractAddress);
        if (isInWatchlist) {
            removeFromWatchlist(token.contractAddress);
        } else {
            addToWatchlist(token);
        }
    };

    const isTokenInWatchlist = (token: IWatchlistItem) => {
        return watchlist.some((w: IWatchlistItem) => w.contractAddress === token.contractAddress);
    };

    const columns: ColumnDef<SwapWallet>[] = [
        {
            accessorKey: 'watchlist',
            header: '',
            cell: ({ row }) => (
                <div className="cursor-pointer"
                    onClick={() => handleStarClick({
                        name: row.getValue("tokenName") as string,
                        contractAddress: row.getValue("Currency Address") as string,
                        type: 'token'
                    })}
                >
                    {isTokenInWatchlist({
                        name: row.getValue("tokenName") as string,
                        contractAddress: row.getValue("Currency Address") as string,
                        type: 'token'
                    }) ? <AiFillStar size={20} /> : <AiOutlineStar size={20} />}
                </div>
            ),
        },
        {
            accessorKey: 'token',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => toggleSorting(column)}>
                    Token
                    {sortBy === 'token' && sortOrder === 'asc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
                    {sortBy === 'token' && sortOrder === 'desc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => (
                <div className="flex justify-start gap-2">
                    <Avatar>
                        <AvatarImage src={imageUrl(row.original["Currency Address"], images)} alt={row.original.tokenName || 'N/A'} />
                        <AvatarFallback>{row.original.tokenName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start justify-center">
                        <span className="font-medium">{minifyTokenName(row.original.tokenName)}</span>
                        <Copy text={minifyContract(row.original["Currency Address"])} value={row.original["Currency Address"]} className='text-muted-foreground' />
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'Buy Amount (USD)',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => toggleSorting(column)}>
                    Buy Amount (USD)
                    {sortBy === 'Buy Amount (USD)' && sortOrder === 'asc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
                    {sortBy === 'Buy Amount (USD)' && sortOrder === 'desc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => `$${separate3digits(parseFloat(row.original["Buy Amount (USD)"].toString()).toFixed(2))}`,
        },
        {
            accessorKey: 'Sell Amount (USD)',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => toggleSorting(column)}>
                    Sell Amount (USD)
                    {sortBy === 'Sell Amount (USD)' && sortOrder === 'asc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
                    {sortBy === 'Sell Amount (USD)' && sortOrder === 'desc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => `$${separate3digits(parseFloat(row.original["Sell Amount (USD)"].toString()).toFixed(2))}`,
        },
        {
            accessorKey: 'Profit',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => toggleSorting(column)}>
                    Profit
                    {sortBy === 'Profit' && sortOrder === 'asc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
                    {sortBy === 'Profit' && sortOrder === 'desc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => {
                const profitAmount = parseFloat(row.original["Profit"].toString());
                return <span className={` ${profitAmount > 0 ? "text-success/90" : "text-error/90"}`}>${separate3digits(profitAmount.toFixed(2))}</span>;
            },
        },
        {
            accessorKey: 'Entry Price',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => toggleSorting(column)}>
                    Entry Price
                    {sortBy === 'Entry Price' && sortOrder === 'asc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
                    {sortBy === 'Entry Price' && sortOrder === 'desc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => <PriceFormatter value={row.original["Entry Price"]} />,
        },
        {
            accessorKey: 'Exit Price',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => toggleSorting(column)}>
                    Exit Price
                    {sortBy === 'Exit Price' && sortOrder === 'asc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
                    {sortBy === 'Exit Price' && sortOrder === 'desc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => <PriceFormatter value={row.original["Exit Price"]} />,
        },
        {
            accessorKey: 'Num of Buy Times',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => toggleSorting(column)}>
                    Buy Times
                    {sortBy === 'Num of Buy Times' && sortOrder === 'asc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
                    {sortBy === 'Num of Buy Times' && sortOrder === 'desc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => row.original["Num of Buy Times"] || 0,
        },
        {
            accessorKey: 'Num of Sell Times',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => toggleSorting(column)}>
                    Sell Times
                    {sortBy === 'Num of Sell Times' && sortOrder === 'asc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
                    {sortBy === 'Num of Sell Times' && sortOrder === 'desc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => row.original["Num of Sell Times"] || 0,
        },
        {
            accessorKey: 'currentValue',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => toggleSorting(column)}>
                    Current Value
                    {sortBy === 'currentValue' && sortOrder === 'asc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
                    {sortBy === 'currentValue' && sortOrder === 'desc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => <PriceFormatter value={row.original.currentValue || 0} />,
        },
        {
            accessorKey: 'currentProfit',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => toggleSorting(column)}>
                    Live P&L
                    {sortBy === 'currentProfit' && sortOrder === 'asc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
                    {sortBy === 'currentProfit' && sortOrder === 'desc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => (
                <span className={` ${row.original.currentProfit > 0 ? "text-success" : "text-error"}`}>
                    ${row.original.currentProfit.toFixed(2) || 0}
                </span>
            ),
        },
        {
            accessorKey: 'tokenPrice',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => toggleSorting(column)}>
                    Price
                    {sortBy === 'tokenPrice' && sortOrder === 'asc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
                    {sortBy === 'tokenPrice' && sortOrder === 'desc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => <PriceFormatter value={row.original.tokenPrice || 0} />,
        },
        {
            accessorKey: 'isPartiallyClosed',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => toggleSorting(column)}>
                    Status
                    {sortBy === 'isPartiallyClosed' && sortOrder === 'asc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
                    {sortBy === 'isPartiallyClosed' && sortOrder === 'desc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => (
                <div className={`p-2 rounded-lg ${row.original["isPartiallyClosed"] ? "text-error" : "text-success"}`}>
                    {row.original["isPartiallyClosed"] ? "Partial Closed" : "Fully Closed"}
                </div>
            ),
        },
    ];

    const filters: Filter[] = [
        {
            name: 'Buy Amount (USD)',
            type: 'range',
            state: buyAmountRange,
            setState: setBuyAmountRange,
            defaultRange: [0, 1000000],
        },
        {
            name: 'Sell Amount (USD)',
            type: 'range',
            state: sellAmountRange,
            setState: setSellAmountRange,
            defaultRange: [0, 1000000],
        },
        {
            name: 'Profit',
            type: 'range',
            state: profitRange,
            setState: setProfitRange,
            defaultRange: [0, 1000000],
        },
        {
            name: 'Entry Price',
            type: 'range',
            state: entryPriceRange,
            setState: setEntryPriceRange,
            defaultRange: [0, 1000000],
        },
        {
            name: 'Exit Price',
            type: 'range',
            state: exitPriceRange,
            setState: setExitPriceRange,
            defaultRange: [0, 1000000],
        },
        {
            name: 'Buy Times',
            type: 'range',
            state: buyTimesRange,
            setState: setBuyTimesRange,
            defaultRange: [0, 100],
        },
        {
            name: 'Sell Times',
            type: 'range',
            state: sellTimesRange,
            setState: setSellTimesRange,
            defaultRange: [0, 100],
        },
        {
            name: 'Current Value',
            type: 'range',
            state: currentValueRange,
            setState: setCurrentValueRange,
            defaultRange: [0, 1000000],
        },
        {
            name: 'Live P&L',
            type: 'range',
            state: livePLRange,
            setState: setLivePLRange,
            defaultRange: [0, 1000000],
        },
        {
            name: 'Status',
            type: 'dropdown',
            state: statusFilter,
            setState: setStatusFilter,
            defaultRange: ['All', 'Partial Closed', 'Fully Closed'],
        },
    ];

    return (
        <ServerSideSmartTable
            data={walletSwaps as SwapWallet[]}
            columns={columns}
            page={page}
            pageCount={pageSize}
            setPage={setPage}
            setPageSize={setPageSize}
            setSearchValue={setSearchValue}
            loading={isLoading}
        >
            <FilterDialog filters={filters} />
        </ServerSideSmartTable>
    );
};

export default TradeHistory