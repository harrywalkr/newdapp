'use client';
import { useState, useEffect } from 'react';
import { Chart } from 'react-chartjs-2';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import { getWalletSwaps } from '@/services/http/wallets.http';
import { useQuery } from '@tanstack/react-query';
import { useTokenChainStore } from '@/store';
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { SwapWallet } from '@/types/swap.type';

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);

const getTimeRange = (period: 'week' | 'month' | '3 months' | 'year' | 'all') => {
  const now = new Date();
  let from, till;

  switch (period) {
    case 'week':
      from = new Date(now.setDate(now.getDate() - 7));
      till = new Date();
      break;
    case 'month':
      from = new Date(now.setMonth(now.getMonth() - 1));
      till = new Date();
      break;
    case '3 months':
      from = new Date(now.setMonth(now.getMonth() - 3));
      till = new Date();
      break;
    case 'year':
      from = new Date(now.setFullYear(now.getFullYear() - 1));
      till = new Date();
      break;
    case 'all':
    default:
      from = new Date(0);
      till = new Date();
      break;
  }

  return { from: from.toISOString().split('T')[0], till: till.toISOString().split('T')[0] };
};

export default function WalletStatisticalPnLTrades({ walletAddress }: { walletAddress: string }) {
  const { selectedChain } = useTokenChainStore();
  const [period, setPeriod] = useState<'week' | 'month' | '3 months' | 'year' | 'all'>('all');
  const { from, till } = getTimeRange(period);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['swapWallet', walletAddress, 'category=walletSwaps', selectedChain.symbol, from, till],
    queryFn: () => getWalletSwaps({
      params: {
        address: walletAddress,
        network: selectedChain.symbol,
        category: 'swapWallet',
        SellTimeFrom: from,
        SellTimeTill: till,
      }
    })
  });

  useEffect(() => {
    refetch();
  }, [period]);

  if (isLoading) {
    return <span className="loading loading-bars loading-md">loading ...</span>;
  }

  if (error || !data) {
    return <span>Error loading data</span>;
  }

  const processedData = (data as unknown as SwapWallet[]).map((dd: any) => {
    const buyTimes = dd['Buy Times'];
    const sellTimes = dd['Sell Times'];
    return {
      ...dd,
      buyTime: buyTimes,
      sellTime: sellTimes,
    };
  })
    .map((dd: any) => {
      const times = [...dd.buyTime.map((d: any) => d.time), ...dd.sellTime.map((d: any) => d.time)];
      return {
        ...dd,
        TTime: times[0],
      };
    });

  const sortedData = processedData.sort((a: any, b: any) => {
    const aTime = new Date(a.TTime).getTime();
    const bTime = new Date(b.TTime).getTime();
    return aTime > bTime ? -1 : aTime < bTime ? 1 : 0;
  });

  const labels = sortedData.map((item: any) => item['tokenName']);
  const buyAmounts = sortedData.map((item: any) => item['Buy Amount (USD)']);
  const sellAmounts = sortedData.map((item: any) => item['Sell Amount (USD)']);
  const profits = sortedData.map((item: any) => item['Profit']);

  const tradesData = {
    labels,
    datasets: [
      {
        type: 'bar' as const,
        label: 'Buy Amount (USD)',
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        data: buyAmounts,
      },
      {
        type: 'bar' as const,
        label: 'Sell Amount (USD)',
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        data: sellAmounts,
      },
    ],
  };

  const profitsData = {
    labels,
    datasets: [
      {
        type: 'line' as const,
        label: 'Profit (USD)',
        borderColor: 'rgb(54, 211, 153)',
        backgroundColor: 'rgba(54, 211, 153, 0.5)',
        data: profits,
      },
    ],
  };

  return (
    <div className="w-full">
      <ToggleGroup type="single" onValueChange={(value) => setPeriod(value as 'week' | 'month' | '3 months' | 'year' | 'all')} value={period}>
        <ToggleGroupItem value="week" aria-label="Toggle week">
          week
        </ToggleGroupItem>
        <ToggleGroupItem value="month" aria-label="Toggle month">
          month
        </ToggleGroupItem>
        <ToggleGroupItem value="3 months" aria-label="Toggle 3 months">
          3 months
        </ToggleGroupItem>
        <ToggleGroupItem value="year" aria-label="Toggle year">
          year
        </ToggleGroupItem>
        <ToggleGroupItem value="all" aria-label="Toggle all">
          all
        </ToggleGroupItem>
      </ToggleGroup>
      <Chart type="bar" data={tradesData} className="w-full mt-5" />
      <Chart type="line" data={profitsData} className="w-full" />
    </div>
  );
}
