'use client';

import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useTokenChainStore } from "@/store";
import { Balance } from "@/types/swap.type";
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
import useWatchlistStore, { IWatchlistItem } from '@/store/watchlist';
import { imageUrl } from '@/utils/imageUrl';

interface WalletPortfolioHistoryProps {
    images: ImageType[];
    walletAddress: string;
}

const WalletPortfolioHistory: React.FC<WalletPortfolioHistoryProps> = ({ images, walletAddress }) => {
    const { selectedChain } = useTokenChainStore();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [sortBy, setSortBy] = useState<string>('totalScore');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [searchValue, setSearchValue] = useState<string>("");
    const [typeFilter, setTypeFilter] = useState<string>('');
    const [balanceRange, setBalanceRange] = useState<[number, number]>([0, 1000000]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
    const [buyAmountRange, setBuyAmountRange] = useState<[number, number]>([0, 1000000]);
    const [entryPriceRange, setEntryPriceRange] = useState<[number, number]>([0, 1000000]);
    const [sellAmountRange, setSellAmountRange] = useState<[number, number]>([0, 1000000]);
    const [currentValueRange, setCurrentValueRange] = useState<[number, number]>([0, 1000000]);
    const [livePLRange, setLivePLRange] = useState<[number, number]>([0, 1000000]);

    const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlistStore();

    const { data: walletSwaps = [], isLoading } = useQuery({
        queryKey: [
            'walletSwaps', walletAddress, 'category=balance', selectedChain.symbol, page, pageSize, sortBy, sortOrder, searchValue, typeFilter, balanceRange, priceRange, buyAmountRange, entryPriceRange, sellAmountRange, currentValueRange, livePLRange
        ],
        queryFn: () => getWalletSwaps({
            params: {
                address: walletAddress,
                network: selectedChain.symbol,
                category: 'balance',
                page,
                pageSize,
                sortBy,
                sortOrder,
                search: searchValue,
                type: typeFilter,
                balanceMin: balanceRange[0],
                balanceMax: balanceRange[1],
                priceMin: priceRange[0],
                priceMax: priceRange[1],
                buyAmountMin: buyAmountRange[0],
                buyAmountMax: buyAmountRange[1],
                entryPriceMin: entryPriceRange[0],
                entryPriceMax: entryPriceRange[1],
                sellAmountMin: sellAmountRange[0],
                sellAmountMax: sellAmountRange[1],
                currentValueMin: currentValueRange[0],
                currentValueMax: currentValueRange[1],
                livePLMin: livePLRange[0],
                livePLMax: livePLRange[1],
            }
        }),
    });

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

    const columns: ColumnDef<Balance>[] = [
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
            accessorKey: 'Currency Address',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => toggleSorting(column)}>
                    Token
                    {sortBy === 'Currency Address' && sortOrder === 'asc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
                    {sortBy === 'Currency Address' && sortOrder === 'desc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => (
                <div className="flex justify-start gap-2">
                    <Avatar>
                        <AvatarImage src={imageUrl(row.getValue("Currency Address") as string, images)} alt={row.getValue('tokenName') as string} />
                        <AvatarFallback>
                            {row.original.tokenName ? row.original.tokenName.charAt(0) : <AvatarPlaceholder />}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start justify-center">
                        <span className="font-medium">
                            {row.original.tokenName ? minifyTokenName(row.original.tokenName) : 'no name'}
                        </span>
                        <Copy text={minifyContract(row.getValue("Currency Address") as string)} value={row.getValue("Currency Address") as string} />
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'balanceType',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => toggleSorting(column)}>
                    Type
                    {sortBy === 'balanceType' && sortOrder === 'asc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
                    {sortBy === 'balanceType' && sortOrder === 'desc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => (
                <div className={clsx("text-center", (row.getValue('balanceType') as string) === 'Open' ? 'bg-green-200' : 'bg-yellow-200 dark:text-black')}>
                    {row.getValue('balanceType') as string}
                </div>
            ),
        },
        {
            accessorKey: 'Balance',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => toggleSorting(column)}>
                    Balance
                    {sortBy === 'Balance' && sortOrder === 'asc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
                    {sortBy === 'Balance' && sortOrder === 'desc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => separate3digits((row.getValue('Balance') as number).toFixed(2)),
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
            cell: ({ row }) => <PriceFormatter value={row.getValue('tokenPrice') as number || 0} />,
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
            cell: ({ row }) => `$${separate3digits((row.getValue('Buy Amount (USD)') as number).toFixed(2))}`,
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
            cell: ({ row }) => <PriceFormatter value={row.getValue('Entry Price') as number || 0} />,
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
            cell: ({ row }) => `$${separate3digits((row.getValue('Sell Amount (USD)') as number).toFixed(2))}`,
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
            cell: ({ row }) => <PriceFormatter value={row.getValue('currentValue') as number || 0} />,
        },
        {
            accessorKey: 'Profit',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => toggleSorting(column)}>
                    Live P&L
                    {sortBy === 'Profit' && sortOrder === 'asc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
                    {sortBy === 'Profit' && sortOrder === 'desc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => (
                <div className={clsx((row.getValue('Profit') as number) > 0 ? 'text-green-500' : 'text-red-500')}>
                    ${separate3digits((row.getValue('Profit') as number).toFixed(2))}
                </div>
            ),
        },
    ];

    const filters: Filter[] = [
        {
            name: 'Type',
            type: 'dropdown',
            state: typeFilter,
            setState: setTypeFilter,
            defaultRange: ['Open', 'Closed', 'Partially Closed'],
        },
        {
            name: 'Balance Range',
            type: 'range',
            state: balanceRange,
            setState: setBalanceRange,
            defaultRange: [0, 1000000],
        },
        {
            name: 'Price Range',
            type: 'range',
            state: priceRange,
            setState: setPriceRange,
            defaultRange: [0, 1000000],
        },
        {
            name: 'Buy Amount Range',
            type: 'range',
            state: buyAmountRange,
            setState: setBuyAmountRange,
            defaultRange: [0, 1000000],
        },
        {
            name: 'Entry Price Range',
            type: 'range',
            state: entryPriceRange,
            setState: setEntryPriceRange,
            defaultRange: [0, 1000000],
        },
        {
            name: 'Sell Amount Range',
            type: 'range',
            state: sellAmountRange,
            setState: setSellAmountRange,
            defaultRange: [0, 1000000],
        },
        {
            name: 'Current Value Range',
            type: 'range',
            state: currentValueRange,
            setState: setCurrentValueRange,
            defaultRange: [0, 1000000],
        },
        {
            name: 'Live P&L Range',
            type: 'range',
            state: livePLRange,
            setState: setLivePLRange,
            defaultRange: [0, 1000000],
        },
    ];


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

    return (
        <ServerSideSmartTable
            data={walletSwaps as Balance[]}
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

export default WalletPortfolioHistory;
