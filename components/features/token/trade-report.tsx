"use client";

import { Skeleton } from "@/components/ui/skeleton"
import Loading from "@/components/common/Loading";
import { getTradeReport } from "@/services/http/token.http";
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
import { DextradeByToken } from "@/types/trade-report.type";
import { useState } from "react";
import { separate3digits } from "@/utils/numbers";
import PriceFormatter from "@/utils/PriceFormatter";
import { minifyContract } from "@/utils/truncate";
import Copy from "@/components/ui/copy";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FaEthereum } from "react-icons/fa";

dayjs.extend(relativeTime);

interface Props {
    tokenAddress: string
}

export default function TradeReport({ tokenAddress }: Props) {
    const [page, setPage] = useState(0);
    const handleNext = () => setPage((prev) => prev + 1);
    const handlePrev = () => setPage((prev) => prev - 1);

    const {
        isLoading,
        error,
        data: tradeReport
    } = useQuery(
        {
            queryKey: ["TradeReport"],
            queryFn: () => {
                return getTradeReport({
                    params: {
                        'network': 'eth',
                        'limit': 100,
                        'offset': 0,
                        'token': tokenAddress
                    }
                }).then(({ data }) => data?.EVM?.DEXTradeByTokens)
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
        <Table className="table-pin-rows table-pin-cols bg-transparent rounded-lg overflow-hidden mt-5">
            <TableCaption>A list of trading reports.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className=" text-base-100 w-28">
                        Time
                    </TableHead>
                    <TableHead className=" text-base-100">
                        Type
                    </TableHead>
                    <TableHead className=" text-base-100">
                        {tradeReport && tradeReport[0]?.Trade?.Currency?.Symbol ? tradeReport[0].Trade.Currency.Symbol : "-"}
                    </TableHead>
                    <TableHead className=" text-base-100">
                        {tradeReport && tradeReport[0]?.Trade?.Side?.Currency?.Symbol && tradeReport[0].Trade.Side.Currency.Symbol}
                    </TableHead>
                    <TableHead className=" text-base-100">
                        Price
                    </TableHead>
                    <TableHead className=" text-base-100">
                        Maker
                    </TableHead>
                    <TableHead className=" text-base-100 w-24">
                        TXN
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    tradeReport && tradeReport.slice(page * 10, (page + 1) * 10).map((d: any, idx) => (
                        <Record key={idx} data={d} />
                    ))
                }
            </TableBody>
        </Table>
    );
};


const Record = ({ data }: { data: DextradeByToken }) => {
    return (
        <TableRow>
            <TableCell className="text-center capitalize whitespace-nowrap">
                {data.Block?.Time && dayjs().to(data.Block.Time)}
            </TableCell>

            <TableCell className="text-base-content w-[150px] capitalize">
                {
                    data.typeOfTransaction &&
                    <div
                        className={`text-center whitespace-nowrap ${data.typeOfTransaction.includes("buy")
                            ? "text-green-400"
                            : "text-red-500"
                            }`}
                    >
                        {data.typeOfTransaction}
                    </div>
                }
            </TableCell>

            <TableCell className="text-base-content max-w-[400px]">
                {
                    data.Trade?.Amount &&
                    separate3digits(parseFloat(data.Trade.Amount).toFixed(2))
                }
            </TableCell>

            <TableCell className="text-base-content max-w-[400px]">
                {
                    data.Trade?.Side?.Amount &&
                    <PriceFormatter value={parseFloat(data.Trade.Side.Amount)} />
                }
            </TableCell>

            <TableCell className="text-base-content max-w-[400px]">
                {
                    data.Trade?.priceInEth &&
                    // <PriceFormatter value={parseFloat(data.Trade.priceInEth.toString())} />
                    <PriceFormatter value={data.Trade.priceInEth} />
                }
            </TableCell>

            <TableCell className="text-base-content max-w-[400px]">
                <div className="flex items-center text-info gap-2">
                    {
                        data.maker &&
                        <Copy href={`https://etherscan.io/address/${data.maker}`} target="_blank" value={data.maker} text={minifyContract(data.maker)} />
                    }
                </div>
            </TableCell>
            <TableCell className="flex items-center gap-3 w-24">
                {
                    data.Transaction?.Hash &&
                    <a
                        href={`https://etherscan.io/tx/${data.Transaction.Hash}`}
                        target="_blank"
                    >
                        <FaEthereum className="text-3xl cursor-pointer text-base-content" />
                    </a>
                }
                {
                    data.Trade?.Dex?.ProtocolName &&
                    <Image
                        src={data.Trade.Dex.ProtocolName.includes("v3") ? "/uni3.png" : "/uni2.png"}
                        alt="Protocol"
                        width={40}
                        height={40}
                        className="w-10 h-10"
                    />
                }
            </TableCell>
        </TableRow>

    );
};


// FIXME: Add pagination to this table