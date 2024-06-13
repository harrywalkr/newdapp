// StrengthAnalysisCard.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    LineChart,
    Line,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import clsx from 'clsx';
import { getStrengthRatio } from '@/services/http/token.http';
import { History } from '@/types/strength-ratio.type';

const StrengthAnalysis: React.FC = () => {
    const { isLoading, error, data: strengthRatio } = useQuery({
        queryKey: ['strength'],
        queryFn: () => getStrengthRatio(),
        refetchInterval: 300000,
    });

    if (error) return <div>Failed to load data, please try again.</div>;
    if (isLoading) return <div>Loading...</div>;

    const formattedData = strengthRatio?.history.map((entry: History) => ({
        timestamp: new Date(entry.timestamp).toLocaleDateString(),
        averageMarketStrength: entry.averageMarketStrength,
    }));

    const gradientOffset = () => {
        if (!formattedData) return 0;
        const dataMax = Math.max(...formattedData.map(d => d.averageMarketStrength!));
        const dataMin = Math.min(...formattedData.map(d => d.averageMarketStrength!));
        if (dataMax <= 0) {
            return 0;
        } else if (dataMin >= 0) {
            return 1;
        } else {
            return dataMax / (dataMax - dataMin);
        }
    };

    const off = gradientOffset();

    const renderCustomDot = (props: any) => {
        const { cx, cy, value, index } = props;
        const isLastPoint = index === formattedData!.length - 1;
        return (
            <circle
                cx={cx}
                cy={cy}
                r={0}
                stroke={value >= 0 ? '#86efac' : '#ef4444'}
                strokeWidth={1}
                fill={value >= 0 ? '#86efac' : '#ef4444'}
                className={clsx({ blink: isLastPoint })}
            />
        );
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p>{`Date: ${payload[0].payload.timestamp}`}</p>
                    <p>{`Strength: ${payload[0].value.toFixed(2)}`}</p>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="strength-analysis">
            <div className="content">
                <ResponsiveContainer width="100%" height={100}>
                    <LineChart data={formattedData}>
                        <defs>
                            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                                <stop offset={off} stopColor="#86efac" />
                                <stop offset={off} stopColor="#ef4444" />
                            </linearGradient>
                        </defs>
                        <YAxis
                            ticks={[-1, 0, 1]}
                            tickFormatter={(value) => value.toFixed(2)}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="averageMarketStrength"
                            stroke="url(#splitColor)"
                            strokeWidth={1}
                            dot={renderCustomDot}
                        />
                    </LineChart>
                </ResponsiveContainer>
                {
                    strengthRatio?.averageMarketStrength !== undefined &&
                    <div className="text-muted-foreground mt-7">Average Market Strength: {strengthRatio.averageMarketStrength.toFixed(2)}</div>
                }
            </div>
        </div>
    );
};

export default StrengthAnalysis;
