"use client";

import { Skeleton } from "@/components/ui/skeleton"
import { getTradingList } from "@/services/http/token.http";
import { useQuery } from "@tanstack/react-query";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useState } from "react";
import { separate3digits } from "@/utils/numbers";
import PriceFormatter from "@/utils/PriceFormatter";
import { minifyContract } from "@/utils/truncate";
import Copy from "@/components/ui/copy";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FaEthereum } from "react-icons/fa";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ITradingListResponse, ITradingItem } from "@/types/Tradinglist.type";
import { format } from "date-fns";

dayjs.extend(relativeTime);

interface Props {
    tokenAddress: string,
    tokenAddress2: string,
    network: string,
    tokenName: string
}

export default function TradeReport({ tokenAddress, network, tokenName, tokenAddress2 }: Props) {
    const [page, setPage] = useState(0);
    const handleNext = () => setPage((prev) => prev + 1);
    const handlePrev = () => setPage((prev) => prev - 1);

    const {
        isLoading,
        error,
        data: tradeReport
    } = useQuery<ITradingListResponse>(
        {
            queryKey: ["TradeReport"],
            queryFn: () => {
                return getTradingList({
                    params: {
                        'network': network,
                        'address': tokenAddress
                    }
                })
            },
        }
    )

    if (isLoading) return (
        <div className="flex flex-col items-center gap-3 mt-3">
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    )

    return (
        <ScrollArea className="h-[600px] w-full rounded-md border p-4">
            <ScrollBar orientation="horizontal" />
            <Table>
                <TableCaption>A list of trading reports.</TableCaption>
                <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                        <TableHead className="whitespace-nowrap">Date</TableHead>
                        <TableHead className="whitespace-nowrap">TX Type</TableHead>
                        <TableHead className="whitespace-nowrap">Value (usd)</TableHead>
                        <TableHead className="whitespace-nowrap">{tokenName.split('/')[0]} Price</TableHead>
                        <TableHead className="whitespace-nowrap">{tokenName.split('/')[1]} Amount</TableHead>
                        <TableHead className="whitespace-nowrap">Maker</TableHead>
                        <TableHead className="whitespace-nowrap">TX Hash</TableHead>

                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        tradeReport &&
                        tradeReport.data.length > 0 &&
                        tradeReport.data.map((d: ITradingItem, idx: number) => (
                            <Record key={idx} data={d} tokenAddress={tokenAddress2} />
                        ))
                    }
                </TableBody>
            </Table>
        </ScrollArea>
    );
};

const Record = ({ data, tokenAddress }: { data: ITradingItem, tokenAddress: string }) => {
    const {
        id,
        attributes: {
            tx_hash,
            tx_from_address,
            from_token_address,
            from_token_amount,
            to_token_amount,
            price_from_in_usd,
            price_to_in_usd,
            block_number,
            kind,
            block_timestamp,
            volume_in_usd
        }
    } = data;

    return (
        <TableRow>
            <TableCell className="max-w-[400px] whitespace-nowrap">
                {block_timestamp && format(block_timestamp, 'MMMM d HH:mm:ss')}

            </TableCell>
            <TableCell className={`capitalize whitespace-nowrap ${kind === 'sell' ? 'text-red-400' : 'text-success'}`}>
                {kind ?? null}
            </TableCell>
            <TableCell className="capitalize whitespace-nowrap">
                {volume_in_usd ? <PriceFormatter value={volume_in_usd} dollarSign={true} /> : null}
            </TableCell>
            <TableCell className="max-w-[400px] whitespace-nowrap">
                {kind === 'buy' ? <PriceFormatter value={(+price_to_in_usd).toFixed(4)} dollarSign={true} /> : <PriceFormatter value={(+price_from_in_usd).toFixed(4)} dollarSign={true} />}
            </TableCell>
            <TableCell className="max-w-[400px] whitespace-nowrap">
                {kind === 'buy' ? from_token_amount : to_token_amount}
            </TableCell>
            <TableCell className="capitalize whitespace-nowrap flex items-center justify-start gap-2">
                <Image src='/Dextrading-logo3.png' width={20} height={20} alt="dextrading-symbol" />
                {tx_from_address ? <Copy value={tx_from_address}
                    href={`/tokens/${id.split('_')[0]}/${tokenAddress}`}
                    target="_blank" text={minifyContract(tx_from_address)} /> : 'N/A'}
                {/* add network */}
            </TableCell>
            <TableCell className="capitalize whitespace-nowrap">
                {tx_hash ? <div className="flex items-center gap-2">

                    <a
                        href={`https://etherscan.io/tx/${tx_hash}`}
                        target="_blank"
                    >
                        <FaEthereum className="text-3xl cursor-pointer text-base-content" />
                    </a>
                    <Copy href={`https://etherscan.io/address/${tx_hash}`} target="_blank" value={tx_hash} text={minifyContract(tx_hash)} />
                </div>
                    : 'N/A'}
            </TableCell>
        </TableRow>
    );
};
