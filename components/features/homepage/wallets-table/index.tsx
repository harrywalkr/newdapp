'use client';

import React, { useState, useEffect } from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import useWatchlistStore, { IWatchlistItem } from "@/store/watchlist";
import { useTokenChainStore } from "@/store";
import { getWallets } from "@/services/http/wallets.http";
import { IWallet, HotTokenHolder } from "@/types/Wallet.type";
import Copy from "@/components/ui/copy";
import { minifyContract } from "@/utils/truncate";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icon";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import FilterDialog from './Filter';
import { SmartTable } from '@/components/ui/smart-table';
import clsx from 'clsx';
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  SectionContent,
} from "@/components/layout/Section";
import TableLoading from '@/components/layout/Table-loading';

export default function Wallets() {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlistStore();
  const { selectedChain } = useTokenChainStore();

  const [rankRange, setRankRange] = useState<[number, number]>([0, 100]);
  const [winRateRange, setWinRateRange] = useState<[number, number]>([0, 100]);
  const [netProfitRange, setNetProfitRange] = useState<[number, number]>([-1000000, 1000000]);
  const [ageRange, setAgeRange] = useState<[number, number]>([0, 5000]);
  const [label, setLabel] = useState<string>("");
  const [dayActiveRange, setDayActiveRange] = useState<[number, number]>([0, 365]);
  const [avgHoldingTimeRange, setAvgHoldingTimeRange] = useState<[number, number]>([0, 365]);
  const [totalScoreRange, setTotalScoreRange] = useState<[number, number]>([0, 2000]);
  const [totalFeeRange, setTotalFeeRange] = useState<[number, number]>([0, 100]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: walletsData = [], isLoading } = useQuery({
    queryKey: ['wallets', selectedChain.symbol, page, pageSize],
    queryFn: () => getWallets({ params: { "network": selectedChain.symbol, page: page, limit: pageSize } }),
  });

  const [filteredData, setFilteredData] = useState<IWallet[]>(walletsData);

  useEffect(() => {
    if (walletsData) {
      setFilteredData(walletsData.filter(wallet =>
        wallet.rank >= rankRange[0] && wallet.rank <= rankRange[1] &&
        wallet.winRate >= winRateRange[0] && wallet.winRate <= winRateRange[1] &&
        wallet.netProfit >= netProfitRange[0] && wallet.netProfit <= netProfitRange[1] &&
        wallet.age >= ageRange[0] && wallet.age <= ageRange[1] &&
        (label ? wallet.buyAmountLabel === label : true)
        // wallet.dayActive >= dayActiveRange[0] && wallet.dayActive <= dayActiveRange[1] &&
        // (wallet.avgHoldingTime ?? 0) >= avgHoldingTimeRange[0] && (wallet.avgHoldingTime ?? 0) <= avgHoldingTimeRange[1] &&
        // wallet.totalScore >= totalScoreRange[0] && wallet.totalScore <= totalScoreRange[1] &&
        // wallet.TotalFee >= totalFeeRange[0] && wallet.TotalFee <= totalFeeRange[1]
      ));
    }
  }, [walletsData, rankRange, winRateRange, netProfitRange, ageRange, label, dayActiveRange, avgHoldingTimeRange, totalScoreRange, totalFeeRange]);

  const handleStarClick = (wallet: IWatchlistItem) => {
    const isInWatchlist = watchlist.some((w: IWatchlistItem) => w.contractAddress === wallet.contractAddress);
    if (isInWatchlist) {
      removeFromWatchlist(wallet.contractAddress);
    } else {
      addToWatchlist(wallet);
    }
  };

  const isTokenInWatchlist = (wallet: IWatchlistItem) => {
    return watchlist.some((w: IWatchlistItem) => w.contractAddress === wallet.contractAddress);
  };

  const columns: ColumnDef<IWallet>[] = [
    {
      accessorKey: 'watchlist',
      header: '',
      cell: ({ row }) => (
        <div className="px-5 cursor-pointer"
          onClick={() => handleStarClick({
            name: row.getValue("walletAddress") as string,
            contractAddress: row.getValue("walletAddress") as string,
            type: 'wallet'
          })}
        >
          {isTokenInWatchlist({
            name: row.getValue("walletAddress") as string,
            contractAddress: row.getValue("walletAddress") as string,
            type: 'wallet'
          }) ? <AiFillStar size={20} /> : <AiOutlineStar size={20} />}
        </div>
      ),
    },
    {
      accessorKey: 'rank',
      header: ({ column }) => {
        const isSortedAsc = column.getIsSorted() === 'asc';
        const isSortedDesc = column.getIsSorted() === 'desc';

        const toggleSorting = () => {
          if (isSortedAsc) {
            column.toggleSorting(true);
          } else if (isSortedDesc) {
            column.clearSorting();
          } else {
            column.toggleSorting(false);
          }
        };

        return (
          <Button
            variant="ghost"
            onClick={toggleSorting}
          >
            Rank
            {isSortedAsc && <ArrowUpIcon className="ml-2 h-4 w-4" />}
            {isSortedDesc && <ArrowDownIcon className="ml-2 h-4 w-4" />}
            {!column.getIsSorted() && <Icons.sort className="ml-2 h-4 w-4" />}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center cursor-pointer" >
          {row.getValue("rank")}
        </div>
      ),
    },
    {
      accessorKey: 'walletAddress',
      header: 'Wallet Address',
      cell: ({ row }) => (
        // <Link
        //   href={`/wallet/${row.getValue("walletAddress")}`}
        //   className="font-medium link link-hover hover:text-info"
        // >
        <Copy
          href={`/wallet/${row.getValue("walletAddress")}?network=${selectedChain.symbol}`}
          // href={`/wallet/${row.getValue("walletAddress")}`}
          text={minifyContract(row.getValue("walletAddress") as string)}
          value={row.getValue("walletAddress") as string}
        />
        // </Link>
      ),
    },
    {
      accessorKey: 'buyAmountLabel',
      header: ({ column }) => {
        const isSortedAsc = column.getIsSorted() === 'asc';
        const isSortedDesc = column.getIsSorted() === 'desc';

        const toggleSorting = () => {
          if (isSortedAsc) {
            column.toggleSorting(true);
          } else if (isSortedDesc) {
            column.clearSorting();
          } else {
            column.toggleSorting(false);
          }
        };

        return (
          <Button
            variant="ghost"
            onClick={toggleSorting}
          >
            Label
            {isSortedAsc && <ArrowUpIcon className="ml-2 h-4 w-4" />}
            {isSortedDesc && <ArrowDownIcon className="ml-2 h-4 w-4" />}
            {!column.getIsSorted() && <Icons.sort className="ml-2 h-4 w-4" />}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="px-5 whitespace-nowrap">
          {row.getValue('buyAmountLabel')}
        </div>
      ),
    },
    {
      accessorKey: 'netProfit',
      header: ({ column }) => {
        const isSortedAsc = column.getIsSorted() === 'asc';
        const isSortedDesc = column.getIsSorted() === 'desc';

        const toggleSorting = () => {
          if (isSortedAsc) {
            column.toggleSorting(true);
          } else if (isSortedDesc) {
            column.clearSorting();
          } else {
            column.toggleSorting(false);
          }
        };

        return (
          <Button
            variant="ghost"
            onClick={toggleSorting}
          >
            P&L
            {isSortedAsc && <ArrowUpIcon className="ml-2 h-4 w-4" />}
            {isSortedDesc && <ArrowDownIcon className="ml-2 h-4 w-4" />}
            {!column.getIsSorted() && <Icons.sort className="ml-2 h-4 w-4" />}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className={clsx('px-5', {
          'text-success': Number(row.getValue('netProfit')) > 0,
          'text-red-300': Number(row.getValue('netProfit')) <= 0
        })}>
          {Number(row.getValue('netProfit')).toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: 'winRate',
      header: ({ column }) => {
        const isSortedAsc = column.getIsSorted() === 'asc';
        const isSortedDesc = column.getIsSorted() === 'desc';

        const toggleSorting = () => {
          if (isSortedAsc) {
            column.toggleSorting(true);
          } else if (isSortedDesc) {
            column.clearSorting();
          } else {
            column.toggleSorting(false);
          }
        };

        return (
          <Button
            variant="ghost"
            onClick={toggleSorting}
          >
            WinRate
            {isSortedAsc && <ArrowUpIcon className="ml-2 h-4 w-4" />}
            {isSortedDesc && <ArrowDownIcon className="ml-2 h-4 w-4" />}
            {!column.getIsSorted() && <Icons.sort className="ml-2 h-4 w-4" />}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="px-5">
          {Number(row.getValue('winRate')).toFixed(0)}
        </div>
      ),
    },
    {
      accessorKey: 'dayActive',
      header: ({ column }) => {
        const isSortedAsc = column.getIsSorted() === 'asc';
        const isSortedDesc = column.getIsSorted() === 'desc';

        const toggleSorting = () => {
          if (isSortedAsc) {
            column.toggleSorting(true);
          } else if (isSortedDesc) {
            column.clearSorting();
          } else {
            column.toggleSorting(false);
          }
        };

        return (
          <Button
            variant="ghost"
            onClick={toggleSorting}
          >
            Active Days
            {isSortedAsc && <ArrowUpIcon className="ml-2 h-4 w-4" />}
            {isSortedDesc && <ArrowDownIcon className="ml-2 h-4 w-4" />}
            {!column.getIsSorted() && <Icons.sort className="ml-2 h-4 w-4" />}
          </Button >
        );
      },
      cell: ({ row }) => (
        <div className="px-5">
          {row.getValue('dayActive')}
        </div>
      ),
    },
    {
      accessorKey: 'firstTopTokenHolder',
      header: ({ column }) => {
        const isSortedAsc = column.getIsSorted() === 'asc';
        const isSortedDesc = column.getIsSorted() === 'desc';

        const toggleSorting = () => {
          if (isSortedAsc) {
            column.toggleSorting(true);
          } else if (isSortedDesc) {
            column.clearSorting();
          } else {
            column.toggleSorting(false);
          }
        };

        return (
          <Button
            variant="ghost"
            onClick={toggleSorting}
          >
            First Top Token Holder
            {isSortedAsc && <ArrowUpIcon className="ml-2 h-4 w-4" />}
            {isSortedDesc && <ArrowDownIcon className="ml-2 h-4 w-4" />}
            {!column.getIsSorted() && <Icons.sort className="ml-2 h-4 w-4" />}
          </Button>
        );
      },
      cell: ({ row }) => {
        const firstTopTokenHolder = row.getValue('firstTopTokenHolder') as { tokenName: string;["Currency Address"]: string; };
        const hotTokenHolders = row.getValue('HotTokenHolders') as HotTokenHolder[];

        return (
          <div className="flex space-x-2 items-center gap-2 px-5 text-orange-300">
            <div className="flex flex-col gap-2"></div>
            {firstTopTokenHolder.tokenName
              ? firstTopTokenHolder.tokenName !== "-" &&
              firstTopTokenHolder["Currency Address"] && (
                <Copy
                  text={
                    firstTopTokenHolder.tokenName !== "-"
                      ? firstTopTokenHolder.tokenName
                      : "-"
                  }
                  value={firstTopTokenHolder["Currency Address"]}
                  href={`/tokens/${selectedChain.symbol.toLowerCase()}/${firstTopTokenHolder["Currency Address"]}`}
                />
              )
              :
              hotTokenHolders &&
              hotTokenHolders.length > 0 &&
              hotTokenHolders[0]?.tokenName &&
              hotTokenHolders[0]?.["Currency Address"] && (
                <Copy
                  text={
                    firstTopTokenHolder.tokenName !== "-"
                      ? firstTopTokenHolder.tokenName
                      : "-"
                  }
                  href={`/tokens/${selectedChain.symbol.toLowerCase()}/${hotTokenHolders[0]["Currency Address"]}`}
                  value={hotTokenHolders[0]["Currency Address"]}
                />
              )}
          </div>
        );
      },
    },
    {
      accessorKey: 'avgHoldingTime',
      header: ({ column }) => {
        const isSortedAsc = column.getIsSorted() === 'asc';
        const isSortedDesc = column.getIsSorted() === 'desc';

        const toggleSorting = () => {
          if (isSortedAsc) {
            column.toggleSorting(true);
          } else if (isSortedDesc) {
            column.clearSorting();
          } else {
            column.toggleSorting(false);
          }
        };

        return (
          <Button
            variant="ghost"
            onClick={toggleSorting}
          >
            Avg Position Duration
            {isSortedAsc && <ArrowUpIcon className="ml-2 h-4 w-4" />}
            {isSortedDesc && <ArrowDownIcon className="ml-2 h-4 w-4" />}
            {!column.getIsSorted() && <Icons.sort className="ml-2 h-4 w-4" />}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="px-5">
          {Math.ceil(row.getValue('avgHoldingTime')) || 0} D
        </div>
      ),
    },
    {
      accessorKey: 'age',
      header: ({ column }) => {
        const isSortedAsc = column.getIsSorted() === 'asc';
        const isSortedDesc = column.getIsSorted() === 'desc';

        const toggleSorting = () => {
          if (isSortedAsc) {
            column.toggleSorting(true);
          } else if (isSortedDesc) {
            column.clearSorting();
          } else {
            column.toggleSorting(false);
          }
        };

        return (
          <Button
            variant="ghost"
            onClick={toggleSorting}
          >
            Age
            {isSortedAsc && <ArrowUpIcon className="ml-2 h-4 w-4" />}
            {isSortedDesc && <ArrowDownIcon className="ml-2 h-4 w-4" />}
            {!column.getIsSorted() && <Icons.sort className="ml-2 h-4 w-4" />}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="px-5">
          {row.getValue('age')}
        </div>
      ),
    },
    {
      accessorKey: 'TotalFee',
      header: ({ column }) => {
        const isSortedAsc = column.getIsSorted() === 'asc';
        const isSortedDesc = column.getIsSorted() === 'desc';

        const toggleSorting = () => {
          if (isSortedAsc) {
            column.toggleSorting(true);
          } else if (isSortedDesc) {
            column.clearSorting();
          } else {
            column.toggleSorting(false);
          }
        };

        return (
          <Button
            variant="ghost"
            onClick={toggleSorting}
          >
            Total Fee (eth)
            {isSortedAsc && <ArrowUpIcon className="ml-2 h-4 w-4" />}
            {isSortedDesc && <ArrowDownIcon className="ml-2 h-4 w-4" />}
            {!column.getIsSorted() && <Icons.sort className="ml-2 h-4 w-4" />}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="px-5">
          {Number(row.getValue('TotalFee')).toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: 'dextrader',
      header: ({ column }) => {
        const isSortedAsc = column.getIsSorted() === 'asc';
        const isSortedDesc = column.getIsSorted() === 'desc';

        const toggleSorting = () => {
          if (isSortedAsc) {
            column.toggleSorting(true);
          } else if (isSortedDesc) {
            column.clearSorting();
          } else {
            column.toggleSorting(false);
          }
        };

        return (
          <Button
            variant="ghost"
            onClick={toggleSorting}
          >
            Dex Trader
            {isSortedAsc && <ArrowUpIcon className="ml-2 h-4 w-4" />}
            {isSortedDesc && <ArrowDownIcon className="ml-2 h-4 w-4" />}
            {!column.getIsSorted() && <Icons.sort className="ml-2 h-4 w-4" />}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="px-5">
          {row.getValue('details') === 'Dex Trader' ? 'yes' : 'no'}
        </div>
      ),
    },
    {
      accessorKey: 'notClosedPositions',
      header: ({ column }) => {
        const isSortedAsc = column.getIsSorted() === 'asc';
        const isSortedDesc = column.getIsSorted() === 'desc';

        const toggleSorting = () => {
          if (isSortedAsc) {
            column.toggleSorting(true);
          } else if (isSortedDesc) {
            column.clearSorting();
          } else {
            column.toggleSorting(false);
          }
        };

        return (
          <Button
            variant="ghost"
            onClick={toggleSorting}
          >
            Not Closed
            {isSortedAsc && <ArrowUpIcon className="ml-2 h-4 w-4" />}
            {isSortedDesc && <ArrowDownIcon className="ml-2 h-4 w-4" />}
            {!column.getIsSorted() && <Icons.sort className="ml-2 h-4 w-4" />}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="px-5">
          {row.getValue('totalNumofFullyOpenedData')}
        </div>
      ),
    },
    {
      accessorKey: 'totalTransactions',
      header: ({ column }) => {
        const isSortedAsc = column.getIsSorted() === 'asc';
        const isSortedDesc = column.getIsSorted() === 'desc';

        const toggleSorting = () => {
          if (isSortedAsc) {
            column.toggleSorting(true);
          } else if (isSortedDesc) {
            column.clearSorting();
          } else {
            column.toggleSorting(false);
          }
        };

        return (
          <Button
            variant="ghost"
            onClick={toggleSorting}
          >
            Total Transactions
            {isSortedAsc && <ArrowUpIcon className="ml-2 h-4 w-4" />}
            {isSortedDesc && <ArrowDownIcon className="ml-2 h-4 w-4" />}
            {!column.getIsSorted() && <Icons.sort className="ml-2 h-4 w-4" />}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="px-5">
          {row.getValue('totalTransactions')}
        </div>
      ),
    },
    {
      accessorKey: 'totalScore',
      header: ({ column }) => {
        const isSortedAsc = column.getIsSorted() === 'asc';
        const isSortedDesc = column.getIsSorted() === 'desc';

        const toggleSorting = () => {
          if (isSortedAsc) {
            column.toggleSorting(true);
          } else if (isSortedDesc) {
            column.clearSorting();
          } else {
            column.toggleSorting(false);
          }
        };

        return (
          <Button
            variant="ghost"
            onClick={toggleSorting}
          >
            Total Score
            {isSortedAsc && <ArrowUpIcon className="ml-2 h-4 w-4" />}
            {isSortedDesc && <ArrowDownIcon className="ml-2 h-4 w-4" />}
            {!column.getIsSorted() && <Icons.sort className="ml-2 h-4 w-4" />}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="px-5">
          {row.getValue('totalScore')}
        </div>
      ),
    },
  ];

  if (isLoading) return <Section variant={'vertical'}>
    <SectionHeader variant={'vertical'}>
      <SectionTitle>Profitable Wallets</SectionTitle>
      <SectionDescription>
        Find out more about winner wallets and their trade secrets
      </SectionDescription>
    </SectionHeader>
    <SectionContent variant={'vertical'}>
      <TableLoading />
    </SectionContent>
  </Section>

  return (
    <Section variant={'vertical'}>
      <SectionHeader variant={'vertical'}>
        <SectionTitle>Profitable Wallets</SectionTitle>
        <SectionDescription>
          Find out more about winner wallets and their trade secrets
        </SectionDescription>
      </SectionHeader>
      <SectionContent variant={'vertical'}>
        <SmartTable
          data={filteredData}
          columns={columns}
          searchColumnAccessorKey='walletAddress'
          page={page}
          pageCount={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
        >
          <FilterDialog
            rankRange={rankRange} setRankRange={setRankRange}
            winRateRange={winRateRange} setWinRateRange={setWinRateRange}
            netProfitRange={netProfitRange} setNetProfitRange={setNetProfitRange}
            ageRange={ageRange} setAgeRange={setAgeRange}
            label={label} setLabel={setLabel}
            dayActiveRange={dayActiveRange} setDayActiveRange={setDayActiveRange}
            avgHoldingTimeRange={avgHoldingTimeRange} setAvgHoldingTimeRange={setAvgHoldingTimeRange}
            totalScoreRange={totalScoreRange} setTotalScoreRange={setTotalScoreRange}
            totalFeeRange={totalFeeRange} setTotalFeeRange={setTotalFeeRange}
          />
        </SmartTable >
      </SectionContent>
    </Section>
  );
}
