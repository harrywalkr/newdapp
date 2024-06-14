'use client';

import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { AiOutlineInfoCircle } from 'react-icons/ai';

type CaseScoreProps = {
  title: string;
  data: { name: string; value: number; color: string }[];
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
      <div className="font-medium text-lg text-center flex items-center space-x-1">
        <span>
          {title}
          {!loading && `(${score})`}
        </span>
        <div className="tooltip tooltip-bottom" data-tip={tooltipText}>
          <AiOutlineInfoCircle className="text-xl cursor-pointer" />
        </div>
      </div>
      <div className="w-[200px] h-[200px] overflow-hidden flex justify-center items-center relative">
        {loading ? (
          <span className="loading loading-bars loading-md">loading ...</span>
        ) : (
          <>
            <PieChart width={200} height={200}>
              <Pie
                data={data}
                cx={100}
                cy={100}
                innerRadius={57}
                outerRadius={65}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
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
