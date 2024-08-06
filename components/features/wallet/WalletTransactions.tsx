'use client';

import React, { useState } from 'react';
import dayjs from 'dayjs';
import { LuArrowLeftRight } from 'react-icons/lu';
import { FaEthereum } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import Copy from '@/components/ui/copy';
import { getWalletSwaps } from '@/services/http/wallets.http';
import { getImages } from '@/services/http/image.http';
import { TransactionType } from '@/types/swap.type';
import { useTokenChainStore } from '@/store';
import TableLoading from '@/components/layout/Table-loading';
import { ColumnDef } from "@tanstack/react-table";
import { ServerSideSmartTable } from '@/components/ui/smart-table/ServerSideSmartTable';
import FilterDialog, { Filter } from '@/components/ui/smart-table/FilterDialog';
import { imageUrl } from '@/utils/imageUrl';
import { Avatar, AvatarFallback, AvatarImage, AvatarPlaceholder } from '@/components/ui/avatar';
import PriceFormatter from '@/utils/PriceFormatter';
import { minifyContract } from '@/utils/truncate';
import { Button } from '@/components/ui/button';
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";


interface Props {
  walletAddress: string;
  dateRange: { from: Date; to: Date };
}

export default function WalletTransactions({ dateRange: initialDateRange, walletAddress }: Props) {
  const { selectedChain } = useTokenChainStore();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState<string>('time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined, to: Date | undefined }>(initialDateRange);
  const [searchValue, setSearchValue] = useState<string>("");

  const { data: walletSwapsData, isLoading: walletSwapsLoading, error: walletSwapsError } = useQuery({
    queryKey: [
      'walletSwaps', walletAddress, 'category=transactions', selectedChain.symbol, page, pageSize, sortBy, sortOrder, searchValue, dateRange
    ],
    queryFn: () => getWalletSwaps({
      params: {
        category: 'transactions',
        from: dateRange.from,
        to: dateRange.to,
        address: walletAddress,
        network: selectedChain.symbol,
        page,
        pageSize,
        sortBy,
        sortOrder,
        search: searchValue,
      }
    }),
  });

  const { data: imagesData, isLoading: imagesLoading, error: imagesError } = useQuery({
    queryKey: ['images'],
    queryFn: () => getImages().then((data) => data.imageUrls)
  });

  if (walletSwapsLoading || imagesLoading) return <TableLoading />

  if (walletSwapsError) return <div>Error loading wallet swaps: {walletSwapsError.message}</div>;
  if (imagesError) return <div>Error loading images: {imagesError.message}</div>;

  const columns: ColumnDef<TransactionType>[] = [
    {
      accessorKey: 'tokens',
      header: 'Tokens',
      cell: ({ row }) => {
        const transaction = row.original;
        const { sentTokenName, receivedTokenName } = transaction.description || {};

        if (transaction.type?.includes("swap")) {
          return (
            <div className='flex items-center justify-start gap-2'>
              {sentTokenName === "ETH" ? (
                <div className='flex aspect-square h-10 w-10 items-center justify-center rounded-xl bg-muted'>
                  <FaEthereum />
                </div>
              ) : (
                <>
                  {transaction.description?.sentTokenAddress &&
                    imagesData != undefined ? (
                    <Avatar >
                      <AvatarImage
                        src={imageUrl(transaction.description?.sentTokenAddress, imagesData)}
                        alt="token logo"
                      />
                      <AvatarFallback>{sentTokenName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <AvatarPlaceholder />
                  )}
                </>
              )}
              {receivedTokenName === "ETH" ? (
                <div className='flex aspect-square h-10 w-10 items-center justify-center rounded-xl bg-muted'>
                  <FaEthereum />
                </div>
              ) : (
                <>
                  {transaction.currency?.symbol &&
                    imagesData != undefined ? (
                    <Avatar >
                      <AvatarImage
                        src={imageUrl(transaction.currency.symbol, imagesData)}
                        alt="token logo"
                      />
                      <AvatarFallback>{receivedTokenName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <AvatarPlaceholder />
                  )}
                </>
              )}
            </div>
          );
        } else {
          return (
            <div>
              {transaction.currency?.symbol === "ETH" ? (
                <div className='flex aspect-square h-10 w-10 items-center justify-center rounded-xl bg-muted'>
                  <FaEthereum />
                </div>
              ) : (
                <>
                  {transaction.currency?.symbol &&
                    imagesData != undefined ? (
                    <Avatar >
                      <AvatarImage
                        src={imageUrl(transaction.currency.address, imagesData)}
                        alt="token logo"
                      />
                      {
                        (transaction.currency.symbol.charAt(0) !== ' ' && transaction.currency.symbol.charAt(0) !== '\u200A') ?
                          <AvatarFallback>{transaction.currency.symbol.charAt(0)}</AvatarFallback>
                          :
                          <AvatarPlaceholder />
                      }
                    </Avatar>
                  ) :
                    <AvatarPlaceholder />
                  }
                </>
              )}
            </div>
          );
        }
      }
    },
    {
      accessorKey: 'transaction',
      header: 'Transaction hash',
      accessorFn: row => row.transactions?.[0]?.transaction.hash || row.transaction?.hash,
      cell: ({ row }) => {
        const transaction = row.original;
        const isSwap = transaction.type?.includes("swap");
        return (
          <>
            {isSwap ? (
              <>
                {transaction.transactions && transaction.transactions[0].transaction?.hash &&
                  (
                    <a
                      href={`https://etherscan.io/tx/${transaction.transactions[0].transaction.hash}`}
                      target="_blank"
                      className="link link-hover underline text-info text-sm"
                    >
                      {minifyContract(transaction.transactions[0].transaction.hash)}
                    </a>
                  )}
              </>
            ) : (
              <>
                {transaction.transaction?.hash &&
                  (<a
                    href={`https://etherscan.io/tx/${transaction.transaction.hash}`}
                    target="_blank"
                    className="link link-hover underline text-info text-sm"
                  >
                    {minifyContract(transaction.transaction.hash)}
                  </a>
                  )}
              </>
            )}
          </>
        );
      }
    },
    {
      accessorKey: 'type',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => toggleSorting(column)}>
          Activity
          {sortBy === 'type' && sortOrder === 'asc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
          {sortBy === 'type' && sortOrder === 'desc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
        </Button>
      ),
      cell: ({ row }) => row.original.type || 'N/A',
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => {
        const transaction = row.original;
        const isSwap = transaction.type?.includes("swap");
        return (
          <div className='flex items-center gap-2'>
            {isSwap ? (
              <>
                {
                  transaction.description?.sentAmount != undefined &&
                  <>
                    <div className="flex items-center gap-1">
                      <span className="font-bold">
                        <PriceFormatter value={transaction.description.sentAmount} />
                      </span>
                      <span className="opacity-60">{transaction.description.sentTokenName}</span>
                      {transaction.description?.sentTokenAddress !== "-" ? (
                        <Copy text='' value={transaction.description.sentTokenAddress} />
                      ) : null}
                    </div>
                    <LuArrowLeftRight />
                    <div className="flex items-center gap-1">
                      <span className="font-bold">
                        <PriceFormatter value={transaction.description.receivedAmount} />
                      </span>
                      <span className="opacity-60">{transaction.description.receivedTokenName}</span>
                      {transaction.description.receivedTokenAddress !== "-" ? (
                        <Copy text='' value={transaction.description.receivedTokenAddress} />
                      ) : null}
                    </div>
                  </>
                }
              </>
            ) : (
              <>
                <div className="flex items-center gap-1">
                  {
                    transaction.currency?.address != undefined && <>
                      {
                        transaction.amount != undefined &&
                        <span className="font-bold">
                          <PriceFormatter value={transaction.amount} />
                        </span>
                      }
                      <span className="opacity-60">{transaction.currency.symbol}</span>
                      {transaction.currency.address !== "-" ? (
                        <Copy text='' value={transaction.currency.address} />
                      ) : null}
                    </>
                  }
                </div>
              </>
            )}
          </div>
        );
      }
    },
    {
      accessorKey: 'swapValue',
      header: 'Swap Value',
      cell: ({ row }) => {
        const transaction = row.original;
        return <>
          {transaction.type == 'buy swap' && <>{transaction.description?.sentAmountUSD}</>}
          {transaction.type == 'sell swap' && <>{transaction.description?.receivedAmountUSD}</>}
          {transaction.type == 'send' && <>{transaction.amount_usd}</>}
          {transaction.type == 'receive' && <>{transaction.amount_usd}</>}
        </>
      }
    },
    {
      accessorKey: 'time',
      header: 'Time',
      cell: ({ row }) => {
        const transaction = row.original;
        return <>
          {transaction.type == 'buy swap' && <>{transaction.description?.timestamp ? dayjs(transaction.description?.timestamp).fromNow() : 'N/A'}</>}
          {transaction.type == 'sell swap' && <>{transaction.description?.timestamp ? dayjs(transaction.description?.timestamp).fromNow() : 'N/A'}</>}
          {transaction.type == 'send' && <>{transaction.block?.timestamp.time ? dayjs(transaction.block?.timestamp.time).fromNow() : 'N/A'}</>}
          {transaction.type == 'receive' && <>{transaction.block?.timestamp.time ? dayjs(transaction.block?.timestamp.time).fromNow() : 'N/A'}</>}
        </>
      }
    },
  ];

  const filters: Filter[] = [
    {
      name: 'Date Range',
      type: 'date-range',
      state: dateRange,
      setState: setDateRange
    }
  ];


  const toggleSorting = (column: any) => {
    const isSortedAsc = column.getIsSorted() === 'asc';
    const isSortedDesc = column.getIsSorted() === 'desc';

    if (isSortedAsc) {
      setSortOrder('desc');
      column.toggleSorting(true);
    } else if (isSortedDesc) {
      setSortBy('');
      setSortOrder('asc');
      column.clearSorting();
    } else {
      setSortBy(column.id);
      setSortOrder('asc');
      column.toggleSorting(false);
    }
  };

  return (
    <ServerSideSmartTable
      data={walletSwapsData as unknown as TransactionType[]}
      columns={columns}
      page={page}
      pageCount={pageSize}
      setPage={setPage}
      setPageSize={setPageSize}
      setSearchValue={setSearchValue}
      loading={walletSwapsLoading}
    >
      <FilterDialog filters={filters} />
    </ServerSideSmartTable>
  );
}
