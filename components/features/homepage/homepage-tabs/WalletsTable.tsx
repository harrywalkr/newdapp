'use client';

import React, { useState, useEffect } from 'react';
import { Column, ColumnDef } from "@tanstack/react-table";
import useWatchlistStore, { IWatchlistItem } from "@/store/watchlist";
import { IWallet, HotTokenHolder } from "@/types/Wallet.type";
import Copy from "@/components/ui/copy";
import { minifyContract } from "@/utils/truncate";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icon";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import clsx from 'clsx';
import { AvatarPlaceholder } from '@/components/ui/avatar';
import { ServerSideSmartTable } from '@/components/ui/smart-table/ServerSideSmartTable';
import { useTokenChainStore } from '@/store';
import FilterDialog, { Filter } from '@/components/ui/smart-table/FilterDialog';

interface WalletsTableProps {
    walletsData: IWallet[];
    page: number;
    setPage: (page: number) => void;
    pageSize: number;
    setPageSize: (size: number) => void;
    sortBy: string;
    setSortBy: (sortBy: string) => void;
    sortOrder: 'asc' | 'desc';
    setSortOrder: (sortOrder: 'asc' | 'desc') => void;
    filters: Filter[];
}

const WalletsTable: React.FC<WalletsTableProps> = ({
    walletsData,
    page, setPage,
    pageSize, setPageSize,
    sortBy, setSortBy,
    sortOrder, setSortOrder,
    filters
}) => {
    const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlistStore();

    const { selectedChain } = useTokenChainStore();

    const [filteredData, setFilteredData] = useState<IWallet[]>(walletsData);

    useEffect(() => {
        setFilteredData(walletsData);
    }, [walletsData]);

    const handleStarClick = (wallet: IWatchlistItem) => {
        const isInWatchlist = watchlist.some((w: IWatchlistItem) => w.contractAddress === wallet.contractAddress);
        if (isInWatchlist) {
            removeFromWatchlist(wallet.contractAddress);
        } else {
            addToWatchlist(wallet);
        }
    };

    const isTokenInWatchlist = (wallet: IWatchlistItem) => {
        return watchlist.some((w: IWatchlistItem) => w.contractAddress === wallet.contractAddress);
    };

    const toggleSorting = (column: Column<IWallet, unknown>) => {
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

    const columns: ColumnDef<IWallet>[] = [
        {
            accessorKey: 'watchlist',
            header: '',
            cell: ({ row }) => (
                <div className="cursor-pointer"
                    onClick={() => handleStarClick({
                        name: row.getValue("walletAddress") as string,
                        contractAddress: row.getValue("walletAddress") as string,
                        type: 'wallet'
                    })}
                >
                    {isTokenInWatchlist({
                        name: row.getValue("walletAddress") as string,
                        contractAddress: row.getValue("walletAddress") as string,
                        type: 'wallet'
                    }) ? <AiFillStar size={20} /> : <AiOutlineStar size={20} />}
                </div>
            ),
        },
        {
            accessorKey: 'rank',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => toggleSorting(column)}
                    className='!px-1'
                >
                    #
                    {sortBy === 'rank' && sortOrder === 'asc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
                    {sortBy === 'rank' && sortOrder === 'desc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
                    {sortBy !== 'rank' && <Icons.sort className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => (
                <div className="text-center cursor-pointer" >
                    {row.getValue("rank")}
                </div>
            ),
        },
        {
            accessorKey: 'walletAddress',
            header: 'Wallet Address',
            cell: ({ row }) => (
                <div className='flex items-center justify-start gap-2'>
                    <AvatarPlaceholder className='w-8 h-8' />
                    <Copy
                        href={`/wallet/${row.getValue("walletAddress")}?network=${selectedChain.symbol}`}
                        text={minifyContract(row.getValue("walletAddress") as string)}
                        value={row.getValue("walletAddress") as string}
                    />
                </div>
            ),
        },
        {
            accessorKey: 'netProfit',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => toggleSorting(column)}
                >
                    P&L
                    {sortBy === 'netProfit' && sortOrder === 'asc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
                    {sortBy === 'netProfit' && sortOrder === 'desc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
                    {sortBy !== 'netProfit' && <Icons.sort className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => (
                <div className={clsx('px-5', {
                    'text-success': Number(row.getValue('netProfit')) > 0,
                    'text-red-300': Number(row.getValue('netProfit')) <= 0
                })}>
                    ${Number(row.getValue('netProfit')).toFixed(2)}
                </div>
            ),
        },
        {
            accessorKey: 'totalScore',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => toggleSorting(column)}
                >
                    Total Score
                    {sortBy === 'totalScore' && sortOrder === 'asc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
                    {sortBy === 'totalScore' && sortOrder === 'desc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
                    {sortBy !== 'totalScore' && <Icons.sort className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => (
                <div className="text-center">
                    {row.getValue('totalScore')}
                </div>
            ),
        },
        {
            accessorKey: 'buyAmountLabel',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => toggleSorting(column)}
                >
                    Label
                    {sortBy === 'buyAmountLabel' && sortOrder === 'asc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
                    {sortBy === 'buyAmountLabel' && sortOrder === 'desc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
                    {sortBy !== 'buyAmountLabel' && <Icons.sort className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => (
                <div className="px-5 whitespace-nowrap text-center">
                    {row.getValue('buyAmountLabel')}
                </div>
            ),
        },
        {
            accessorKey: 'winRate',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => toggleSorting(column)}
                >
                    WinRate
                    {sortBy === 'winRate' && sortOrder === 'asc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
                    {sortBy === 'winRate' && sortOrder === 'desc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
                    {sortBy !== 'winRate' && <Icons.sort className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => (
                <div className="text-center">
                    {`${Math.ceil((row.getValue('winRate') as number / 100) * 100)}%`}
                </div>
            ),
        },
        {
            accessorKey: 'firstTopTokenHolder',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => toggleSorting(column)}
                >
                    First Top Token Holder
                    {sortBy === 'firstTopTokenHolder' && sortOrder === 'asc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
                    {sortBy === 'firstTopTokenHolder' && sortOrder === 'desc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
                    {sortBy !== 'firstTopTokenHolder' && <Icons.sort className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => {
                const firstTopTokenHolder = row.getValue('firstTopTokenHolder') as { tokenName: string;["Currency Address"]: string; };
                const hotTokenHolders = row.getValue('HotTokenHolders') as HotTokenHolder[];

                return (
                    <div className="flex space-x-2 items-center justify-center gap-2 px-5 text-orange-300">
                        <div className="flex flex-col gap-2"></div>
                        {firstTopTokenHolder.tokenName
                            ? firstTopTokenHolder.tokenName !== "-" &&
                            firstTopTokenHolder["Currency Address"] && (
                                <Copy
                                    text={
                                        firstTopTokenHolder.tokenName !== "-"
                                            ? firstTopTokenHolder.tokenName
                                            : "-"
                                    }
                                    value={firstTopTokenHolder["Currency Address"]}
                                    href={`/tokens/${selectedChain.symbol.toLowerCase()}/${firstTopTokenHolder["Currency Address"]}`}
                                />
                            )
                            :
                            hotTokenHolders &&
                            hotTokenHolders.length > 0 &&
                            hotTokenHolders[0]?.tokenName &&
                            hotTokenHolders[0]?.["Currency Address"] && (
                                <Copy
                                    text={
                                        firstTopTokenHolder.tokenName !== "-"
                                            ? firstTopTokenHolder.tokenName
                                            : "-"
                                    }
                                    href={`/tokens/${selectedChain.symbol.toLowerCase()}/${hotTokenHolders[0]["Currency Address"]}`}
                                    value={hotTokenHolders[0]["Currency Address"]}
                                />
                            )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'avgHoldingTime',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => toggleSorting(column)}
                >
                    Avg Pos Duration
                    {sortBy === 'avgHoldingTime' && sortOrder === 'asc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
                    {sortBy === 'avgHoldingTime' && sortOrder === 'desc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
                    {sortBy !== 'avgHoldingTime' && <Icons.sort className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => (
                <div className="px-5 text-center">
                    {Math.ceil(row.getValue('avgHoldingTime')) || 0} D
                </div>
            ),
        },
        {
            accessorKey: 'age',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => toggleSorting(column)}
                >
                    Age
                    {sortBy === 'age' && sortOrder === 'asc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
                    {sortBy === 'age' && sortOrder === 'desc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
                    {sortBy !== 'age' && <Icons.sort className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => (
                <div className="px-5">
                    {row.getValue('age')}
                </div>
            ),
        },
        {
            accessorKey: 'TotalFee',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => toggleSorting(column)}
                >
                    Total Fee (eth)
                    {sortBy === 'TotalFee' && sortOrder === 'asc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
                    {sortBy === 'TotalFee' && sortOrder === 'desc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
                    {sortBy !== 'TotalFee' && <Icons.sort className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => (
                <div className="px-5 text-center">
                    {Number(row.getValue('TotalFee')).toFixed(2)}
                </div>
            ),
        },
        {
            accessorKey: 'dextrader',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => toggleSorting(column)}
                >
                    Dex Trader
                    {sortBy === 'dextrader' && sortOrder === 'asc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
                    {sortBy === 'dextrader' && sortOrder === 'desc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
                    {sortBy !== 'dextrader' && <Icons.sort className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => (
                <div className="text-center">
                    {row.getValue('details') === 'Dex Trader' ? 'yes' : 'no'}
                </div>
            ),
        },
        {
            accessorKey: 'notClosedPositions',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => toggleSorting(column)}
                >
                    Not Closed
                    {sortBy === 'notClosedPositions' && sortOrder === 'asc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
                    {sortBy === 'notClosedPositions' && sortOrder === 'desc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
                    {sortBy !== 'notClosedPositions' && <Icons.sort className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => (
                <div className="text-center">
                    {row.original.totalNumofFullyOpenedData}
                </div>
            ),
        },
        {
            accessorKey: 'totalTransactions',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => toggleSorting(column)}
                >
                    Total Transactions
                    {sortBy === 'totalTransactions' && sortOrder === 'asc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
                    {sortBy === 'totalTransactions' && sortOrder === 'desc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
                    {sortBy !== 'totalTransactions' && <Icons.sort className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => (
                <div className="text-center">
                    {row.getValue('totalTransactions')}
                </div>
            ),
        },
        {
            accessorKey: 'dayActive',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => toggleSorting(column)}
                >
                    Active Days
                    {sortBy === 'dayActive' && sortOrder === 'asc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
                    {sortBy === 'dayActive' && sortOrder === 'desc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
                    {sortBy !== 'dayActive' && <Icons.sort className="ml-2 h-4 w-4" />}
                </Button >
            ),
            cell: ({ row }) => (
                <div className="text-center">
                    {row.getValue('dayActive')}
                </div>
            ),
        },
    ];

    return (
        <ServerSideSmartTable
            data={filteredData}
            columns={columns}
            searchColumnAccessorKey='walletAddress'
            page={page}
            pageCount={pageSize}
            setPage={setPage}
            setPageSize={setPageSize}
        >
            <FilterDialog filters={filters} />
        </ServerSideSmartTable>
    );
};

export default WalletsTable;
