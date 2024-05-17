'use client'
import { useEffect, useState } from "react";
import WalletStatisticalPnLTrades from "./WalletStatisticalPnLTrades";
import WalletStatisticalPnLHistory from "./WalletStatisticalPnLHistory";
import WalletStatisticalTradeCounts from "./WalletStatisticalTradeCounts";
import WalletStatisticalPercentageHistory from "./WalletStatisticalPercentageHistory";
import { useParams, useRouter } from "next/navigation";


export default function WalletStatistical({ walletInfo, walletAddress }: any) {
  const router = useRouter();
  const params = useParams();
  const [tab, setTab] = useState("#PnL-Trades");

  useEffect(() => {
    const key = localStorage.getItem("KEY");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleScroll = (query: string) => () => {
    setTab(query);
  };

  return (
    <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="tabs tabs-boxed justify-center bg-transparent w-full lg:col-span-2 flex">
        <div
          onClick={handleScroll("#PnL-Trades")}
          className={`bg-base-300 cursor-pointer text-xs p-2 md:text-base md:p-4 font-bold  ${tab === "#PnL-Trades" &&
            "bg-background rounded-lg"
            }`}
        >
          P&L Trades
        </div>
        <div
          onClick={handleScroll("#PnL-History")}
          className={`bg-base-300 cursor-pointer text-xs p-2 md:text-base md:p-4 font-bold  ${tab === "#PnL-History" &&
            "bg-background rounded-lg"
            }`}
        >
          P&L History
        </div>
        <div
          onClick={handleScroll("#Trade-Count")}
          className={`bg-base-300 cursor-pointer text-xs p-2 md:text-base md:p-4 font-bold  ${tab === "#Trade-Count" &&
            "bg-background rounded-lg"
            }`}
        >
          Trade Count
        </div>
      </div>
      {tab === "#PnL-Trades" && (
        <div className="w-full lg:col-span-2 ">
          <WalletStatisticalPnLTrades walletAddress={walletAddress} />
        </div>
      )}
      {tab === "#PnL-History" && (
        <>
          <div className="w-full lg:col-span-2">
            <WalletStatisticalPnLHistory walletInfo={walletInfo} />
          </div>
          <div className="w-full lg:col-span-2 mt-5">
            <WalletStatisticalPercentageHistory walletInfo={walletInfo} />
          </div>
        </>
      )}
      {tab === "#Trade-Count" && (
        <div className="w-full lg:col-span-2">
          <WalletStatisticalTradeCounts walletInfo={walletInfo} />
        </div>
      )}
    </div>
  );
}
