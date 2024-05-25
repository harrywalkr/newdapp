'use client';
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { chartHeight, chartOptions } from "@/utils/animation";

let ChartJS;
if (typeof window !== "undefined") {
  import("chart.js").then((module) => {
    ChartJS = module.Chart;
    ChartJS.register(
      module.CategoryScale,
      module.LinearScale,
      module.PointElement,
      module.LineElement,
      module.Title,
      module.Tooltip,
      module.Legend
    );
  });
}

export function Overview({ walletInfo }: any) {
  const [history, setHistory] = useState<any>({});

  useEffect(() => {
    if (typeof window !== "undefined" && walletInfo && walletInfo.totalProfits && walletInfo.totalProfits.month) {
      const labels = Object.keys(walletInfo.totalProfits.month).reverse();
      const data = Object.values(walletInfo.totalProfits.month).reverse();

      setHistory({
        labels,
        datasets: [
          {
            data,
            borderColor: walletInfo.netProfit > 0 ? 'rgb(54, 211, 153)' : 'rgb(255, 99, 132)',
            backgroundColor: walletInfo.netProfit > 0 ? 'rgba(54, 211, 153, 0.5)' : 'rgba(255, 99, 132, 0.5)',
            fill: true,
            tension: 0.4,
            cubicInterpolationMode: 'monotone',
            pointRadius: 3,
            pointHoverRadius: 10,
          },
        ],
      });
    }
  }, [walletInfo]);

  if (!history.datasets) return null; // Handle the case where history is not set

  return (
    <div className="mt-10 w-full min-h-[300px] overflow-hidden flex flex-col justify-center items-center">
      {/* <Line
        data={history}
        className="w-full"
        width={1248}
        height={chartHeight}
        options={chartOptions()}
      /> */}
    </div>
  );
}
