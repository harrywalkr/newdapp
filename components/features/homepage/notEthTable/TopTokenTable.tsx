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
import { SmartTable } from '@/components/ui/smart-table';
import { Daum } from '@/types/token.type';
import NonEthFilterDialog from './TopTokenTableFilter';
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, ArrowDownIcon } from "@radix-ui/react-icons";
import { Icons } from "@/components/ui/icon";
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { IWatchlistItem } from '@/store/watchlist';

interface Props {
    images: ImageType[];
    initNonEthData: Daum[];
    page: number,
    pageCount: number,
    setPage: (page: number) => void
    setPageSize: (pageSize: number) => void
}

export default function TopTokenTable({ images, initNonEthData, setPage, setPageSize, page, pageCount }: Props) {
    const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlistStore();
    const { selectedChain } = useTokenChainStore();
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 60000]);
    const [volumeRange, setVolumeRange] = useState<[number, number]>([0, 90000000]);
    const [liquidityRange, setLiquidityRange] = useState<[number, number]>([0, 200000000]);
    const [ageRange, setAgeRange] = useState<[number, number]>([0, 365]);
    const [priceChange24hRange, setPriceChange24hRange] = useState<[number, number]>([-100, 100]);

    const customSorting = (a: Row<Daum>, b: Row<Daum>, getValueFn: (obj: any) => number) => {
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

    const columns: ColumnDef<Daum>[] = [

        {
            accessorKey: 'watchlist',
            header: '',
            cell: ({ row }) => {
                const token = row.original;
                const tokenId = token.relationships?.base_token?.data?.id?.split('_')[1] || "";
                return (<div className="px-5 cursor-pointer"
                    onClick={() => handleStarClick({
                        name: token.attributes?.name as string,
                        contractAddress: tokenId,
                        type: 'token'
                    })}
                >
                    {isTokenInWatchlist({
                        name: token.attributes?.name as string,
                        contractAddress: tokenId,
                        type: 'token'
                    }) ? <AiFillStar size={20} /> : <AiOutlineStar size={20} />}
                </div>
                )
            }
        },
        {
            accessorKey: 'token',
            accessorFn: row => {
                const tokenId = row.relationships?.base_token?.data?.id?.split('_')[1] || "";
                return tokenId;
            },
            header: 'Token',
            cell: ({ row }) => {
                const token = row.original;
                const tokenId = token.relationships?.base_token?.data?.id?.split('_')[1] || "";
                return (
                    <div className="flex items-center">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={imageUrl(tokenId, images)} alt="Avatar" />
                            <AvatarFallback>{tokenId.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4">
                            <Link href={`/tokens/${selectedChain.symbol.toLowerCase()}/${tokenId}`} className="text-sm">
                                {minifyTokenName(token.attributes?.name?.split('/')[0] || "")}
                            </Link>
                            <Copy className="text-sm text-muted-foreground leading-none"
                                text={minifyContract(tokenId)}
                                value={tokenId}
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
                const change = row.original.attributes?.price_change_percentage?.h24 || "0";
                return (
                    <span className={clsx({ 'text-success': +change > 0, 'text-red-400': +change < 0 })}>
                        {change}%
                    </span>
                );
            },
            sortingFn: (a, b) => customSorting(a, b, (obj) => parseFloat(obj.attributes?.price_change_percentage?.h24 || "0")),
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
            cell: ({ row }) => <PriceFormatter dollarSign value={parseFloat(row.original.attributes?.base_token_price_usd || "0")} />,
            sortingFn: (a, b) => customSorting(a, b, (obj) => parseFloat(obj.attributes?.base_token_price_usd || "0")),
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
            cell: ({ row }) => formatCash(parseFloat(row.original.attributes?.reserve_in_usd || "0")),
            sortingFn: (a, b) => customSorting(a, b, (obj) => parseFloat(obj.attributes?.reserve_in_usd || "0")),
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
            cell: ({ row }) => formatCash(parseFloat(row.original.attributes?.volume_usd?.h24 || "0")),
            sortingFn: (a, b) => customSorting(a, b, (obj) => parseFloat(obj.attributes?.volume_usd?.h24 || "0")),
        },
        {
            accessorKey: 'age',
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
                        Age
                        {isSortedAsc && <ArrowUpIcon className="ml-2 h-4 w-4" />}
                        {isSortedDesc && <ArrowDownIcon className="ml-2 h-4 w-4" />}
                        {!column.getIsSorted() && <Icons.sort className="ml-2 h-4 w-4" />}
                    </Button>
                );
            },
            cell: ({ row }) => row.original.attributes?.pool_created_at ? dayjs().to(row.original.attributes?.pool_created_at) : "N/A",
            sortingFn: (a, b) => {
                const dateA = dayjs(a.original.attributes?.pool_created_at);
                const dateB = dayjs(b.original.attributes?.pool_created_at);
                return dateA.isBefore(dateB) ? -1 : 1;
            },
        },
    ];

    const filteredData = initNonEthData.filter(token =>
        parseFloat(token.attributes?.base_token_price_usd || "0") >= priceRange[0] && parseFloat(token.attributes?.base_token_price_usd || "0") <= priceRange[1] &&
        parseFloat(token.attributes?.volume_usd?.h24 || "0") >= volumeRange[0] && parseFloat(token.attributes?.volume_usd?.h24 || "0") <= volumeRange[1] &&
        parseFloat(token.attributes?.reserve_in_usd || "0") >= liquidityRange[0] && parseFloat(token.attributes?.reserve_in_usd || "0") <= liquidityRange[1] &&
        (token.attributes?.pool_created_at ? dayjs().diff(token.attributes?.pool_created_at, 'day') : 0) >= ageRange[0] && (token.attributes?.pool_created_at ? dayjs().diff(token.attributes?.pool_created_at, 'day') : 0) <= ageRange[1] &&
        parseFloat(token.attributes?.price_change_percentage?.h24 || "0") >= priceChange24hRange[0] && parseFloat(token.attributes?.price_change_percentage?.h24 || "0") <= priceChange24hRange[1]
    );

    return (
        <SmartTable
            data={filteredData}
            columns={columns}
            searchColumnAccessorKey='token'
            page={page}
            pageCount={pageCount}
            setPage={setPage}
            setPageSize={setPageSize}
        >
            <NonEthFilterDialog
                priceRange={priceRange} setPriceRange={setPriceRange}
                volumeRange={volumeRange} setVolumeRange={setVolumeRange}
                liquidityRange={liquidityRange} setLiquidityRange={setLiquidityRange}
                ageRange={ageRange} setAgeRange={setAgeRange}
                priceChange24hRange={priceChange24hRange} setPriceChange24hRange={setPriceChange24hRange}
            />
        </SmartTable >
    );
}