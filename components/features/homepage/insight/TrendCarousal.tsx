'use client'

import React from 'react';
import TrendItem from '../TrendItem';
import useTokenChainStore, { TokenChain } from '@/store/tokenChains';
import { useQuery } from '@tanstack/react-query';
import { getTrends } from "@/services/http/trends.http";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from '@/components/ui/button';
import Loading from '@/components/layout/Loading';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


const TrendsCarousel = () => {
    const { selectedChain } = useTokenChainStore();
    const router = useRouter()
    const { isLoading, error, data: trends } = useQuery({
        queryKey: ["trends", selectedChain.symbol],
        queryFn: () => getTrends(selectedChain.url),
        refetchInterval: 300000
    });

    if (isLoading) return <Loading times={3} />
    if (error) return <div>Error fetching data</div>;

    const chunkSize = 3;
    const chunks = [];
    if (trends?.data && trends?.data.length > 0) {
        for (let i = 0; i < trends.data.length; i += chunkSize) {
            chunks.push(trends.data.slice(i, i + chunkSize));
        }
    }

    return (
        <Carousel>
            <CarouselContent>
                {chunks.map((chunk, index) => (
                    <CarouselItem key={index} className='flex flex-col gap-2'>
                        {chunk.map((token, idx) => (
                            <TrendItem key={idx} token={token} selectedChain={selectedChain} />
                        ))}
                    </CarouselItem>
                ))}
            </CarouselContent>
            <div className='flex items-center justify-end gap-2 mt-4'>
                <div>
                    <CarouselPrevious />
                    <CarouselNext />
                </div>
                <Button variant='outline' onClick={() => router.push('/trending-pairs')}>
                    Show All
                </Button>
            </div>
        </Carousel>
    );
};

export default TrendsCarousel;
