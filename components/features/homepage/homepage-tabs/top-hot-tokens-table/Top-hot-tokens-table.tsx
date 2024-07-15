'use client'

import React, { useState } from 'react';
import { ColumnDef, Row } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { imageUrl } from "@/utils/imageUrl";
import Link from "next/link";
import Copy from "@/components/ui/copy";
import { minifyContract, minifyTokenName } from "@/utils/truncate";
import clsx from "clsx";
import dayjs from "dayjs";
import PriceFormatter from "@/utils/PriceFormatter";
import { formatCash } from "@/utils/numbers";
import { useTokenChainStore, useWatchlistStore } from "@/store";
import { ImageType } from "@/types/Image.type";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, ArrowDownIcon } from "@radix-ui/react-icons";
import { Icons } from "@/components/ui/icon";
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { IWatchlistItem } from '@/store/watchlist';
import { ITokenDetail } from '@/types/TokenDetail.type';
import { ClientSideSmartTable } from '@/components/ui/smart-table/ClientSideSmartTable';
import TopHotTokensFilterDialog from './Top-hot-tokens-filter';

interface Props {
    images: ImageType[];
    initTokenData: ITokenDetail[];
}

const getRange = (data: ITokenDetail[], key: keyof ITokenDetail['attributes']): [number, number] => {
    const values = data.map(token => parseFloat(token.attributes[key] || "0"));
    return [Math.min(...values), Math.max(...values)];
};

const getVolumeRange = (data: ITokenDetail[]): [number, number] => {
    const values = data.map(token => parseFloat(token.attributes.volume_usd.h24 || "0"));
    return [Math.min(...values), Math.max(...values)];
};

