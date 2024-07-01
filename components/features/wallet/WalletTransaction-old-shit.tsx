'use client';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState, useEffect } from 'react';
import { BiTimeFive } from 'react-icons/bi';
import { LuArrowLeftRight } from 'react-icons/lu';
import { MdDateRange } from 'react-icons/md';
import PriceFormatter from '@/utils/PriceFormatter';
import { useQueries } from '@tanstack/react-query';
import Copy from '@/components/ui/copy';
import { getWalletSwaps } from '@/services/http/wallets.http';
import { getImages } from '@/services/http/image.http';
import { SwapType } from '@/types/swap.type';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { minifyContract } from '@/utils/truncate';
import { useTokenChainStore } from '@/store';

dayjs.extend(relativeTime);

interface Props {
  walletAddress: string;
  dateRange: {
    from: Date;
    till: Date;
  } | null;
}

export default function WalletTransaction({ dateRange, walletAddress }: Props) {
  const { selectedChain } = useTokenChainStore();
  const [walletSwapsQuery, imagesQuery] = useQueries({
    queries: [
      {
        queryKey: ["wallet-swaps", { dateRange, walletAddress }, selectedChain.symbol],
        queryFn: () =>
          getWalletSwaps({
            params: {
              ...dateRange,
              address: walletAddress,
              network: selectedChain.symbol
            }
          }).then(data => data)
            .catch(error => {
              // FIXME: Create a service handler which sends errors to the logging backend
              console.error("Failed to fetch wallet swaps:", error);
              return [];
            }),
      },
      {
        queryKey: ['images'],
        queryFn: () =>
          getImages({}).then((data) => data.imageUrls)
      },
    ],
  });

  const imageUrl = (address?: string): string | undefined => {
    if (!address) return undefined;
    const temp = imagesQuery.data?.find((image) => image.token == address);
    return temp?.imageUrl;
  }

  const sortedSwaps = (swaps: SwapType) => {
    return swaps?.transactions.sort((a, b) => {
      return new Date(b.block?.timestamp?.time!).getTime() - new Date(a.block?.timestamp?.time!).getTime()
    });
  }

  if (walletSwapsQuery.isLoading || imagesQuery.isLoading) return (
    <div className='flex flex-col gap-3'>
      {
        <>
          {Array.apply(null, Array(5)).map((i) =>
            <div key={String(i)} className="flex items-center space-x-4 w-full">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/5" />
              </div>
            </div>)}
        </>
      }
    </div >)

  return (
    <ScrollArea className="h-96 w-full rounded-md border">
      <ScrollBar orientation="horizontal" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Activity</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Gas Fee</TableHead>
            <TableHead>Swap Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {walletSwapsQuery.data && sortedSwaps(walletSwapsQuery.data as SwapType)?.map((swap, id) => (
            <TableRow key={id}>
              <TableCell>
                {swap.transaction?.hash ? (
                  <Copy
                    text={minifyContract(swap.transaction.hash)}
                    value={swap.transaction.hash}
                    href={`https://etherscan.io/tx/${swap.transaction.hash}`}
                    target="_blank"
                    className="link link-hover underline text-info text-sm" />
                ) : 'N/A'}
              </TableCell>
              <TableCell>{swap.type || 'N/A'}</TableCell>
              <TableCell>{swap.currency?.symbol || 'N/A'}</TableCell>
              <TableCell className='flex items-center justify-center gap-2'>
                {swap.sender?.address ? <Copy value={swap.sender?.address} text={minifyContract(swap.sender?.address)} /> : <>N/A</>}
                <LuArrowLeftRight />
                {swap.receiver?.address ? <Copy value={swap.receiver?.address} text={minifyContract(swap.receiver?.address)} /> : <>N/A</>}
              </TableCell>
              <TableCell>{swap.transaction?.gasPrice !== undefined ? `${swap.transaction.gasPrice} Gwei` : 'N/A'}</TableCell>
              <TableCell>{swap.amount !== undefined ? swap.amount.toFixed(4) : 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
