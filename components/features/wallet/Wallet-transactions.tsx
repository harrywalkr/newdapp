'use client'

import { Skeleton } from '@/components/ui/skeleton';
import { getImages } from '@/services/http/image.http';
import { getWalletSwaps } from '@/services/http/wallets.http';
import { useQueries } from '@tanstack/react-query';
import React from 'react'
import TransactionComponent from './Transaction';
import { SwapType } from '@/types/swap.type';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';


interface Props {
    walletAddress: string
    dateRange: {
        from: string, till: string
    } | null
}

export default function WalletTransactions({ dateRange, walletAddress }: Props) {

    const [walletSwapsQuery, imagesQuery] = useQueries({
        queries: [
            {
                queryKey: ["wallet-swaps", { dateRange, walletAddress }],
                queryFn: () =>
                    getWalletSwaps({
                        params: {
                            params: dateRange,
                            address: walletAddress
                        }
                    }).then(data => data)
                        .catch(error => {
                            // FIXME: Create a service handler which sends errors to the logging backend
                            console.error("Failed to fetch wallet swaps:", error);
                            return [];
                        }),
            },
            {
                queryKey: ['images'],
                queryFn: () =>
                    getImages({}).then((data) => data.imageUrls)
            },
        ],
    });

    const imageUrl = (address?: string): string | undefined => {
        if (!address) return undefined
        const temp = imagesQuery.data?.find((image) => image.token == address);
        return temp?.imageUrl;
    }

    const sortedSwaps = (swaps: SwapType) => {
        let sortedSwaps = swaps.transactions.sort((a, b) => {
            return new Date(b.block?.timestamp?.time!).getTime() - new Date(a.block?.timestamp?.time!).getTime()
        });
        return sortedSwaps
    }

    if (walletSwapsQuery.isLoading || imagesQuery.isLoading) return (
        <div className='flex flex-col gap-3'>
            {
                <>
                    {Array.apply(null, Array(5)).map((i) =>
                        <div key={String(i)} className="flex items-center space-x-4 w-full">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/5" />
                            </div>
                        </div>)}
                </>
            }
        </div >)


    return (
        <ScrollArea className="h-96 w-full rounded-md border">
            <ScrollBar orientation="horizontal" />

            <div>
                {walletSwapsQuery.data && sortedSwaps(walletSwapsQuery.data as SwapType).map((swap, id) => {
                    if (swap.type === null) return null
                    else return <>
                        <TransactionComponent
                            key={id}
                            swap={swap}
                            image={swap.type?.includes("swap")
                                ? imageUrl(swap.description?.sentTokenAddress)
                                : swap.currency?.symbol}
                            isSwap={swap.type?.includes("swap")} />
                        <Separator className="my-2" />
                    </>
                })}
            </div>
        </ScrollArea>

    )
}
