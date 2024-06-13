'use client'
import { chartHeight } from "@/utils/animation";
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
} from "chart.js";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Chart } from "react-chartjs-2";

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
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [trades, setTrades] = useState<any>({});
  const [profits, setProfits] = useState<any>({});

  useEffect(() => {
    fetch(`https://onchain.dextrading.com/api/swaps?address=${walletAddress}`)
      .then((data) => data.json())
      .then((json) => {
        const rawData = json.swapWallet;
        const data = rawData
          .map((dd: any) => {
            let bt = [];
            let st = [];
            bt = dd["Buy Times"];
            st = dd["Sell Times"];
            return {
              ...dd,
              buyTime: bt,
              sellTime: st,
            };
          })
          .map((dd: any) => {
            const times = [
              ...dd.buyTime.map((d: any) => d.time),
              ...dd.sellTime.map((d: any) => d.time),
            ];
            return {
              ...dd,
              TTime: times[0],
            };
          });
        const ddd = data.sort((a: any, b: any) => {
          const aTime = new Date(a.TTime).getTime();
          const bTime = new Date(b.TTime).getTime();

          return aTime > bTime ? -1 : aTime < bTime ? 1 : 0;
        });
        const labels: string[] = ddd.map((j: any) => j["tokenName"]);
        setTrades({
          labels,
          datasets: [
            {
              type: "bar" as const,
              label: "Buy Amount (USD)",
              borderColor: "rgb(53, 162, 235)",
              backgroundColor: "rgb(53, 162, 235, 0.5)",
              fill: true,
              tension: 0.4,
              cubicInterpolationMode: "monotone",
              pointRadius: 3,
              pointHoverRadius: 10,
              data: ddd.map((d: any) =>
                d["Buy Amount (USD)"]
              ),
            },
            {
              type: "bar" as const,
              label: "Sell Amount (USD)",
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.5)",
              fill: true,
              tension: 0.4,
              cubicInterpolationMode: "monotone",
              pointRadius: 3,
              pointHoverRadius: 10,
              data: ddd.map((d: any) =>
                d["Sell Amount (USD)"]
              ),
            },
          ],
        });
        setProfits({
          labels,
          datasets: [
            {
              type: "line" as const,
              label: "Profit (USD)",
              borderColor: "rgb(54, 211, 153)",
              backgroundColor: "rgba(54, 211, 153, 0.5)",
              tension: 0.4,
              cubicInterpolationMode: "monotone",
              pointRadius: 3,
              pointHoverRadius: 10,
              borderWidth: 2,
              fill: false,
              data: ddd.map((d: any) =>
                d["Profit"]
              ),
            },
          ],
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (!trades.datasets || !profits.datasets) return;

  return (
    <div className="mt-10 w-full min-h-[300px] overflow-hidden flex flex-col justify-center items-center gap-5 ">
      {loading ? (
        <span className="loading loading-bars loading-md"></span>
      ) : (
        <div className="w-full">
          <Chart
            type="bar"
            data={trades}
            className="w-full"
            width={1248}
            height={chartHeight}
          />
          <Chart
            type="line"
            data={profits}
            className="w-full"
            width={1248}
            height={chartHeight}
          />
        </div>
      )}
    </div>
  );
}
