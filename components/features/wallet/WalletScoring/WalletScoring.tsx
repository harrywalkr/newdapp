'use client';
import { useMemo } from 'react';
import WalletCaseScore from './WalletCaseScore';
import { WalletSummaryType } from '@/types/wallet-summary.type';
import { Progress } from '@/components/ui/progress';

interface Props {
  walletSummary: WalletSummaryType;
}

export default function WalletScoring({ walletSummary }: Props) {
  const chartData = (score: number, maxScore: number, color: string) => [
    { name: 'Score', value: score, color: color },
    { name: 'Remaining', value: maxScore - score, color: 'rgba(0, 0, 0, 0.07)' },
  ];

  const holdingTimeData = useMemo(
    () => chartData(walletSummary.holdingTimeScore!, 400, 'rgba(75, 192, 192, 0.5)'),
    [walletSummary]
  );

  const pnlData = useMemo(
    () => chartData(walletSummary.profitScore!, 400, 'rgba(0, 0, 0, 0.8)'),
    [walletSummary]
  );

  const marginData = useMemo(
    () => chartData(walletSummary.sizeScore!, 400, 'rgba(75, 192, 192, 0.5)'),
    [walletSummary]
  );

  const DEXTraderData = useMemo(
    () => chartData(walletSummary.DextraderScore![0]!, 400, 'rgba(0, 0, 0, 0.8)'),
    [walletSummary]
  );

  const totalScorePercentage = (walletSummary.totalScore! / 1600) * 100;

  return (
    <div className="mt-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center justify-items-center gap-8 mb-8">
        {
          walletSummary.holdingTimeScore != undefined &&
          <WalletCaseScore
            title="Duration"
            caseLabel={walletSummary.holdingTimeLabel!}
            data={holdingTimeData}
            score={walletSummary.holdingTimeScore!}
            loading={false}
            tooltipText="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio quos neque consequuntur dolorem suscipit mollitia obcaecati nulla iste possimus provident facilis eveniet fugiat amet aperiam, eum porro ratione nostrum quisquam."
          />
        }
        {
          walletSummary.profitScore != undefined &&
          <WalletCaseScore
            title="P&L"
            caseLabel={walletSummary.profitLabel!}
            caseLabelColor="bg-success/80"
            data={pnlData}
            score={walletSummary.profitScore!}
            loading={false}
            tooltipText="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio quos neque consequuntur dolorem suscipit mollitia obcaecati nulla iste possimus provident facilis eveniet fugiat amet aperiam, eum porro ratione nostrum quisquam."
          />
        }
        {
          walletSummary.sizeScore != undefined &&
          <WalletCaseScore
            title="Margin"
            caseLabel={walletSummary.buyAmountLabel!}
            caseLabelColor="bg-warning/80"
            data={marginData}
            score={walletSummary.sizeScore!}
            loading={false}
            tooltipText="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio quos neque consequuntur dolorem suscipit mollitia obcaecati nulla iste possimus provident facilis eveniet fugiat amet aperiam, eum porro ratione nostrum quisquam."
          />
        }
        {
          walletSummary.DextraderScore != undefined &&
          walletSummary.DextraderScore.length > 0 &&
          <WalletCaseScore
            title="DexTrader"
            caseLabel={walletSummary.details!}
            caseLabelColor="bg-warning/80"
            data={DEXTraderData}
            score={walletSummary.DextraderScore![0]!}
            loading={false}
            tooltipText="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio quos neque consequuntur dolorem suscipit mollitia obcaecati nulla iste possimus provident facilis eveniet fugiat amet aperiam, eum porro ratione nostrum quisquam."
          />
        }
      </div>
      <div className="relative w-full flex flex-col items-start gap-2">
        <span className="font-medium whitespace-nowrap text-base-100">
          TotalScore: {walletSummary.totalScore} / 1600
        </span>
        <Progress value={totalScorePercentage} />
      </div>
    </div>
  );
}
