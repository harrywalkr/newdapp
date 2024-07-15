'use client'
import TableLoading from '@/components/layout/Table-loading';
import { getTokenDetails } from '@/services/http/token.http';
import { useTokenChainStore } from '@/store';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import TopHotTokensTable from './top-hot-tokens-table/Top-hot-tokens-table';
import { getImages } from '@/services/http/image.http';

export default function TopHotTokens() {
    const { selectedChain } = useTokenChainStore();

    const { data: tokenData, isLoading: isTokenDataLoading, error: tokenDataError } = useQuery({
        queryKey: ['tokenDetail', selectedChain.symbol],
        queryFn: () => getTokenDetails(),
        refetchInterval: 100000,
        enabled: selectedChain.symbol === 'eth',
    }
    );

    const { data: images, isLoading: isImagesLoading, error: imagesError } = useQuery({
        queryKey: ['images'],
        queryFn: () => getImages().then(data => data.imageUrls)
    }
    );

    if (tokenDataError || imagesError) {
        return <div>Failed to load tokens or images, please try again.</div>;
    }

    if (isTokenDataLoading || isImagesLoading) {
        return <TableLoading />;
    }

    return (
        <div className="w-full">
            {
                tokenData && images ?
                    <TopHotTokensTable images={images} initTokenData={tokenData} /> :
                    <TableLoading />
            }
        </div>
    );
}
