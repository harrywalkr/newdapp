'use client'
import { Skeleton } from '@/components/ui/skeleton';
import { getWalletSwaps } from '@/http/wallets.http';
import { useQueries, useQuery } from '@tanstack/react-query';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { separate3digits } from '@/utils/numbers';
import { minifyContract, minifyTokenName } from '@/utils/truncate';
import Image from 'next/image';
import { SwapWallet } from '@/types/swap.type';
import { getImages } from '@/http/image.http';
import { ImageType } from '@/types/Image.type';
import PriceFormatter from '@/utils/PriceFormatter';
import Copy from '@/components/ui/copy';


interface Props {
    walletAddress: string
    dateRange: {
        limit?: number;
        from?: string;
        till?: string;
    }
}

export default function WalletSwaps({ dateRange, walletAddress }: Props) {

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
                    }).then(({ data }) => data)
                        .catch(error => {
                            // FIXME: Create a service handler which sends errors to the logging backend
                            console.error("Failed to fetch wallet swaps:", error);
                            return [];
                        }),
            },
            {
                queryKey: ['images'],
                queryFn: () =>
                    getImages({}).then(({ data }) => data.imageUrls)
            },
        ],
    });


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
        <Table>
            <TableCaption>Summary of Token Transactions</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-12">Rank</TableHead>
                    <TableHead>Token</TableHead>
                    <TableHead className="whitespace-nowrap">Buy Amount (USD)</TableHead>
                    <TableHead className="whitespace-nowrap">Sell Amount (USD)</TableHead>
                    <TableHead className="whitespace-nowrap">Profit</TableHead>
                    <TableHead className="whitespace-nowrap">Entry Price</TableHead>
                    <TableHead className="whitespace-nowrap">Exit Price</TableHead>
                    <TableHead className="whitespace-nowrap">Buy Times</TableHead>
                    <TableHead className="whitespace-nowrap">Sell Times</TableHead>
                    <TableHead className="whitespace-nowrap">Current Value</TableHead>
                    <TableHead className="whitespace-nowrap">Live P&L</TableHead>
                    <TableHead className="whitespace-nowrap">Price</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {walletSwapsQuery.data?.swapWallet && walletSwapsQuery.data.swapWallet.map((swap, id) => (
                    <Record key={id} id={id + 1} data={swap} images={imagesQuery.data!} />
                ))}
            </TableBody>
        </Table>

    )
}


const Record = ({
    data,
    id,
    images,
}: {
    data: SwapWallet;
    id: number;
    images: ImageType[];
}) => {
    const buyAmount = parseFloat(data["Buy Amount (USD)"].toString());
    const sellAmount = parseFloat(data["Sell Amount (USD)"].toString());
    const profitAmount = parseFloat(data["Profit"].toString());

    const imageUrl = (address?: string): string | undefined => {
        if (!address) return undefined;
        const temp = images?.find((image) => image.token == address);
        return temp?.imageUrl;
    };

    return (
        <TableRow>
            <TableCell className="text-center">
                <div className="flex justify-center items-center gap-2">
                    <span>{id}</span>
                    {/* FIXME: implement watchlist */}
                    {/* {!watch ? (
                        <AiOutlineStar
                            className="cursor-pointer"
                            size={20}
                            onClick={handleSaveToken}
                        />
                    ) : (
                        <AiFillStar
                            className="cursor-pointer"
                            size={20}
                            onClick={handleSaveToken}
                        />
                    )} */}
                </div>
            </TableCell>
            <TableCell className="flex justify-center gap-2">
                <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
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
