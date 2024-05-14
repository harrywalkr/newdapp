'use client'
import { Skeleton } from '@/components/ui/skeleton';
import { getWalletSwaps } from '@/services/http/wallets.http';
import { useQueries } from '@tanstack/react-query';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { separate3digits } from '@/utils/numbers';
import { minifyContract, minifyTokenName } from '@/utils/truncate';
import Image from 'next/image';
import { SwapWallet } from '@/types/swap.type';
import { getImages } from '@/services/http/image.http';
import { ImageType } from '@/types/Image.type';
import PriceFormatter from '@/utils/PriceFormatter';
import Copy from '@/components/ui/copy';
import React from 'react';
import { useWatchlistStore } from '@/store';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

interface Props {
    walletAddress: string;
    dateRange: {
        limit?: number;
        from?: string;
        till?: string;
    };
}

export default function WalletSwaps({ dateRange, walletAddress }: Props) {
    const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlistStore();
    const [walletSwapsQuery, imagesQuery] = useQueries({
        queries: [
            {
                queryKey: ["wallet-swaps", { dateRange, walletAddress }],
                queryFn: () => getWalletSwaps({
                    params: {
                        params: dateRange,
                        address: walletAddress
                    }
                }
                ).then(({ data }) => data),
            },
            {
                queryKey: ['images'],
                queryFn: () => getImages({}).then((data) => data.imageUrls),
            },
        ],
    });

    const handleWatchlistToggle = (token: SwapWallet) => {
        // FIXME: ask mehdi to uniform all types. wallets and tokens and everything else
        const isInWatchlist = watchlist.some((item: any) => item.id === token.tokenName);
        // FIXME: fix the next line as well
        // isInWatchlist ? removeFromWatchlist(token.tokenName) : addToWatchlist(token);
    };


    if (walletSwapsQuery.isLoading || imagesQuery.isLoading) {
        return <div className='flex flex-col gap-3'>
            {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="flex items-center space-x-4 w-full">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/5" />
                    </div>
                </div>
            ))}
        </div>;
    }

    return (
        <Table>
            <TableCaption>Summary of Token Transactions</TableCaption>
            <TableHeader>
                <TableRow>
                    {/* Table headers with consistency in the use of double quotes */}
                </TableRow>
            </TableHeader>
            <TableBody>
                {walletSwapsQuery.data?.swapWallet?.map((swap, index) => (
                    <MemoizedRecord key={index} id={index + 1} data={swap} images={imagesQuery.data!} handleWatchlistToggle={handleWatchlistToggle} />
                ))}
            </TableBody>
        </Table>
    );
}

const Record = ({
    data,
    id,
    images,
    handleWatchlistToggle
}: {
    data: SwapWallet;
    id: number;
    images: ImageType[];
    handleWatchlistToggle: (token: SwapWallet) => void
}) => {
    const buyAmount = parseFloat(data["Buy Amount (USD)"].toString());
    const sellAmount = parseFloat(data["Sell Amount (USD)"].toString());
    const profitAmount = parseFloat(data["Profit"].toString());
    // FIXME: fix this line as well
    // const isInWatchlist = useWatchlistStore(state => state.watchlist.some(item => item.id === token.id));




    const imageUrl = (address?: string): string | undefined => {
        if (!address) return undefined;
        const image = images?.find((image) => image.token === address);
        return image?.imageUrl;
    };

    return (
        <TableRow>
            <TableCell className="text-center">
                <div onClick={() => handleWatchlistToggle(data)} className="cursor-pointer">
                    {true ? <AiFillStar size={20} /> : <AiOutlineStar size={20} />}
                </div>
            </TableCell>
            <TableCell className="flex justify-center gap-2">
                <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                        {/* FIXME: use shadcn/avatar instead of this mess */}
                        {imageUrl(data["Currency Address"]) != undefined ? (
                            <Image
                                width={40}
                                height={40}
                                className='rounded-full'
                                src={imageUrl(data["Currency Address"])!}
                                alt={data.tokenName}
                            />
                        ) : (
                            <div className="flex justify-center items-center w-10 h-10 font-bold text-base border border-base-content rounded-full">
                                {data.tokenName.charAt(0)}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col items-start justify-center">
                    <span className="font-medium">
                        {minifyTokenName(data.tokenName)}
                    </span>
                    <Copy
                        text={minifyContract(data["Currency Address"])}
                        value={data["Currency Address"]}
                        className='text-muted-foreground'
                    />
                </div>
            </TableCell>
            <TableCell>
                ${separate3digits(buyAmount.toFixed(2))}
            </TableCell>
            <TableCell>
                ${separate3digits(sellAmount.toFixed(2))}
            </TableCell>
            <TableCell className={` ${profitAmount > 0 ? "text-success/90" : "text-error/90"}`}>
                ${separate3digits(profitAmount.toFixed(2))}
            </TableCell>
            <TableCell>
                <PriceFormatter value={data["Entry Price"]} />
            </TableCell>
            <TableCell>
                <PriceFormatter value={data["Exit Price"]} />
            </TableCell>
            <TableCell>
                {data["Num of Buy Times"] || 0}
            </TableCell>
            <TableCell>
                {data["Num of Sell Times"] || 0}
            </TableCell>
            <TableCell className=" min-w-[200px]">
                <PriceFormatter value={data.currentValue || 0} />
            </TableCell>
            <TableCell className={` ${data.currentProfit > 0 ? "text-success" : "text-error"}`}>
                ${data.currentProfit.toFixed(2) || 0}
            </TableCell>
            <TableCell className=" max-w-[300px]">
                <PriceFormatter value={data.tokenPrice || 0} />
            </TableCell>
            <TableCell className=" whitespace-nowrap">
                <div
                    className={`p-2 rounded-lg ${data["isPartiallyClosed"] ? "text-error" : "text-success"}`}
                >
                    {data["isPartiallyClosed"] ? "Partial Closed" : "Fully Closed"}
                </div>
            </TableCell>
        </TableRow>
    );
};

const MemoizedRecord = React.memo(Record);
