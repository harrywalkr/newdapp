import { WalletSummaryType } from "@/types/wallet-summary.type";

export default function WalletTimelineActivity({ walletSummary }: { walletSummary: WalletSummaryType }) {
  const age = walletSummary.transactionMetrics?.walletAge ?? 0;
  const active = walletSummary.transactionMetrics?.uniqueDaysActive ?? 0;
  const firstTransaction = walletSummary.transactionMetrics?.firstTransaction;
  const latestTransaction = walletSummary.transactionMetrics?.latestTransaction;

  return (
    <div className="h-20 mt-14 lg:mt-20 px-6">
      <div className="relative w-full h-1 rounded-full bg-muted">
        {/* First Activity Pin */}
        <div className="absolute w-3 h-3 bg-gray-700 rounded-full z-20" style={{ bottom: -5, left: 0 }}>
          <div className="absolute text-xs flex flex-col items-center justify-center w-20 text-info" style={{ bottom: "20px", left: -30 }}>
            <span className="text-info/70">{firstTransaction?.time.slice(0, 10)}</span>
          </div>
          <div className="absolute text-sm flex flex-col items-center justify-center" style={{ top: "20px", left: -30 }}>
            <span className="whitespace-nowrap">First Activity</span>
          </div>
        </div>

        {/* Age Display */}
        <div className="absolute text-sm text-base-content/70 flex flex-col items-center justify-center" style={{ bottom: "20px", left: "50%", transform: 'translateX(-50%)' }}>
          Age: {age} Days
        </div>

        {/* Activity Bar */}
        <div
          className="absolute min-w-[200px] bg-brand h-full rounded-full shadow"
          style={{
            width: `${(active / age) * 100}%`,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        />
        {/* Active Days */}
        <div className="absolute text-xs whitespace-nowrap text-center" style={{ top: 20, left: '40%' }}>
          {active} Days with Activity
        </div>

        {/* Last Activity Pin */}
        <div className="absolute w-3 h-3 bg-gray-700 rounded-full z-20" style={{ bottom: -5, right: 0 }}>
          <div className="absolute text-xs flex flex-col items-center justify-center w-20 text-info" style={{ bottom: "20px", right: -30 }}>
            <span className="text-info/70">{latestTransaction?.time.slice(0, 10)}</span>
          </div>
          <div className="absolute text-sm flex flex-col items-center justify-center" style={{ top: "20px", right: -30 }}>
            <span className="whitespace-nowrap">Last Activity</span>
          </div>
        </div>
      </div>
    </div>
  );
}
