'use client';

import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useTokenChainStore } from "@/store";
import { getWallets } from "@/services/http/wallets.http";
import TableLoading from '@/components/layout/Table-loading';
import WalletsTable from '../WalletsTable';

export default function Wallets() {
    const { selectedChain } = useTokenChainStore();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState<string>('rank');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const { data: walletsData, isLoading } = useQuery({
        queryKey: ['wallets', selectedChain.symbol, page, pageSize, sortBy, sortOrder],
        queryFn: () => getWallets({ params: { "network": selectedChain.symbol, page: page, limit: pageSize, sortBy, sortOrder } }),
    });

    if (isLoading) {
        return (
            <div>
                <TableLoading />
            </div>
        );
    }

    if (!walletsData) {
        return (
            <div>
                <p>No data available</p>
            </div>
        );
    }

    return (
        <div>
            <WalletsTable
                walletsData={walletsData}
                page={page} setPage={setPage}
                pageSize={pageSize} setPageSize={setPageSize}
                sortBy={sortBy} setSortBy={setSortBy}
                sortOrder={sortOrder} setSortOrder={setSortOrder}
            />
        </div>
    );
}
