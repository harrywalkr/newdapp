'use client';

import React, { useState, useMemo } from 'react';
import { ColumnDef, Row } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage, AvatarPlaceholder } from "@/components/ui/avatar";
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
import { Daum } from '@/types/token.type';
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, ArrowDownIcon } from "@radix-ui/react-icons";
import { Icons } from "@/components/ui/icon";
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { IWatchlistItem } from '@/store/watchlist';
import FilterDialog, { Filter } from '@/components/ui/smart-table/FilterDialog';
import { ServerSideSmartTableOld } from '@/components/ui/smart-table/ServerSideSmartTableOld';

interface Props {
    images: ImageType[];
    TopTokenInitData: Daum[];
    page: number,
    pageCount: number,
    setPage: (page: number) => void
    setPageSize: (pageSize: number) => void
}

export default function TopTokenTable({ images, TopTokenInitData, setPage, setPageSize, page, pageCount }: Props) {
    const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlistStore();
    const { selectedChain } = useTokenChainStore();

    const calculateRanges = (data: Daum[]) => {
        let priceRange: [number, number] = [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY];
        let volumeRange: [number, number] = [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY];
        let liquidityRange: [number, number] = [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY];
        let ageRange: [number, number] = [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY];
        let priceChange24hRange: [number, number] = [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY];

        data.forEach(token => {
            const price = Math.floor(parseFloat(token.attributes?.base_token_price_usd || "0"));
            const volume = Math.floor(parseFloat(token.attributes?.volume_usd?.h24 || "0"));
            const liquidity = Math.floor(parseFloat(token.attributes?.reserve_in_usd || "0"));
            const age = token.attributes?.pool_created_at ? Math.floor(dayjs().diff(token.attributes.pool_created_at, 'day')) : 0;
            const priceChange24h = Math.floor(parseFloat(token.attributes?.price_change_percentage?.h24 || "0"));

            priceRange = [Math.min(priceRange[0], price), Math.max(priceRange[1], price)];
            volumeRange = [Math.min(volumeRange[0], volume), Math.max(volumeRange[1], volume)];
            liquidityRange = [Math.min(liquidityRange[0], liquidity), Math.max(liquidityRange[1], liquidity)];
            ageRange = [Math.min(ageRange[0], age), Math.max(ageRange[1], age)];
            priceChange24hRange = [Math.min(priceChange24hRange[0], priceChange24h), Math.max(priceChange24hRange[1], priceChange24h)];
        });

        priceRange = priceRange[0] === Number.POSITIVE_INFINITY ? [0, 0] : priceRange;
        volumeRange = volumeRange[0] === Number.POSITIVE_INFINITY ? [0, 0] : volumeRange;
        liquidityRange = liquidityRange[0] === Number.POSITIVE_INFINITY ? [0, 0] : liquidityRange;
        ageRange = ageRange[0] === Number.POSITIVE_INFINITY ? [0, 0] : ageRange;
        priceChange24hRange = priceChange24hRange[0] === Number.POSITIVE_INFINITY ? [-100, 100] : priceChange24hRange;

        return { priceRange, volumeRange, liquidityRange, ageRange, priceChange24hRange };
    };

    const { priceRange, volumeRange, liquidityRange, ageRange, priceChange24hRange } = useMemo(() => calculateRanges(TopTokenInitData), [TopTokenInitData]);

    const [priceRangeState, setPriceRange] = useState<[number, number]>(priceRange);
    const [volumeRangeState, setVolumeRange] = useState<[number, number]>(volumeRange);
    const [liquidityRangeState, setLiquidityRange] = useState<[number, number]>(liquidityRange);
    const [ageRangeState, setAgeRange] = useState<[number, number]>(ageRange);
    const [priceChange24hRangeState, setPriceChange24hRange] = useState<[number, number]>(priceChange24hRange);

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
                return (
                    <div className="cursor-pointer flex items-center justify-center"
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
                            <AvatarFallback>
                                {/* {tokenId.charAt(0)} */}
                                <AvatarPlaceholder />
                            </AvatarFallback>
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
                const change = Math.floor(parseFloat(row.original.attributes?.price_change_percentage?.h24 || "0"));
                return (
                    <span className={clsx({ 'text-success': change > 0, 'text-red-400': change < 0 })}>
                        {change}%
                    </span>
                );
            },
            sortingFn: (a, b) => customSorting(a, b, (obj) => Math.floor(parseFloat(obj.attributes?.price_change_percentage?.h24 || "0"))),
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
            cell: ({ row }) => <PriceFormatter dollarSign value={Math.floor(parseFloat(row.original.attributes?.base_token_price_usd || "0"))} />,
            sortingFn: (a, b) => customSorting(a, b, (obj) => Math.floor(parseFloat(obj.attributes?.base_token_price_usd || "0"))),
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
            cell: ({ row }) => formatCash(Math.floor(parseFloat(row.original.attributes?.reserve_in_usd || "0"))),
            sortingFn: (a, b) => customSorting(a, b, (obj) => Math.floor(parseFloat(obj.attributes?.reserve_in_usd || "0"))),
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
            cell: ({ row }) => formatCash(Math.floor(parseFloat(row.original.attributes?.volume_usd?.h24 || "0"))),
            sortingFn: (a, b) => customSorting(a, b, (obj) => Math.floor(parseFloat(obj.attributes?.volume_usd?.h24 || "0"))),
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

    const filteredData = TopTokenInitData.filter(token =>
        Math.floor(parseFloat(token.attributes?.base_token_price_usd || "0")) >= priceRangeState[0] && Math.floor(parseFloat(token.attributes?.base_token_price_usd || "0")) <= priceRangeState[1] &&
        Math.floor(parseFloat(token.attributes?.volume_usd?.h24 || "0")) >= volumeRangeState[0] && Math.floor(parseFloat(token.attributes?.volume_usd?.h24 || "0")) <= volumeRangeState[1] &&
        Math.floor(parseFloat(token.attributes?.reserve_in_usd || "0")) >= liquidityRangeState[0] && Math.floor(parseFloat(token.attributes?.reserve_in_usd || "0")) <= liquidityRangeState[1] &&
        (token.attributes?.pool_created_at ? Math.floor(dayjs().diff(token.attributes?.pool_created_at, 'day')) : 0) >= ageRangeState[0] && (token.attributes?.pool_created_at ? Math.floor(dayjs().diff(token.attributes?.pool_created_at, 'day')) : 0) <= ageRangeState[1] &&
        Math.floor(parseFloat(token.attributes?.price_change_percentage?.h24 || "0")) >= priceChange24hRangeState[0] && Math.floor(parseFloat(token.attributes?.price_change_percentage?.h24 || "0")) <= priceChange24hRangeState[1]
    );

    const filters: Filter[] = [
        {
            name: 'Price Range',
            state: priceRangeState,
            setState: setPriceRange,
            defaultRange: priceRange,
            type: 'range'
        },
        {
            name: 'Volume Range',
            state: volumeRangeState,
            setState: setVolumeRange,
            defaultRange: volumeRange,
            type: 'range',
            premium: true
        },
        {
            name: 'Liquidity Range',
            state: liquidityRangeState,
            setState: setLiquidityRange,
            defaultRange: liquidityRange,
            type: 'range'
        },
        {
            name: 'Age Range',
            state: ageRangeState,
            setState: setAgeRange,
            defaultRange: ageRange,
            type: 'range'
        },
        {
            name: '24h Price Change Range',
            state: priceChange24hRangeState,
            setState: setPriceChange24hRange,
            defaultRange: priceChange24hRange,
            type: 'range'
        }
    ];

    return (
        <ServerSideSmartTableOld
            data={filteredData}
            columns={columns}
            searchColumnAccessorKey='token'
            page={page}
            pageCount={pageCount}
            setPage={setPage}
            setPageSize={setPageSize}
        >
            <FilterDialog filters={filters} />
        </ServerSideSmartTableOld >
    );
}
