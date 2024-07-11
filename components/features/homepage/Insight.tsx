'use client';

import { useQuery } from '@tanstack/react-query';
import {
    Section,
    SectionContent,
    SectionHeader,
    SectionTitle,
} from '@/components/layout/Section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAi } from '@/services/http/token.http';
import StrengthAnalysis from './StrengthAnalysis';
import TradersCarousel from './TradersCarousal';
import TrendsCarousel from './TrendCarousal';
import { Skeleton } from '@/components/ui/skeleton';
import AnimatedList from './AnimatedText';

export default function Insight() {
    const { data: aiData, isLoading: isAiLoading, isError } = useQuery({ queryKey: ['ai'], queryFn: getAi });

    return (
        <Section variant="vertical">
            <SectionHeader variant="vertical">
                <SectionTitle className='flex items-center justify-center gap-4'>
                    <span>
                        AI Trend Detector
                    </span>
                    <span>
                        {isAiLoading ? <Skeleton className='w-12 h-2' /> :
                            <span >
                                {
                                    aiData?.trend &&
                                    <AnimatedList className='text-muted-foreground text-base' words={[aiData.trend]} />
                                }
                            </span>
                        }
                    </span>
                </SectionTitle>
            </SectionHeader>
            <SectionContent variant="vertical">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 w-full">
                    <Card>
                        <CardHeader className='space-y-0 p-4'>
                            <CardTitle>Trending Traders</CardTitle>
                        </CardHeader>
                        <CardContent className='!p-4 !pt-0'>
                            <TradersCarousel />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className='space-y-0 p-4'>
                            <CardTitle>Hot Tokens</CardTitle>
                        </CardHeader>
                        <CardContent className='!p-4 !pt-0'>
                            <TrendsCarousel />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className='space-y-0 p-4'>
                            <CardTitle>Market Index</CardTitle>
                        </CardHeader>
                        <StrengthAnalysis />
                    </Card>
                </div>
            </SectionContent>
        </Section>
    );
}
