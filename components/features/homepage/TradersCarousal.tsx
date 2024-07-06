'use client';

import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import TrendingTradersItem from './TrendingTradersItem';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { useTokenChainStore } from '@/store';
import { getWallets } from '@/services/http/wallets.http';
import Loading from '@/components/layout/Loading';

const TradersCarousel = () => {
    const { selectedChain } = useTokenChainStore();

    const {
        isLoading,
        error,
        data: walletsData,
    } = useQuery({
        queryKey: ['wallets', selectedChain.symbol, 1, 9],
        queryFn: () => getWallets({
            params: {
                "network": selectedChain.symbol,
                "page": 1,
                "limit": 10
            },
        }),
        staleTime: 60000,
    });

    if (isLoading) return <Loading times={3} />
    if (error) return <div>Error fetching data</div>;

    const chunkSize = 3;
    const chunks = [];
    if (walletsData && walletsData.length > 0) {
        for (let i = 0; i < walletsData.length; i += chunkSize) {
            chunks.push(walletsData.slice(i, i + chunkSize));
        }
    }

    return (
        <Carousel>
            <CarouselContent>
                {chunks.map((chunk, index) => (
                    <CarouselItem key={index}>
                        {chunk.map((wallet, idx) => (
                            <TrendingTradersItem key={idx} wallet={wallet} index={idx} total={chunk.length} />
                        ))}
                    </CarouselItem>
                ))}
            </CarouselContent>
            <div className='flex items-center justify-end'>
                <CarouselPrevious />
                <CarouselNext />
            </div>
        </Carousel>
    );
};

export default TradersCarousel;
