'use client';

import React, { useState } from 'react';
import dayjs from 'dayjs';
import { BiTimeFive } from 'react-icons/bi';
import { LuArrowLeftRight } from 'react-icons/lu';
import { FaEthereum } from 'react-icons/fa';
import { BsArrowUpRightCircle, BsArrowDownLeftCircle } from 'react-icons/bs';
import { useQuery } from '@tanstack/react-query';
import Copy from '@/components/ui/copy';
import { getWalletSwaps } from '@/services/http/wallets.http';
import { getImages } from '@/services/http/image.http';
import { SwapType, TransactionType } from '@/types/swap.type';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { minifyContract } from '@/utils/truncate';
import { useTokenChainStore } from '@/store';
import TableLoading from '@/components/layout/Table-loading';
import { ColumnDef } from "@tanstack/react-table";
import { ClientSideSmartTable } from '@/components/ui/smart-table/ClientSideSmartTable';
import FilterDialog, { Filter } from '@/components/ui/smart-table/FilterDialog';
import { imageUrl } from '@/utils/imageUrl';
import { Avatar, AvatarFallback, AvatarImage, AvatarPlaceholder } from '@/components/ui/avatar';
import PriceFormatter2 from '@/utils/numberFormatter';
import PriceFormatter from '@/utils/PriceFormatter';

interface Props {
  walletAddress: string;
  dateRange: { from: Date; to: Date };
}

export default function WalletTransactions({ dateRange: initialDateRange, walletAddress }: Props) {
  const { selectedChain } = useTokenChainStore();
  const [dateRange, setDateRange] = useState<{ from: Date | undefined, to: Date | undefined }>(initialDateRange);

  const { data: walletSwapsData, isLoading: walletSwapsLoading, error: walletSwapsError } = useQuery({
    queryKey: ["wallet-swaps", { dateRange, walletAddress }, selectedChain.symbol],
    queryFn: () =>
      getWalletSwaps({
        params: {
          from: dateRange.from,
          to: dateRange.to,
          address: walletAddress,
          network: selectedChain.symbol
        }
      }).then(data => data)
  });

  const { data: imagesData, isLoading: imagesLoading, error: imagesError } = useQuery({
    queryKey: ['images'],
    queryFn: () => getImages().then((data) => data.imageUrls)
  });

  const sortedSwaps = (swaps: SwapType): TransactionType[] => {
    return swaps?.transactions.sort((a, b) => {
      return new Date(b.block?.timestamp?.time!).getTime() - new Date(a.block?.timestamp?.time!).getTime()
    });
  }

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
      header: 'Activity',
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
        return transaction.amount_usd !== undefined ? '$ ' + transaction.amount_usd.toFixed(2) : 'N/A';
      }
    },
    {
      accessorKey: 'time',
      header: 'Time',
      cell: ({ row }) => {
        const transaction = row.original;
        return transaction.description?.timestamp
          ? dayjs(transaction.description.timestamp).fromNow()
          : 'N/A';
      }
    },
  ];

  const filteredData = sortedSwaps(walletSwapsData!);

  const filters: Filter[] = [
    {
      name: 'Date Range',
      type: 'date-range',
      state: dateRange,
      setState: setDateRange
    }
  ];

  return (
    <ClientSideSmartTable
      data={filteredData}
      columns={columns}
      searchColumnAccessorKey='transaction'
      disablePagination={true}
    >
      <FilterDialog filters={filters} />
    </ClientSideSmartTable>
  );
}
