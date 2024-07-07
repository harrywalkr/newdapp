'use client';

import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Section,
    SectionContent,
    SectionDescription,
    SectionHeader,
    SectionTitle,
} from '@/components/layout/Section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getAi } from '@/services/http/token.http';
import StrengthAnalysis from './StrengthAnalysis';
import { useTokenChainStore } from '@/store';
import TradersCarousel from './TradersCarousal';
import TrendsCarousel from './TrendCarousal';
import Loading from '@/components/layout/Loading';

export default function Insight() {
    const { selectedChain } = useTokenChainStore();

    // const { isLoading: isAiLoading, error: aiError, data: ai } = useQuery({
    //     queryKey: ['ai'],
    //     queryFn: () => getAi(),
    //     refetchInterval: 300000,
    // });

    if (aiError) return <div>Failed to load data, please try again.</div>;

    return (
        <Section variant="vertical">
            <SectionHeader variant="vertical">
                <SectionTitle>Insight & Analytics</SectionTitle>
                <SectionDescription>
                    Transform data into actionable intelligence for smarter decisions and strategic growth.
                </SectionDescription>
            </SectionHeader>
            <SectionContent variant="vertical">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-14 w-full">
                    <Card>
                        <CardHeader>
                            <CardTitle>Trending Traders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TradersCarousel />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Hot Tokens</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {
                                isAiLoading ? (
                                    <Loading times={3} />
                                ) : (
                                    <TrendsCarousel />
                                )
                            }
                        </CardContent>
                    </Card>
                    <Card>
                        {
                            isAiLoading ? (
                                <Loading times={3} />
                            ) : (
                                <StrengthAnalysis />
                            )
                        }
                    </Card>
                </div>
            </SectionContent>
        </Section>
    );
}
