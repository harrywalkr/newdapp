'use client'

import { Section, SectionContent } from "@/components/layout/Section";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ImageEndpoint, ImageType } from "@/types/Image.type";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useTokenChainStore } from "@/store";
import { getTopTrends } from "@/services/http/token.http";
import TableLoading from "@/components/layout/Table-loading";
import TopTokenTable from "./TopTokenTable";
dayjs.extend(relativeTime);

interface Props {
    images: ImageEndpoint;
}

export function TopLatestHotPairs({ images }: Props) {
    const { selectedChain } = useTokenChainStore();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { data: topTokens, isPending: topTokensPending } = useQuery(
        {
            queryKey: ['topTokens', selectedChain.symbol, page, pageSize],
            queryFn: () => getTopTrends({ params: { network: selectedChain.symbol, page: page, limit: pageSize } }),
            refetchInterval: 100000,
        },
    );

    return (
        <div className="w-full">
            {
                topTokensPending ? <TableLoading /> :
                    <TopTokenTable
                        page={page}
                        pageCount={pageSize}
                        setPage={setPage}
                        setPageSize={setPageSize}
                        images={images}
                        TopTokenInitData={topTokens?.data || []}
                    />
            }
        </div>
    )
}

