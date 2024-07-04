// wallet.tsx
'use client'

import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  SectionContent,
} from "@/components/layout/Section";
import { IWallet } from "@/types/Wallet.type";
import { useEffect, useState } from "react";
import TopWalletsFilter from "../wallet/WalletsFilter";
import { initTopWalletFilters, topWalletFiltersEnum, topWalletLayouts } from "@/types/topwallet.type";
import { convertIsoToDate } from "@/utils/date";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Copy from "@/components/ui/copy";
import { minifyContract } from "@/utils/truncate";
import { separate3digits } from "@/utils/numbers";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import useWatchlistStore, { IWatchlistItem } from "@/store/watchlist";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { isPaidMember } from "@/services/auth.service";
import { useTokenChainStore } from "@/store";
import { getWallets } from "@/services/http/wallets.http";
import { useQuery } from "@tanstack/react-query";


export default function Wallet() {
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(0);
  const router = useRouter();
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
    notClosedPositions: false,
    totalTransactions: false,
  });
  const [layout, setLayout] = useState(topWalletLayouts);
  const [filters, setFilters] = useState(initTopWalletFilters);

  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlistStore();
  const { selectedChain } = useTokenChainStore();

  const { data: walletsData = [], isLoading } = useQuery({
    queryKey: ['wallets', selectedChain.symbol],
    queryFn: () => getWallets({
      params: {
        "network": selectedChain.symbol,
      },
    }),
    // initialData: initTopWallets,
  });

  const [wallets, setWallets] = useState<IWallet[]>([]);
  const [filtered, setFiltered] = useState<IWallet[]>([]);

  useEffect(() => {
    if (walletsData) {
      setWallets(walletsData);
      setFiltered(walletsData);
      setMaxPage(Math.ceil(walletsData.length / 10) - 1);
      setPage(0);
    }
  }, [walletsData]);


  useEffect(() => {
    if (wallets) {
      let cloneFiltered: IWallet[] = [...wallets];
      Object.keys(filters).forEach((item: string) => {
        if (item === "rank" && filters.rank.value !== undefined) {
          cloneFiltered = cloneFiltered.filter(
            (i: IWallet) =>
              +i.rank >= filters.rank.value[0]! &&
              +i.rank <= filters.rank.value[1]!
          );
        } else if (item === "label" && filters.label.value !== undefined) {
          cloneFiltered = cloneFiltered.filter(
            (i: IWallet) => i.buyAmountLabel === filters.label.value
          );
        } else if (item === "pnl" && filters.pnl.value !== undefined) {
          cloneFiltered = cloneFiltered.filter(
            (i: IWallet) =>
              +i.netProfit.toFixed(2) >= filters.pnl.value[0]! &&
              +i.netProfit.toFixed(2) <= filters.pnl.value[1]!
          );
        } else if (item === "winRate" && filters.winRate.value !== undefined) {
          cloneFiltered = cloneFiltered.filter(
            (i: IWallet) =>
              Math.ceil(i.winRate / 10) >= filters.winRate.value[0]! &&
              Math.ceil(i.winRate / 10) <= filters.winRate.value[1]!
          );
        } else if (
          item === "dayActive" &&
          filters.dayActive.value !== undefined
        ) {
          cloneFiltered = cloneFiltered.filter(
            (i: IWallet) =>
              i.dayActive >= filters.dayActive.value[0]! &&
              i.dayActive <= filters.dayActive.value[1]!
          );
        } else if (
          item === "avgHoldingTime" &&
          filters.avgHoldingTime.value !== undefined
        ) {
          cloneFiltered = cloneFiltered.filter((i: IWallet) => {
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
            (i: IWallet) =>
              i.totalScore >= filters.totalScore.value[0]! &&
              i.totalScore <= filters.totalScore.value[1]!
          );
        } else if (item === "age" && filters.age.value !== undefined) {
          cloneFiltered = cloneFiltered.filter(
            (i: IWallet) =>
              i.age >= filters.age.value[0]! && i.age <= filters.age.value[1]!
          );
        } else if (item === "TotalFee" && filters.TotalFee.value !== undefined) {
          cloneFiltered = cloneFiltered.filter((i: IWallet) => {
            return (
              +i.TotalFee?.toFixed() >= filters.TotalFee.value[0]! &&
              +i.TotalFee?.toFixed() <= filters.TotalFee.value[1]!
            );
          });
        }
      });
      setFiltered(cloneFiltered as any);
      setMaxPage(Math.ceil(cloneFiltered.length / 10) - 1);
      setPage(0);
    }
  }, [filters, wallets]);

  if (isLoading)
    return (
      <div className="w-full h-[800px] flex justify-center items-center">
        <span className="loading loading-bars loading-md">loading ...</span>
      </div>
    );

  const handleSort = (key: string) => {
    let cloneFiltered = [...(filtered || [])];
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
        cloneFiltered = cloneFiltered.sort((a: IWallet, b: IWallet) => {
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

  const handleStarClick = (wallet: IWatchlistItem) => {
    const isInWatchlist = watchlist.some((w: IWatchlistItem) => w.contractAddress === wallet.name);
    if (isInWatchlist) {
      removeFromWatchlist(wallet.name);
    } else {
      // addToWatchlist(wallet);
      addToWatchlist({ name: wallet.contractAddress, contractAddress: wallet.contractAddress, type: 'wallet' });
    }
  };

  const isTokenInWatchlist = (wallet: IWatchlistItem) => {
    return watchlist.some((w: IWatchlistItem) => w.contractAddress === wallet.contractAddress);
  };

  const handlePageChange = async (newPage: number) => {
    const isAuthenticated = await isPaidMember();
    if (isAuthenticated) {
      setPage(newPage);
    } else {
      router.replace(`/login`);
    }
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
          wallet={walletsData}
          onSearch={setFiltered}
        />
        <ScrollArea className="w-full rounded-md pb-4">
          <ScrollBar orientation="horizontal" />
          <Table className="bg-card">
            <TableHeader>
              <TableRow>
                <TableHead>Watchlist</TableHead>
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
                    Total Fee (eth)
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
                {layout[topWalletFiltersEnum.notClosedPositions] && (
                  <TableHead
                    className="whitespace-nowrap	"
                    onClick={() => handleSort("notClosedPositions")}
                  >
                    not closed
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
                  <Record key={d.walletAddress} data={d} layout={layout} handleStarClick={handleStarClick} isTokenInWatchlist={isTokenInWatchlist} />
                ))}
            </TableBody>
          </Table>
        </ScrollArea>

        <div className="mt-5 flex justify-end items-center">
          <Button variant='outline' size='icon' disabled={page <= 0} onClick={() => handlePageChange(page - 1)}>
            <ChevronLeftIcon />
          </Button>
          <span className="mx-2">{page + 1}</span>
          <Button variant='outline' size='icon' disabled={page >= maxPage} onClick={() => handlePageChange(page + 1)}>
            <ChevronRightIcon />
          </Button>
        </div>
      </SectionContent>
    </Section>
  );
}

const Record = ({ data, layout, handleStarClick, isTokenInWatchlist }: { data: IWallet; layout: any; handleStarClick: (wallet: IWatchlistItem) => void; isTokenInWatchlist: (wallet: IWatchlistItem) => boolean }) => {
  const { selectedChain } = useTokenChainStore();

  return (
    <TableRow>
      <TableCell className="text-base-content text-center">
        <div onClick={() => handleStarClick({ name: data.walletAddress, contractAddress: data.walletAddress, type: 'wallet' })} className="cursor-pointer">
          {isTokenInWatchlist({ name: data.walletAddress, contractAddress: data.walletAddress, type: 'wallet' }) ? <AiFillStar size={20} /> : <AiOutlineStar size={20} />}
        </div>
      </TableCell>
      {layout.rank && (
        <TableCell className={`text-base-content text-center`}>{data.rank}</TableCell>
      )}
      {layout.walletAddress && (
        <TableCell className={`text-base-content max-w-[400px]`}>
          <div className="flex items-center gap-2">
            <div className="flex space-x-2 items-center">
              <div className="flex flex-col gap-2">
                <Copy
                  // href={`/wallet/${data.walletAddress}?network=eth`}
                  href={`/wallet/${data.walletAddress}?network=${selectedChain.symbol}`}
                  text={minifyContract(data.walletAddress)}
                  value={data.walletAddress}
                />
              </div>
            </div>
          </div>
        </TableCell>
      )}
      {layout.label && (
        <TableCell className={`text-base-content whitespace-nowrap`}>
          <div className="p-2 /70 text-base-100 rounded-lg max-w-[100px] text-center whitespace-nowrap">
            {data.buyAmountLabel}
          </div>
        </TableCell>
      )}
      {layout.pnl && (
        <TableCell
          className={`text-base-content whitespace-nowrap ${data.netProfit > 0 ? "text-success" : "text-red-300"
            }`}
        >
          ${separate3digits(data.netProfit.toFixed(2))}
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
        <TableCell className={`text-base-content whitespace-nowrap text-orange-300`}>
          <div className="flex items-center gap-2">
            <div className="flex space-x-2 items-center">
              <div className="flex flex-col gap-2">
              </div>
              {data.firstTopTokenHolder.tokenName
                ? data.firstTopTokenHolder.tokenName !== "-" &&
                data.firstTopTokenHolder["Currency Address"] && (
                  <Copy
                    text={
                      data.firstTopTokenHolder.tokenName
                        ? data.firstTopTokenHolder.tokenName !== "-"
                          ? data.firstTopTokenHolder.tokenName
                          : "-"
                        : data.HotTokenHolders[0]?.tokenName || "-"
                    }
                    value={data.firstTopTokenHolder["Currency Address"]}
                    href={`/tokens/${selectedChain.symbol.toLowerCase()}/${data.firstTopTokenHolder["Currency Address"]}`}
                  />
                )
                : data.HotTokenHolders[0]?.tokenName &&
                data.HotTokenHolders[0]?.["Currency Address"] && (
                  <Copy
                    text={
                      data.firstTopTokenHolder.tokenName
                        ? data.firstTopTokenHolder.tokenName !== "-"
                          ? data.firstTopTokenHolder.tokenName
                          : "-"
                        : data.HotTokenHolders[0]?.tokenName || "-"
                    }
                    href={`/tokens/${selectedChain.symbol.toLowerCase()}/${data.HotTokenHolders[0]["Currency Address"]}`}
                    value={data.HotTokenHolders[0]["Currency Address"]}
                  />
                )}
            </div>
          </div>
        </TableCell>

      )}
      {layout.avgHoldingTime && (
        <TableCell className={`text-base-content text-center whitespace-nowrap `}           >
          {Math.ceil(data.avgHoldingTime!) || 0} D
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
        <TableCell className={`text-base-content text-center`}>{data?.TotalFee.toFixed(2)}</TableCell>
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
      {layout?.notClosedPositions && (
        <TableCell className={`text-base-content text-center`}>
          {data?.totalNumofFullyOpenedData}
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
            {data.totalScore}
            {/* <TotalScore value={data.totalScore} /> */}
          </div>
        </TableCell>
      )}
    </TableRow>
  );
};
