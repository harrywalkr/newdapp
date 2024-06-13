"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { AiOutlineInfoCircle } from "react-icons/ai";

ChartJS.register(ArcElement, Tooltip, Legend);

type CaseScoreProps = {
  title: string;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  };
  score: number;
  loading: boolean;
  tooltipText: string;
  caseLabel: string;
  caseLabelColor?: string;
};

export default function WalletCaseScore({
  title,
  data,
  score,
  loading,
  tooltipText,
  caseLabel,
  caseLabelColor,
}: CaseScoreProps) {
  return (
    <div className="flex flex-col max-w-xs items-center">
      <h2 className="font-medium text-lg text-center flex items-center space-x-1">
        <span>
          {title}
          {!loading && `(${score})`}
        </span>
        <div className="tooltip tooltip-bottom" data-tip={tooltipText}>
          <AiOutlineInfoCircle className="text-xl cursor-pointer" />
        </div>
      </h2>
      <div className="w-[200px] h-[200px] overflow-hidden flex justify-center items-center relative">
        {loading ? (
          <span className="loading loading-bars loading-md"></span>
        ) : (
          <>
            <Doughnut data={data} className="w-[200px] h-[200px]" />
            <p className="absolute text-lg opacity-70 font-bold">{score}</p>
          </>
        )}
      </div>
      <div className={`h-min flex justify-center gap-1 ${caseLabelColor || 'bg-base-content/80'} p-2 rounded-md px-4 mt-5`}>
        <span className="font-medium whitespace-nowrap text-base-100">
          {caseLabel}
        </span>
      </div>
    </div>
  );
}
