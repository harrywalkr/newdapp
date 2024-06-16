'use client';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { BiTimeFive } from 'react-icons/bi';
import { LuArrowLeftRight } from 'react-icons/lu';
import { MdDateRange } from 'react-icons/md';
import { FaEthereum } from 'react-icons/fa6';
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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


dayjs.extend(relativeTime);


interface Props {
  walletAddress: string;
  dateRange: {
    from: string;
    till: string;
  } | null;
}

export default function WalletTransaction({ dateRange, walletAddress }: Props) {
  const [walletSwapsQuery, imagesQuery] = useQueries({
    queries: [
      {
        queryKey: ["wallet-swaps", { dateRange, walletAddress }],
        queryFn: () =>
          getWalletSwaps({
            params: {
              params: dateRange,
              address: walletAddress
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
    if (!address) return undefined
    const temp = imagesQuery.data?.find((image) => image.token == address);
    return temp?.imageUrl;
  }

  const sortedSwaps = (swaps: SwapType) => {
    let sortedSwaps = swaps.transactions.sort((a, b) => {
      return new Date(b.block?.timestamp?.time!).getTime() - new Date(a.block?.timestamp?.time!).getTime()
    });
    return sortedSwaps
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
      {/* <div className="grid grid-cols-1 gap-5">
        {walletSwapsQuery.data && sortedSwaps(walletSwapsQuery.data as SwapType).map((swap, id) => {
          if (!swap.type) return null;
          if (swap.type.includes('swap')) {
            return <div key={id}>
              <Swap data={swap}
                image={swap.type?.includes("swap")
                  ? imageUrl(swap.description?.sentTokenAddress)
                  : swap.currency?.symbol}
              />
              <Separator className="my-2" />
            </div>
          } else {
            return <div key={id}>
              <Other data={swap}
                image={swap.type?.includes("swap")
                  ? imageUrl(swap.description?.sentTokenAddress)
                  : swap.currency?.symbol}
              />;
              <Separator className="my-2" />
            </div>
          }
        })}
      </div> */}

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
          <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>


    </ScrollArea>

  );
}

const Swap = ({ data, image }: { data: any; image?: string }) => {

  const type: 'buy' | 'sell' = data.type.split(' ')[0] as 'buy' | 'sell';
  const { sentTokenName, sentTokenAddress, receivedTokenName, receivedTokenAddress, sentAmount, receivedAmount, timestamp, profit } = data.description;


  return (
    <div className="relative bg-base-200/70 w-full p-4 rounded-lg grid grid-cols-1 lg:grid-cols-3 gap-5 col-span-1">
      <div className="absolute w-2 h-full /60 rounded-l-lg"></div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="avatar-group -space-x-6">
            <div>data.currency.symbol</div>
            <Avatar >
              <AvatarImage
                src={image}
              />
              {/* <AvatarFallback>{data.currency.symbol.tokenName.charAt(0) || "N/A"}</AvatarFallback> */}
            </Avatar>

          </div>
          <TransactionTypeBadge type={type} />
        </div>
        <TransactionHashLink hash={data.transactions[0].transaction.hash} />
      </div>
      <div className="flex-1 flex flex-col justify-center gap-2">
        <TokenAmount value={sentAmount} tokenName={sentTokenName} tokenAddress={sentTokenAddress} />
        <LuArrowLeftRight className="text-md self-center" />
        <TokenAmount value={receivedAmount} tokenName={receivedTokenName} tokenAddress={receivedTokenAddress} />
      </div>
      <TransactionDetails timestamp={timestamp} profit={profit} />
    </div>
  );
};

const Other = ({ data, image }: { data: any; image?: string }) => {
  const type: 'send' | 'receive' = data.type as 'send' | 'receive';

  return (
    <div className="relative bg-base-200/70 w-full p-4 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className={`absolute w-2 h-full ${type === 'send' ? 'bg-success/60' : 'bg-error/60'} rounded-l-lg`}></div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-16">
          <div>data.currency.symbol</div>
          <Avatar >
            <AvatarImage
              src={image}
            />
            {/* <AvatarFallback>{data.currency.symbol.tokenName.charAt(0) || "N/A"}</AvatarFallback> */}
          </Avatar>
          <TransactionTypeBadge type={type} />
        </div>
        {/* <TransactionHashLink hash={data.transactions[0].transaction.hash} /> */}
      </div>
      <div className="flex-1 flex justify-center gap-2">
        <TokenAmount value={data.amount} tokenName={data.currency.symbol} tokenAddress={data.currency.address} />
      </div>
      <TransactionDetails timestamp={data.block.timestamp.time} profit={data.amount_usd} />
    </div>
  );
};


const TransactionTypeBadge = ({ type }: { type: 'buy' | 'sell' | 'send' | 'receive' }) => (
  <div className={`mt-[1rem] ${type === 'buy' || type === 'send' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'} rounded-lg text-center p-2`}>
    {type.charAt(0).toUpperCase() + type.slice(1)} Swap
  </div>
);

const TransactionHashLink = ({ hash }: { hash: string }) => (
  <div className="flex space-x-2 items-center">
    <div className="flex flex-col gap-2">
      <a href={`https://etherscan.io/tx/${hash}`} target="_blank" className="link link-hover underline text-info text-sm">
        Transaction Hash
      </a>
    </div>
  </div>
);

const TokenAmount = ({ value, tokenName, tokenAddress }: { value: number; tokenName: string; tokenAddress: string }) => (
  <div className="flex flex-col gap-2 items-center justify-center">
    <div className="flex items-center gap-2">
      <span className="font-bold">
        <PriceFormatter value={value} />
      </span>
      <span className="opacity-60">{tokenName}</span>
      {tokenAddress !== '-' && <Copy text={tokenAddress} />}
    </div>
  </div>
);

const TransactionDetails = ({ timestamp, profit }: { timestamp: string; profit: number }) => (
  <div className="flex-1 flex flex-col gap-2">
    <div className="flex items-center justify-end gap-1 opacity-60">
      <MdDateRange className="text-lg" />
      <span>{dayjs().format(timestamp.split(' ')[0])}</span>
    </div>
    <div className="flex items-center justify-end gap-1 opacity-60">
      <BiTimeFive className="text-lg" />
      <span>{dayjs().format(timestamp.split(' ')[1])}</span>
    </div>
    <div className="font-medium flex gap-1 justify-end items-center">
      <span className="opacity-60">Swap Value: </span>
      <span className={`${profit > 0 ? 'text-success' : 'text-error'}`}>{`$${profit.toFixed(2)}`}</span>
    </div>
  </div>
);
