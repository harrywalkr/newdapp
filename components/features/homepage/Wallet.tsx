'use client'

import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  SectionContent,
} from "@/components/layout/Section";
import { WalletType } from "@/types/Wallet.type";
import { useEffect, useState } from "react";
import TopWalletsFilter from "../wallet/WalletsFilter";
import { initTopWalletFilters, topWalletFiltersEnum, topWalletLayouts } from "@/types/topwallet.type";
import { convertIsoToDate } from "@/utils/date";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";


interface Prop {
  initTopWallets: WalletType[];
}


export default function Wallet({ initTopWallets }: Prop) {
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [wallets, setWallets] = useState(initTopWallets);
  const [filtered, setFiltered] = useState(initTopWallets);
  const [sort, setSort] = useState<{ [key: string]: boolean }>({
    rank: true,
    label: false,
    pnl: false,
    winRate: false,
    dayActive: false,
    avgHoldingTime: false,
    nftActivity: false,
    totalScore: false,
    age: false,
    walletAddress: false,
    SwapTime: false,
    TotalFee: false,
    HotHolder: false,
    BotActivity: false,
    details: false,
    totalnumPartiallyClosedData: false,
    totalNumofFullyOpenedData: false,
    totalTransactions: false,
  });
  const [layout, setLayout] = useState(topWalletLayouts);
  const [filters, setFilters] = useState(initTopWalletFilters);

  const handleNext = () => setPage((prev) => prev + 1);
  const handlePrev = () => setPage((prev) => prev - 1);

  useEffect(() => {
    let cloneFiltered: Wallet[] = [...wallets];
    Object.keys(filters).forEach((item: string) => {
      if (item === "rank" && filters.rank.value !== undefined) {
        cloneFiltered = cloneFiltered.filter(
          (i: Wallet) =>
            +i.rank >= filters.rank.value[0]! &&
            +i.rank <= filters.rank.value[1]!
        );
      } else if (item === "label" && filters.label.value !== undefined) {
        cloneFiltered = cloneFiltered.filter(
          (i: Wallet) => i.buyAmountLabel === filters.label.value
        );
      } else if (item === "pnl" && filters.pnl.value !== undefined) {
        cloneFiltered = cloneFiltered.filter(
          (i: Wallet) =>
            +i.netProfit.toFixed(2) >= filters.pnl.value[0]! &&
            +i.netProfit.toFixed(2) <= filters.pnl.value[1]!
        );
      } else if (item === "winRate" && filters.winRate.value !== undefined) {
        cloneFiltered = cloneFiltered.filter(
          (i: Wallet) =>
            Math.ceil(i.winRate / 10) >= filters.winRate.value[0]! &&
            Math.ceil(i.winRate / 10) <= filters.winRate.value[1]!
        );
      } else if (
        item === "dayActive" &&
        filters.dayActive.value !== undefined
      ) {
        cloneFiltered = cloneFiltered.filter(
          (i: Wallet) =>
            i.dayActive >= filters.dayActive.value[0]! &&
            i.dayActive <= filters.dayActive.value[1]!
        );
      } else if (
        item === "avgHoldingTime" &&
        filters.avgHoldingTime.value !== undefined
      ) {
        cloneFiltered = cloneFiltered.filter((i: Wallet) => {
          if (!i.avgHoldingTime) return true;
          return (
            +i.avgHoldingTime?.toFixed() >= filters.avgHoldingTime.value[0]! &&
            +i.avgHoldingTime?.toFixed() <= filters.avgHoldingTime.value[1]!
          );
        });
      } else if (
        item === "nftActivity" &&
        filters.nftActivity.value !== undefined
      ) {
        cloneFiltered = cloneFiltered.filter(() => {
          // backend implementation of nft pending
          if (filters.nftActivity.value === "yes") return true;
          return false;
        });
      } else if (
        item === "totalScore" &&
        filters.totalScore.value !== undefined
      ) {
        cloneFiltered = cloneFiltered.filter(
          (i: Wallet) =>
            i.totalScore >= filters.totalScore.value[0]! &&
            i.totalScore <= filters.totalScore.value[1]!
        );
      } else if (item === "age" && filters.age.value !== undefined) {
        cloneFiltered = cloneFiltered.filter(
          (i: Wallet) =>
            i.age >= filters.age.value[0]! && i.age <= filters.age.value[1]!
        );
      } else if (item === "TotalFee" && filters.TotalFee.value !== undefined) {
        cloneFiltered = cloneFiltered.filter((i: Wallet) => {
          return (
            +i.TotalFee?.toFixed() >= filters.TotalFee.value[0]! &&
            +i.TotalFee?.toFixed() <= filters.TotalFee.value[1]!
          );
        });
      }
    });
    setFiltered(cloneFiltered as any);
    setPage(0);
  }, [filters]);

  if (loading)
    return (
      <div className="w-full h-[800px] flex justify-center items-center">
        <span className="loading loading-bars loading-md"></span>
      </div>
    );

  const handleSort = (key: string) => {
    let cloneFiltered = [...filtered];
    switch (key) {
      case "pnl":
        cloneFiltered = cloneFiltered.sort((a: any, b: any) => {
          if (sort[key] === true) {
            updateSort(key, false);
            return b.netProfit + a.netProfit;
          } else {
            updateSort(key, true);
            return a.netProfit - b.netProfit;
          }
        });
        setFiltered(cloneFiltered);
        break;
      case "SwapTime":
        cloneFiltered = cloneFiltered.sort((a: Wallet, b: Wallet) => {
          if (sort[key] === true) {
            updateSort(key, false);
            if (!b.SwapTime[0] || !a.SwapTime[0]) return 0;
            return (
              +convertIsoToDate(b.SwapTime[0]!) -
              +convertIsoToDate(a.SwapTime[0]!)
            );
          } else {
            updateSort(key, true);
            if (!b.SwapTime[0] || !a.SwapTime[0]) return 0;
            return (
              +convertIsoToDate(a.SwapTime[0]!) -
              +convertIsoToDate(b.SwapTime[0]!)
            );
          }
        });
        setFiltered(cloneFiltered);
        break;
      case "label":
        const labels = ["Medium Size", "Large Size", "Small Size"];
        cloneFiltered = cloneFiltered.sort((a, b) => {
          if (sort[key] === true) {
            updateSort(key, false);
            return (
              labels.indexOf(a.buyAmountLabel) -
              labels.indexOf(b.buyAmountLabel)
            );
          } else {
            updateSort(key, true);
            return (
              labels.indexOf(b.buyAmountLabel) -
              labels.indexOf(a.buyAmountLabel)
            );
          }
        });
        setFiltered(cloneFiltered);
        break;
      case "BotActivity":
        const BotActivities = ["Not Bot activity", "Bot activity"];
        cloneFiltered = cloneFiltered.sort((a, b) => {
          if (sort[key] === true) {
            updateSort(key, false);
            return (
              BotActivities.indexOf(a.BotActivity) -
              BotActivities.indexOf(b.BotActivity)
            );
          } else {
            updateSort(key, true);
            return (
              BotActivities.indexOf(b.BotActivity) -
              BotActivities.indexOf(a.BotActivity)
            );
          }
        });
        setFiltered(cloneFiltered);
        break;
      case "details":
        const details = ["Dex Trader", "Not a Dex Trader"];
        cloneFiltered = cloneFiltered.sort((a, b) => {
          if (sort[key] === true) {
            updateSort(key, false);
            return details.indexOf(a.details) - details.indexOf(b.details);
          } else {
            updateSort(key, true);
            return details.indexOf(b.details) - details.indexOf(a.details);
          }
        });
        setFiltered(cloneFiltered);
        break;
      default:
        cloneFiltered = cloneFiltered.sort((a: any, b: any) => {
          if (sort[key] === true) {
            updateSort(key, false);
            return -a[key] + b[key];
          } else {
            updateSort(key, true);
            // setSort({ ...sort, [key]: true });
            return a[key] - b[key];
          }
        });
        setFiltered(cloneFiltered);
        break;
    }
  };

  const updateSort = (key: string, value: boolean) => {
    setSort((prevSort) => ({
      ...Object.fromEntries(
        Object.keys(prevSort).map((k) => [k, k === key ? value : false])
      ),
    }));
  };

  return (
    <Section variant={'vertical'}>
      <SectionHeader variant={'vertical'}>
        <SectionTitle>Profitable Wallets</SectionTitle>
        <SectionDescription>
          Find out more about winner wallets and their trade secrets
        </SectionDescription>
      </SectionHeader>
      <SectionContent variant={'vertical'}>
        
        <TopWalletsFilter
          layout={layout}
          setLayout={setLayout}
          filters={filters}
          setFilters={setFilters}
          wallet={initTopWallets}
          onSearch={setFiltered}
        />
        <ScrollArea className="w-full rounded-md pb-4">
          <ScrollBar orientation="horizontal" />
          <Table className="bg-card">
            <TableHeader>
              <TableRow>
                {layout[topWalletFiltersEnum.rank] && (
                  <TableHead className="w-[100px]"
                    onClick={() => handleSort("rank")}
                  >Rank</TableHead>
                )}
                {layout[topWalletFiltersEnum.walletAddress] && (
                  <TableHead
                    className="whitespace-nowrap	"
                    onClick={() => handleSort("walletAddress")}
                  >
                    Wallet Address
                  </TableHead>
                )}
                {layout[topWalletFiltersEnum.label] && (
                  <TableHead
                    className="whitespace-nowrap	"
                    onClick={() => handleSort("label")}
                  >
                    Label
                  </TableHead>
                )}
                {layout[topWalletFiltersEnum.pnl] && (
                  <TableHead
                    className="whitespace-nowrap	"
                    onClick={() => handleSort("pnl")}
                  >
                    P&L
                  </TableHead>
                )}
                {layout[topWalletFiltersEnum.winRate] && (
                  <TableHead
                    className="whitespace-nowrap	"
                    onClick={() => handleSort("winRate")}
                  >
                    winRate
                  </TableHead>
                )}
                {layout[topWalletFiltersEnum.dayActive] && (
                  <TableHead
                    className="whitespace-nowrap	"
                    onClick={() => handleSort("dayActive")}
                  >
                    Active Days
                  </TableHead>
                )}
                {layout[topWalletFiltersEnum.HotHolder] && (
                  <TableHead
                    className="whitespace-nowrap	"
                    onClick={() => handleSort("HotHolder")}
                  >
                    Hot Holder
                  </TableHead>
                )}
                {layout[topWalletFiltersEnum.avgHoldingTime] && (
                  <TableHead
                    className="whitespace-nowrap	"
                    onClick={() => handleSort("avgHoldingTime")}
                  >
                    Average Position Duration
                  </TableHead>
                )}
                {layout[topWalletFiltersEnum.age] && (
                  <TableHead
                    className="whitespace-nowrap	"
                    onClick={() => handleSort("age")}
                  >
                    Age
                  </TableHead>
                )}
                {layout[topWalletFiltersEnum.SwapTime] && (
                  <TableHead
                    className="whitespace-nowrap	"
                    onClick={() => handleSort("SwapTime")}
                  >
                    SwapTime
                  </TableHead>
                )}
                {layout[topWalletFiltersEnum.TotalFee] && (
                  <TableHead
                    className="whitespace-nowrap	"
                    onClick={() => handleSort("TotalFee")}
                  >
                    Total Fee
                  </TableHead>
                )}
                {layout[topWalletFiltersEnum.BotActivity] && (
                  <TableHead
                    className="whitespace-nowrap	"
                    onClick={() => handleSort("BotActivity")}
                  >
                    Bot Activity
                  </TableHead>
                )}
                {layout[topWalletFiltersEnum.details] && (
                  <TableHead
                    className="whitespace-nowrap	"
                    onClick={() => handleSort("details")}
                  >
                    Dex Trader
                  </TableHead>
                )}
                {layout[topWalletFiltersEnum.totalnumPartiallyClosedData] && (
                  <TableHead
                    className="whitespace-nowrap	"
                    onClick={() => handleSort("totalnumPartiallyClosedData")}
                  >
                    Total number of Partially Closed Data
                  </TableHead>
                )}
                {layout[topWalletFiltersEnum.totalNumofFullyOpenedData] && (
                  <TableHead
                    className="whitespace-nowrap	"
                    onClick={() => handleSort("totalNumofFullyOpenedData")}
                  >
                    Total Number of Fully Opened Data
                  </TableHead>
                )}
                {layout[topWalletFiltersEnum.totalTransactions] && (
                  <TableHead
                    className="whitespace-nowrap	"
                    onClick={() => handleSort("totalTransactions")}
                  >
                    Total Transactions
                  </TableHead>
                )}
                {layout[topWalletFiltersEnum.totalScore] && (
                  <TableHead
                    className="whitespace-nowrap	"
                    onClick={() => handleSort("totalScore")}
                  >
                    Total Score
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered
                .slice(page * 10, (page + 1) * 10)
                .map((d: any, idx: number) => (
                  <Record key={d.walletAddress} data={d} layout={layout} />
                  // <TableCell>Credit Card</TableCell>
                ))}
            </TableBody>
          </Table>
        </ScrollArea>


        <div className="mt-5 flex justify-end items-center">
          <span className="text-info text-sm">Next/Previous</span>
          {/* <FiChevronsLeft
                className={`ml-2 ${page === 0 && "opacity-30 pointer-events-none"
                  } text-xl cursor-pointer`}
                onClick={() => setPage(0)}
              />
              <CiCircleChevLeft
                className={`text-3xl cursor-pointer ml-2 ${page === 0 && "opacity-30 pointer-events-none"
                  }`}
                onClick={handlePrev}
              />
              <span className="mx-2">{page + 1}</span>
              <CiCircleChevRight
                className={`text-3xl cursor-pointer ${(page + 1) * 10 >= filtered.length &&
                  "opacity-30 pointer-events-none"
                  }`}
                onClick={handleNext}
              /> */}
        </div>
      </SectionContent>
    </Section>
  );
}


const Record = ({ data, layout }: { data: any; layout: any }) => {
  return (
    <TableRow>
      {layout.rank && (
        <TableCell className={`text-base-content text-center`}>{data.rank}</TableCell>
      )}
      {layout.walletAddress && (
        <TableCell className={`text-base-content max-w-[400px]`}>
          <div className="flex items-center gap-2">
            <div className="flex space-x-2 items-center">
              <div className="flex flex-col gap-2">
                <Link
                  href={`/wallet/${data.walletAddress}`}
                  className="font-medium link link-hover hover:text-info"
                >
                  {/* {minifyContract(data.walletAddress)} */}
                </Link>
              </div>
              {/* <CopyAddress address={data.walletAddress} /> */}
            </div>
          </div>
        </TableCell>
      )}
      {layout.label && (
        <TableCell className={`text-base-content whitespace-nowrap`}>
          <div className="p-2 bg-base-content/70 text-base-100 rounded-lg max-w-[100px] text-center whitespace-nowrap">
            {data.buyAmountLabel}
          </div>
        </TableCell>
      )}
      {layout.pnl && (
        <TableCell
          className={`text-base-content whitespace-nowrap ${data.netProfit > 0 ? "text-success" : "text-error"
            }`}
        >
          {/* ${separate3digits(data.netProfit.toFixed(2))} */}
        </TableCell>
      )}
      {layout.winRate && (
        <TableCell className={`text-base-content whitespace-nowrap`}>
          {Math.ceil(data.winRate / 10)}/10
        </TableCell>
      )}
      {layout.dayActive && (
        <TableCell className={`text-base-content whitespace-nowrap`}>
          {data.dayActive} D
        </TableCell>
      )}
      {layout.HotHolder && (
        <TableCell className={`text-base-content whitespace-nowrap`}>
          <div className="flex items-center gap-2">
            <div className="flex space-x-2 items-center">
              <div className="flex flex-col gap-2">
                <span
                  className={
                    data.firstTopTokenHolder.tokenName && "gradient-text"
                  }
                >
                  {data.firstTopTokenHolder.tokenName
                    ? data.firstTopTokenHolder.tokenName !== "-"
                      ? data.firstTopTokenHolder.tokenName
                      : "-"
                    : data.HotTokenHolders[0]?.tokenName || "-"}
                </span>
              </div>
              {/* {data.firstTopTokenHolder.tokenName
                ? data.firstTopTokenHolder.tokenName !== "-" &&
                data.firstTopTokenHolder["Currency Address"] && (
                  <CopyAddress
                    address={data.firstTopTokenHolder["Currency Address"]}
                  />
                )
                : data.HotTokenHolders[0]?.tokenName &&
                data.HotTokenHolders[0]?.["Currency Address"] && (
                  <CopyAddress
                    address={data.HotTokenHolders[0]["Currency Address"]}
                  />
                )} */}
            </div>
          </div>
        </TableCell>
      )}
      {layout.avgHoldingTime && (
        <TableCell className={`text-base-content whitespace-nowrap`}>
          {Math.ceil(data.avgHoldingTime) || 0} D
        </TableCell>
      )}
      {layout.nftActivity && (
        <TableCell className={`text-base-content whitespace-nowrap`}>Yes</TableCell>
      )}

      {layout?.age && (
        <TableCell className={`text-base-content text-center`}>{data?.age}</TableCell>
      )}
      {layout?.SwapTime && (
        <TableCell className={`text-base-content text-center`}>
          {/* {data.SwapTime[0]
            ? getNormalDate(convertIsoToNormalDate(data?.SwapTime[0]))
            : null} */}
        </TableCell>
      )}
      {layout?.TotalFee && (
        <TableCell className={`text-base-content text-center`}>{data?.TotalFee}</TableCell>
      )}
      {layout?.BotActivity && (
        <TableCell
        // className={classNames(`text-base-content text-center`, { "": true })}
        >
          {data?.BotActivity}
        </TableCell>
      )}
      {layout?.details && (
        <TableCell className={`text-base-content text-center`}>{data.details === 'Dex Trader' ? 'yes' : 'no'}</TableCell>
      )}
      {layout?.totalnumPartiallyClosedData && (
        <TableCell className={`text-base-content text-center`}>
          {data?.totalnumPartiallyClosedData}
        </TableCell>
      )}
      {layout?.totalNumofFullyOpenedData && (
        <TableCell className={`text-base-content text-center`}>
          {data.totalNumofFullyOpenedData}
        </TableCell>
      )}
      {layout?.totalTransactions && (
        <TableCell className={`text-base-content text-center`}>
          {data.totalTransactions}
        </TableCell>
      )}
      {layout.totalScore && (
        <TableCell
          className={`text-base-content whitespace-nowrap min-w-[200px] max-w-[200px]`}
        >
          <div>
            {/* <TotalScore value={data.totalScore} /> */}
          </div>
        </TableCell>
      )}
    </TableRow>
  );
};
