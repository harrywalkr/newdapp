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

dayjs.extend(relativeTime);

interface Props {
    tokenAddress: string,
    network: string,
}

export default function TradeReport({ tokenAddress, network }: Props) {
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
                <TableHeader className="sticky top-0 bg-muted z-10">
                    <TableRow>
                        <TableHead className="whitespace-nowrap">ID</TableHead>
                        <TableHead className="whitespace-nowrap">TX Hash</TableHead>
                        <TableHead className="whitespace-nowrap">Sender</TableHead>
                        <TableHead className="whitespace-nowrap">Receiver</TableHead>
                        <TableHead className="whitespace-nowrap">Type</TableHead>
                        <TableHead className="whitespace-nowrap">From Token Amount</TableHead>
                        <TableHead className="whitespace-nowrap">To Token Amount</TableHead>
                        <TableHead className="whitespace-nowrap">Price From in USD</TableHead>
                        <TableHead className="whitespace-nowrap">Price To in USD</TableHead>
                        <TableHead className="whitespace-nowrap">Block Number</TableHead>
                        <TableHead className="whitespace-nowrap w-96">TXN</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        tradeReport &&
                        tradeReport.data.length > 0 &&
                        tradeReport.data.map((d: ITradingItem, idx: number) => (
                            <Record key={idx} data={d} />
                        ))
                    }
                </TableBody>
            </Table>
         </ScrollArea>
    );
};

const Record = ({ data }: { data: ITradingItem }) => {
    const {
        id,
        type,
        attributes: {
            tx_hash,
            tx_from_address,
            from_token_address,
            from_token_amount,
            to_token_amount,
            price_from_in_usd,
            price_to_in_usd,
            block_number,
        }
    } = data;

    return (
        <TableRow>
            <TableCell className="capitalize whitespace-nowrap">
                {minifyContract(id)}
            </TableCell>
            <TableCell className="capitalize whitespace-nowrap">
                {tx_hash ? <Copy value={tx_hash} text={minifyContract(tx_hash)} /> : 'N/A'}
            </TableCell>
            <TableCell className="capitalize whitespace-nowrap">
                {tx_from_address ?? 'N/A'}
            </TableCell>
            <TableCell className="capitalize whitespace-nowrap">
                {from_token_address ?? 'N/A'}
            </TableCell>
            <TableCell className="capitalize">
                <div
                    className={`whitespace-nowrap ${type.includes("buy")
                        ? "text-green-400"
                        : "text-red-500"
                        }`}
                >
                    {type}
                </div>
            </TableCell>
            <TableCell className="max-w-[400px]">
                {from_token_amount ? separate3digits(parseFloat(from_token_amount).toFixed(2)) : 'N/A'}
            </TableCell>
            <TableCell className="max-w-[400px]">
                {to_token_amount ? separate3digits(parseFloat(to_token_amount).toFixed(2)) : 'N/A'}
            </TableCell>
            <TableCell className="max-w-[400px]">
                {price_from_in_usd ? <PriceFormatter value={parseFloat(price_from_in_usd)} /> : 'N/A'}
            </TableCell>
            <TableCell className="max-w-[400px]">
                {price_to_in_usd ? <PriceFormatter value={parseFloat(price_to_in_usd)} /> : 'N/A'}
            </TableCell>
            <TableCell className="capitalize whitespace-nowrap">
                {block_number ?? 'N/A'}
            </TableCell>
            <TableCell className="flex items-center gap-3">
                <a
                    href={`https://etherscan.io/tx/${tx_hash}`}
                    target="_blank"
                >
                    <FaEthereum className="text-3xl cursor-pointer text-base-content" />
                </a>
                <Copy href={`https://etherscan.io/address/${tx_from_address}`} target="_blank" value={tx_from_address} text={minifyContract(tx_from_address)} />
            </TableCell>
        </TableRow>
    );
};
