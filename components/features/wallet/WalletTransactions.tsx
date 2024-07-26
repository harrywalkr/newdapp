'use client';

import dayjs from 'dayjs';
import { BiTimeFive } from 'react-icons/bi';
import { LuArrowLeftRight } from 'react-icons/lu';
import { useQuery } from '@tanstack/react-query';
import Copy from '@/components/ui/copy';
import { getWalletSwaps } from '@/services/http/wallets.http';
import { getImages } from '@/services/http/image.http';
import { SwapType, TransactionType } from '@/types/swap.type';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
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
import TableLoading from '@/components/layout/Table-loading';
import { ImageEndpoint, ImageType } from '@/types/Image.type';

interface Props {
  walletAddress: string;
  dateRange: { from?: Date, till?: Date };
}

interface SwapProps {
  transaction: TransactionType;
  images: ImageType[];
}


export default function WalletTransactions({ dateRange, walletAddress }: Props) {
  const { selectedChain } = useTokenChainStore();

  const { data: walletSwapsData, isLoading: walletSwapsLoading, error: walletSwapsError } = useQuery({
    queryKey: ["wallet-swaps", { dateRange, walletAddress }, selectedChain.symbol],
    queryFn: () =>
      getWalletSwaps({
        params: {
          ...dateRange,
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

  return (
    <ScrollArea className="h-96 w-full rounded-md border">
      <ScrollBar orientation="horizontal" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction</TableHead>
            <TableHead>Activity</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Swap Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {walletSwapsData && sortedSwaps(walletSwapsData).map((transaction, idx) => (
            transaction.type?.includes("swap")
              ? imagesData != undefined && <Swap key={idx} transaction={transaction} images={imagesData} />
              : imagesData != undefined && <Other key={idx} transaction={transaction} images={imagesData} />
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}



const Swap = ({ transaction, images }: SwapProps) => {
  return (
    <TableRow>
      <TableCell>
        {transaction.transactions && transaction.transactions[0].transaction?.hash &&
          <a
            href={`https://etherscan.io/tx/${transaction.transactions[0].transaction.hash}`}
            target="_blank"
            className="link link-hover underline text-info text-sm"
          >
            {minifyContract(transaction.transactions[0].transaction.hash)}
          </a>
        }
        {
          transaction.description?.timestamp &&
          <div className="flex items-center">
            <BiTimeFive className="text-lg" />
            <span>{dayjs(transaction.description.timestamp).fromNow()}</span>
          </div>
        }
      </TableCell>
      <TableCell>{transaction.type || 'N/A'}</TableCell>
      <TableCell>{transaction.currency?.symbol || 'N/A'}</TableCell>
      <TableCell className='flex items-center justify-center gap-2'>
        {transaction.description?.sentTokenAddress !== undefined ?
          transaction.description.sentTokenAddress !== "-" &&
          <Copy value={transaction.description.sentTokenAddress} text={minifyContract(transaction.description.sentTokenAddress)} /> : <>N/A</>}
        <LuArrowLeftRight />
        {transaction.description?.receivedTokenAddress !== undefined ?
          transaction.description.receivedTokenAddress !== "-" &&
          <Copy value={transaction.description.receivedTokenAddress} text={minifyContract(transaction.description.receivedTokenAddress)} /> : <>N/A</>}
        <LuArrowLeftRight />
      </TableCell>
      <TableCell>{transaction.amount !== undefined ? transaction.amount.toFixed(4) : 'N/A'}</TableCell>
    </TableRow>
  );
};

const Other = ({ transaction, images }: SwapProps) => {
  return (
    <TableRow>
      <TableCell>
        {transaction.transaction?.hash &&
          <a
            href={`https://etherscan.io/tx/${transaction.transaction.hash}`}
            target="_blank"
            className="link link-hover underline text-info text-sm"
          >
            {minifyContract(transaction.transaction.hash)}
          </a>
        }

        {
          transaction.block && transaction.block.timestamp.time.split(" ")[1] &&
          <div className="flex items-center">
            <BiTimeFive className="text-lg" />
            <span>{dayjs(transaction.block.timestamp.time.split(" ")[1]).fromNow()}</span>
          </div>
        }
      </TableCell>
      <TableCell>{transaction.type || 'N/A'}</TableCell>
      <TableCell className='flex items-center justify-center gap-2'>
        {transaction.sender?.address ? <Copy value={transaction.sender?.address} text={minifyContract(transaction.sender?.address)} /> : <>N/A</>}
        <LuArrowLeftRight />
        {transaction.receiver?.address ? <Copy value={transaction.receiver?.address} text={minifyContract(transaction.receiver?.address)} /> : <>N/A</>}
      </TableCell>
      <TableCell>{transaction.amount !== undefined ? transaction.amount.toFixed(4) : 'N/A'}</TableCell>
    </TableRow>
  );
};