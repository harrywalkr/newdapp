// src/components/trade-report/TradeReport.tsx

"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getTradingList } from "@/services/http/token.http";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ITradingListResponse } from "@/types/Tradinglist.type";
import { useRouter } from "next/navigation";
import { ClientSideSmartTable } from "@/components/ui/smart-table/ClientSideSmartTable";
import { columns } from "./TradeReportColumns";

dayjs.extend(relativeTime);

interface Props {
    tokenAddress: string;
    tokenAddress2: string;
    network: string;
    tokenName: string;
}

export default function TradeReport({ tokenAddress, network, tokenName, tokenAddress2 }: Props) {
    const router = useRouter();

    const { isLoading, error, data: tradeReport } = useQuery<ITradingListResponse>({
        queryKey: ["TradeReport"],
        queryFn: () => getTradingList({ params: { network, address: tokenAddress } }),
    });

    if (isLoading) return (
        <div className="flex flex-col items-center gap-3 mt-3">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
        </div>
    );

    const data = tradeReport ? tradeReport.data : [];

    return (
        <ScrollArea className="h-[600px] w-full rounded-md border p-4">
            <ClientSideSmartTable
                data={data}
                columns={columns(tokenName, router)}
                searchColumnAccessorKey='tx_hash'
            />
        </ScrollArea>
    );
}
