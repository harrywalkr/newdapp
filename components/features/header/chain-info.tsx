'use client'
import { Skeleton } from '@/components/ui/skeleton';
import { getAi, getChainData } from '@/services/http/token.http';
import { useTokenChainStore } from '@/store';
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import AnimatedText from '../homepage/AnimatedText';

export default function ChainInfo() {
    const { selectedChain } = useTokenChainStore();
    const { data: aiData, isLoading: isAiLoading, isError } = useQuery({ queryKey: ['ai'], queryFn: getAi });
    const {
        isLoading,
        error,
        data: chainInfo,
    } = useQuery(
        {
            queryKey: ["chainData", selectedChain.symbol],
            queryFn: () => getChainData({
                params: {
                    network: selectedChain.symbol
                }
            }).then(data => data),
            refetchInterval: 5000
        }
    )

    if (isLoading) return <div className='flex items-center justify-center gap-8'>
        <Skeleton className='w-12 h-2' />
        <Skeleton className='w-12 h-2' />
    </div>


    return (
        <ul className="hidden md:flex items-center justify-center gap-10 text-muted-foreground">
            {
                chainInfo?.data?.routeSummary?.amountInUsd != undefined &&
                <li>
                    {selectedChain.nativeTokenName.toUpperCase()} : ${parseInt(chainInfo?.data.routeSummary.amountInUsd).toFixed()}
                </li>
            }
            {
                chainInfo?.data?.routeSummary?.gasUsd != undefined &&
                chainInfo?.data?.routeSummary?.amountInUsd != undefined &&
                <li>
                    gas : $ {(+chainInfo.data.routeSummary.gasUsd).toFixed(2) + ' '}
                    ({(+chainInfo.data.routeSummary.gasUsd / +chainInfo?.data.routeSummary.amountInUsd).toFixed(5) + ' '}
                    {selectedChain.nativeTokenName})
                </li>
            }
            {isAiLoading ? <Skeleton className='w-12 h-2' /> :
                <li >
                    {
                        aiData?.trend &&
                        <AnimatedText
                            className='text-muted-foreground text-base'
                            text={aiData.trend}
                        />
                    }
                </li>
            }
        </ul>
    )
}
