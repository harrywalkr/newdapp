'use client';
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

export default function WalletStatisticalPnLTrades({ walletAddress }: { walletAddress: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['walletSwaps', walletAddress],
    queryFn: () => getWalletSwaps({ params: { address: walletAddress } })
  })

  if (isLoading) {
    return <span className="loading loading-bars loading-md">loading ...</span>;
  }

  if (error || !data) {
    return <span>Error loading data</span>;
  }

  const rawData = data.swapWallet;
  const processedData = rawData
    .map((dd: any) => {
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
        <Chart type="bar" data={tradesData} className="w-full" />
        <Chart type="line" data={profitsData} className="w-full" />
      </div>
  );
}
