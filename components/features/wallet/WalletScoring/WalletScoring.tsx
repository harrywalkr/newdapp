'use client'
import { useMemo } from "react";
import WalletCaseScore from "./WalletCaseScore";
import { WalletSummaryType } from "@/types/wallet-summary.type";
import { Progress } from "@/components/ui/progress";

interface Props {
  walletSummary: WalletSummaryType
}

export default function WalletScoring({ walletSummary }: Props) {
  const chartConfig = (score: number, maxScore: number, backgroundColor: string, borderColor: string) => ({
    labels: [],
    datasets: [
      {
        label: "Score",
        data: [score, maxScore - score],
        backgroundColor: [backgroundColor, "rgba(255, 255, 255, 0.2)"],
        borderColor: [borderColor],
        borderWidth: 1,
      },
    ],
  });

  const holdingTimeData = useMemo(
    () => chartConfig(walletSummary.holdingTimeScore!, 400, "rgba(75, 192, 192, 0.2)", "rgba(75, 192, 192, 1)"),
    [walletSummary]
  );

  const pnlData = useMemo(
    () => chartConfig(walletSummary.profitScore!, 400, "rgba(54, 162, 235, 0.2)", "rgba(54, 162, 235, 1)"),
    [walletSummary]
  );

  const marginData = useMemo(
    () => chartConfig(walletSummary.sizeScore!, 400, "rgba(153, 102, 255, 0.2)", "rgba(153, 102, 255, 1)"),
    [walletSummary]
  );

  const DEXTraderData = useMemo(
    () => chartConfig(walletSummary.DextraderScore![0]!, 400, "rgba(54, 162, 235, 0.2)", "rgba(54, 162, 235, 1)"),
    [walletSummary]
  );

  const totalScorePercentage = (walletSummary.totalScore! / 1600) * 100;

  return (
    <div className="mt-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center justify-items-center gap-8 mb-8">
        <WalletCaseScore
          title="Duration"
          caseLabel={walletSummary.holdingTimeLabel!}
          data={holdingTimeData}
          score={walletSummary.holdingTimeScore!}
          loading={false}
          tooltipText="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio quos neque consequuntur dolorem suscipit mollitia obcaecati nulla iste possimus provident facilis eveniet fugiat amet aperiam, eum porro ratione nostrum quisquam."
        />
        <WalletCaseScore
          title="P&L"
          caseLabel={walletSummary.profitLabel!}
          caseLabelColor="bg-success/80"
          data={pnlData}
          score={walletSummary.profitScore!}
          loading={false}
          tooltipText="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio quos neque consequuntur dolorem suscipit mollitia obcaecati nulla iste possimus provident facilis eveniet fugiat amet aperiam, eum porro ratione nostrum quisquam."
        />
        <WalletCaseScore
          title="Margin"
          caseLabel={walletSummary.buyAmountLabel!}
          caseLabelColor="bg-warning/80"
          data={marginData}
          score={walletSummary.sizeScore!}
          loading={false}
          tooltipText="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio quos neque consequuntur dolorem suscipit mollitia obcaecati nulla iste possimus provident facilis eveniet fugiat amet aperiam, eum porro ratione nostrum quisquam."
        />
        <WalletCaseScore
          title="DexTrader"
          caseLabel={walletSummary.details!}
          caseLabelColor="bg-warning/80"
          data={DEXTraderData}
          score={walletSummary.DextraderScore![0]!}
          loading={false}
          tooltipText="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio quos neque consequuntur dolorem suscipit mollitia obcaecati nulla iste possimus provident facilis eveniet fugiat amet aperiam, eum porro ratione nostrum quisquam."
        />
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
