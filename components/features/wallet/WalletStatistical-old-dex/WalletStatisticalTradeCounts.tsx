"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from 'react-chartjs-2';
import { useParams } from "next/navigation";
import { chartHeight, chartOptions } from "@/utils/animation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function WalletStatisticalTradeCounts({ walletInfo }: any) {
  const [counts, setCounts] = useState<any>({});

  useEffect(() => {
    const labels = Object.keys(walletInfo.totalBuySellTimes.month).reverse();
    setCounts({
      labels,
      datasets: [
        {
          label: "Trades",
          data: Object.values(walletInfo.totalBuySellTimes.month).reverse(),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          fill: true,
          tension: 0.4,
          cubicInterpolationMode: "monotone",
          pointRadius: 3,
          pointHoverRadius: 10,
        },
      ],
    });
  }, [walletInfo]);

  if(!counts.datasets) return;

  return (
    <div className="mt-10 w-full min-h-[300px] overflow-hidden flex flex-col justify-center items-center">
      <Bar
        data={counts}
        className="w-full"
        width={1248}
        height={chartHeight}
        options={chartOptions()}
      />
    </div>
  );
}