export default function TopHotTokensTable({ images, initTokenData }: Props) {
    const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlistStore();
    const { selectedChain } = useTokenChainStore();

    const priceRange = getRange(initTokenData, 'price_usd');
    const volumeRange = getVolumeRange(initTokenData);
    const liquidityRange = getRange(initTokenData, 'total_reserve_in_usd');
    const priceChange24hRange: [number, number] = [-100, 100]; // Placeholder values, should be updated if real data is available

    const [priceRangeState, setPriceRange] = useState<[number, number]>(priceRange);
    const [volumeRangeState, setVolumeRange] = useState<[number, number]>(volumeRange);
    const [liquidityRangeState, setLiquidityRange] = useState<[number, number]>(liquidityRange);
    const [priceChange24hRangeState, setPriceChange24hRange] = useState<[number, number]>(priceChange24hRange);

    const customSorting = (a: Row<ITokenDetail>, b: Row<ITokenDetail>, getValueFn: (obj: any) => number) => {
        const valueA = getValueFn(a.original);
        const valueB = getValueFn(b.original);
        return valueA - valueB;
    };

    const handleStarClick = (wallet: IWatchlistItem) => {
        const isInWatchlist = watchlist.some((w: IWatchlistItem) => w.contractAddress === wallet.contractAddress);
        if (isInWatchlist) {
            removeFromWatchlist(wallet.contractAddress);
        } else {
            addToWatchlist(wallet);
        }
    };

    const isTokenInWatchlist = (token: IWatchlistItem) => {
        return watchlist.some((t: IWatchlistItem) => t.contractAddress === token.contractAddress);
    };

    const columns: ColumnDef<ITokenDetail>[] = [
        {
            accessorKey: 'watchlist',
            header: '',
            cell: ({ row }) => {
                const token = row.original;
                return (<div className="cursor-pointer flex items-center justify-center"
                    onClick={() => handleStarClick({
                        name: token.tokenName,
                        contractAddress: token.contractAddress,
                        type: 'token'
                    })}
                >
                    {isTokenInWatchlist({
                        name: token.tokenName,
                        contractAddress: token.contractAddress,
                        type: 'token'
                    }) ? <AiFillStar size={20} /> : <AiOutlineStar size={20} />}
                </div>
                )
            }
        },
        {
            accessorKey: 'token',
            accessorFn: row => row.contractAddress,
            header: 'Token',
            cell: ({ row }) => {
                const token = row.original;
                return (
                    <div className="flex items-center">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={imageUrl(token.contractAddress, images)} alt="Avatar" />
                            <AvatarFallback>{token.contractAddress.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4">
                            <Link href={`/tokens/${selectedChain.symbol.toLowerCase()}/${token.contractAddress}`} className="text-sm">
                                {minifyTokenName(token.tokenName)}
                            </Link>
                            <Copy className="text-sm text-muted-foreground leading-none"
                                text={minifyContract(token.contractAddress)}
                                value={token.contractAddress}
                            />
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'priceChange24h',
            header: ({ column }) => {
                const isSortedAsc = column.getIsSorted() === 'asc';
                const isSortedDesc = column.getIsSorted() === 'desc';

                const toggleSorting = () => {
                    if (isSortedAsc) {
                        column.toggleSorting(true);
                    } else if (isSortedDesc) {
                        column.clearSorting();
                    } else {
                        column.toggleSorting(false);
                    }
                };

                return (
                    <Button
                        variant="ghost"
                        onClick={toggleSorting}
                    >
                        24%
                        {isSortedAsc && <ArrowUpIcon className="ml-2 h-4 w-4" />}
                        {isSortedDesc && <ArrowDownIcon className="ml-2 h-4 w-4" />}
                        {!column.getIsSorted() && <Icons.sort className="ml-2 h-4 w-4" />}
                    </Button>
                );
            },
            cell: ({ row }) => {
                const change = row.original.attributes.price_usd || "0";
                return (
                    <span className={clsx({ 'text-success': +change > 0, 'text-red-400': +change < 0 })}>
                        {change}%
                    </span>
                );
            },
            sortingFn: (a, b) => customSorting(a, b, (obj) => parseFloat(obj.attributes.price_usd || "0")),
        },
        {
            accessorKey: 'price',
            header: ({ column }) => {
                const isSortedAsc = column.getIsSorted() === 'asc';
                const isSortedDesc = column.getIsSorted() === 'desc';

                const toggleSorting = () => {
                    if (isSortedAsc) {
                        column.toggleSorting(true);
                    } else if (isSortedDesc) {
                        column.clearSorting();
                    } else {
                        column.toggleSorting(false);
                    }
                };

                return (
                    <Button
                        variant="ghost"
                        onClick={toggleSorting}
                    >
                        Price
                        {isSortedAsc && <ArrowUpIcon className="ml-2 h-4 w-4" />}
                        {isSortedDesc && <ArrowDownIcon className="ml-2 h-4 w-4" />}
                        {!column.getIsSorted() && <Icons.sort className="ml-2 h-4 w-4" />}
                    </Button>
                );
            },
            cell: ({ row }) => <PriceFormatter dollarSign value={parseFloat(row.original.attributes.price_usd || "0")} />,
            sortingFn: (a, b) => customSorting(a, b, (obj) => parseFloat(obj.attributes.price_usd || "0")),
        },
        {
            accessorKey: 'liquidity',
            header: ({ column }) => {
                const isSortedAsc = column.getIsSorted() === 'asc';
                const isSortedDesc = column.getIsSorted() === 'desc';

                const toggleSorting = () => {
                    if (isSortedAsc) {
                        column.toggleSorting(true);
                    } else if (isSortedDesc) {
                        column.clearSorting();
                    } else {
                        column.toggleSorting(false);
                    }
                };

                return (
                    <Button
                        variant="ghost"
                        onClick={toggleSorting}
                    >
                        Liquidity
                        {isSortedAsc && <ArrowUpIcon className="ml-2 h-4 w-4" />}
                        {isSortedDesc && <ArrowDownIcon className="ml-2 h-4 w-4" />}
                        {!column.getIsSorted() && <Icons.sort className="ml-2 h-4 w-4" />}
                    </Button>
                );
            },
            cell: ({ row }) => formatCash(parseFloat(row.original.attributes.total_reserve_in_usd || "0")),
            sortingFn: (a, b) => customSorting(a, b, (obj) => parseFloat(obj.attributes.total_reserve_in_usd || "0")),
        },
        {
            accessorKey: 'volume24h',
            header: ({ column }) => {
                const isSortedAsc = column.getIsSorted() === 'asc';
                const isSortedDesc = column.getIsSorted() === 'desc';

                const toggleSorting = () => {
                    if (isSortedAsc) {
                        column.toggleSorting(true);
                    } else if (isSortedDesc) {
                        column.clearSorting();
                    } else {
                        column.toggleSorting(false);
                    }
                };

                return (
                    <Button
                        variant="ghost"
                        onClick={toggleSorting}
                    >
                        24 Volume
                        {isSortedAsc && <ArrowUpIcon className="ml-2 h-4 w-4" />}
                        {isSortedDesc && <ArrowDownIcon className="ml-2 h-4 w-4" />}
                        {!column.getIsSorted() && <Icons.sort className="ml-2 h-4 w-4" />}
                    </Button>
                );
            },
            cell: ({ row }) => formatCash(parseFloat(row.original.attributes.volume_usd.h24 || "0")),
            sortingFn: (a, b) => customSorting(a, b, (obj) => parseFloat(obj.attributes.volume_usd.h24 || "0")),
        }
    ];

    const filteredData = initTokenData.filter(token =>
        parseFloat(token.attributes.price_usd || "0") >= priceRangeState[0] && parseFloat(token.attributes.price_usd || "0") <= priceRangeState[1] &&
        parseFloat(token.attributes.volume_usd.h24 || "0") >= volumeRangeState[0] && parseFloat(token.attributes.volume_usd.h24 || "0") <= volumeRangeState[1] &&
        parseFloat(token.attributes.total_reserve_in_usd || "0") >= liquidityRangeState[0] && parseFloat(token.attributes.total_reserve_in_usd || "0") <= liquidityRangeState[1] &&
        parseFloat(token.attributes.price_usd || "0") >= priceChange24hRangeState[0] && parseFloat(token.attributes.price_usd || "0") <= priceChange24hRangeState[1]
    );

    const defaultRanges = {
        price: priceRange,
        volume: volumeRange,
        liquidity: liquidityRange,
        priceChange24h: priceChange24hRange,
    };

    return (
        <ClientSideSmartTable
            data={filteredData}
            columns={columns}
            searchColumnAccessorKey='token'
        >
            <TopHotTokensFilterDialog
                priceRange={priceRangeState} setPriceRange={setPriceRange}
                volumeRange={volumeRangeState} setVolumeRange={setVolumeRange}
                liquidityRange={liquidityRangeState} setLiquidityRange={setLiquidityRange}
                priceChange24hRange={priceChange24hRangeState} setPriceChange24hRange={setPriceChange24hRange}
                defaultRanges={defaultRanges}
            />
        </ClientSideSmartTable >
    );
}
