// "use client"

// import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

// const data = [
//   {
//     name: "Jan",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Feb",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Mar",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Apr",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "May",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Jun",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Jul",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Aug",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Sep",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Oct",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Nov",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Dec",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
// ]

// export function Overview() {
//   return (
//     <ResponsiveContainer width="100%" height={350}>
//       <BarChart data={data}>
//         <XAxis
//           dataKey="name"
//           stroke="#888888"
//           fontSize={12}
//           tickLine={false}
//           axisLine={false}
//         />
//         <YAxis
//           stroke="#888888"
//           fontSize={12}
//           tickLine={false}
//           axisLine={false}
//           tickFormatter={(value) => `$${value}`}
//         />
//         <Bar
//           dataKey="total"
//           fill="currentColor"
//           radius={[4, 4, 0, 0]}
//           className="fill-primary"
//         />
//       </BarChart>
//     </ResponsiveContainer>
//   )
// }


"use client";

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
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { chartHeight, chartOptions } from "@/utils/animation";

// 0x162bb2bb5fb03976a69dd25bb9afce6140db1433

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
