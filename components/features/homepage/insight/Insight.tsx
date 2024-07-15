'use client';
import {
    Section,
    SectionContent,
    SectionHeader,
    SectionTitle,
} from '@/components/layout/Section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StrengthAnalysis from './StrengthAnalysis';
import TradersCarousel from './TradersCarousal';
import TrendsCarousel from './TrendCarousal';

export default function Insight() {

    return (
        <Section variant="vertical">
            <SectionHeader variant="vertical">
                <SectionTitle >
                    Insight & Analytics
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
