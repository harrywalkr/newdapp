"use client";
//FIXME: Replace this component with recharts
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { chartHeight, chartOptions } from "@/utils/animation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function Overview({ walletInfo }: any) {
  const [history, setHistory] = useState<any>({});

  useEffect(() => {
    const labels = Object.keys(walletInfo.totalProfits.month).reverse();
    setHistory({
      labels,
      datasets: [
        {
          data: Object.values(walletInfo.totalProfits.month).reverse(),
          borderColor: walletInfo.netProfit > 0 ? "rgb(54, 211, 153)" : "rgb(255, 99, 132)",
          backgroundColor: walletInfo.netProfit > 0 ? "rgb(54, 211, 153, 0.5)" : "rgb(255, 99, 132, 0.5)",
          fill: true,
          tension: 0.4,
          cubicInterpolationMode: "monotone",
          pointRadius: 3,
          pointHoverRadius: 10,
        },
      ],
    });
  }, [walletInfo]);

  if (!history.datasets) return;

  return (
    <div className="mt-10 w-full min-h-[300px] overflow-hidden flex flex-col justify-center items-center">
      <Line
        data={history}
        className="w-full"
        width={1248}
        height={chartHeight}
        options={chartOptions()}
      />
    </div>
  );
}
