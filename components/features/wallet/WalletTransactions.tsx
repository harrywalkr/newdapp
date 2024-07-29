'use client';

import React, { useState } from 'react';
import dayjs from 'dayjs';
import { BiTimeFive } from 'react-icons/bi';
import { LuArrowLeftRight } from 'react-icons/lu';
import { useQuery } from '@tanstack/react-query';
import Copy from '@/components/ui/copy';
import { getWalletSwaps } from '@/services/http/wallets.http';
import { getImages } from '@/services/http/image.http';
import { SwapType, TransactionType } from '@/types/swap.type';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { minifyContract } from '@/utils/truncate';
import { useTokenChainStore } from '@/store';
import TableLoading from '@/components/layout/Table-loading';
import { ImageType } from '@/types/Image.type';
import { ColumnDef } from "@tanstack/react-table";
import { ClientSideSmartTable } from '@/components/ui/smart-table/ClientSideSmartTable';
import FilterDialog, { Filter } from '@/components/ui/smart-table/FilterDialog';

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
      accessorKey: 'transaction',
      header: 'Transaction',
      accessorFn: row => row.transactions?.[0]?.transaction.hash || row.transaction?.hash,
      cell: ({ row }) => {
        const transaction = row.original;
        const isSwap = transaction.type?.includes("swap");
        return (
          <>
            {isSwap ? (
              <>
                {transaction.transactions && transaction.transactions[0].transaction?.hash &&
                  <a
                    href={`https://etherscan.io/tx/${transaction.transactions[0].transaction.hash}`}
                    target="_blank"
                    className="link link-hover underline text-info text-sm"
                  >
                    {minifyContract(transaction.transactions[0].transaction.hash)}
                  </a>
                }
                {transaction.description?.timestamp && (
                  <div className="flex items-center">
                    <BiTimeFive className="text-lg" />
                    <span>{dayjs(transaction.description.timestamp).fromNow()}</span>
                  </div>
                )}
              </>
            ) : (
              <>
                {transaction.transaction?.hash &&
                  <a
                    href={`https://etherscan.io/tx/${transaction.transaction.hash}`}
                    target="_blank"
                    className="link link-hover underline text-info text-sm"
                  >
                    {minifyContract(transaction.transaction.hash)}
                  </a>
                }
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
                {transaction.description?.sentTokenAddress !== undefined ?
                  transaction.description.sentTokenAddress !== "-" &&
                  <Copy value={transaction.description.sentTokenAddress} text={minifyContract(transaction.description.sentTokenAddress)} /> : <>N/A</>}
                <LuArrowLeftRight />
                {transaction.description?.receivedTokenAddress !== undefined ?
                  transaction.description.receivedTokenAddress !== "-" &&
                  <Copy value={transaction.description.receivedTokenAddress} text={minifyContract(transaction.description.receivedTokenAddress)} /> : <>N/A</>}
              </>
            ) : (
              <>
                {transaction.sender?.address ? <Copy value={transaction.sender?.address} text={minifyContract(transaction.sender?.address)} /> : <>N/A</>}
                <LuArrowLeftRight />
                {transaction.receiver?.address ? <Copy value={transaction.receiver?.address} text={minifyContract(transaction.receiver?.address)} /> : <>N/A</>}
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
