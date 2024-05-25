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


  return (
    <div className="mt-10 w-full min-h-[300px] overflow-hidden flex flex-col justify-center items-center">
   
    </div>
  );
}
