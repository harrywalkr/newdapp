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
      accessorKey: 'tokens',
      header: 'Tokens',
      cell: ({ row }) => {
        const transaction = row.original;
        const { sentTokenName, receivedTokenName } = transaction.description || {};
        // const { image, image2 } = imagesData || {};

        if (transaction.type?.includes("swap")) {
          return (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <div className="avatar-group -space-x-6">
                  {sentTokenName === "ETH" ? (
                    <div className="w-16 h-16 border border-base-content/70 rounded-full flex justify-center items-center">
                      <FaEthereum className="text-2xl" />
                    </div>
                  ) : (
                    <div className="avatar">
                      <div className="w-16 h-16">
                        {transaction.description?.sentTokenAddress &&
                          imagesData != undefined ? (
                          <img
                            width={56}
                            height={56}
                            src={imageUrl(transaction.description?.sentTokenAddress, imagesData)}
                            alt={sentTokenName}
                          />
                        ) : (
                          <div className="bg-base-100 flex justify-center items-center w-16 h-16 font-bold text-base border border-base-content rounded-full">
                            {sentTokenName?.charAt(0)}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {receivedTokenName === "ETH" ? (
                    <div className="w-16 h-16 border border-base-content/70 rounded-full flex justify-center items-center">
                      <FaEthereum className="text-2xl" />
                    </div>
                  ) : (
                    <div className="avatar">
                      {/* <div className="w-16 h-16">
                        {image2 ? (
                          <img
                            width={56}
                            height={56}
                            src={image2}
                            alt={receivedTokenName}
                            style={{ opacity: image2 ? 1 : 0.3 }}
                          />
                        ) : (
                          <div className="bg-base-100 flex justify-center items-center w-16 h-16 font-bold text-base border border-base-content rounded-full">
                            {receivedTokenName?.charAt(0)}
                          </div>
                        )}
                      </div> */}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div className="flex flex-col gap-2">
              {/* <div className="flex items-center gap-16">
                {currency?.symbol === "ETH" ? (
                  <div className="w-16 h-16 border border-base-content/70 rounded-full flex justify-center items-center">
                    <FaEthereum className="text-2xl" />
                  </div>
                ) : (
                  <div className="avatar">
                    <div className="mask mask-squircle w-16 h-16">
                      {image ? (
                        <img
                          width={56}
                          height={56}
                          src={image}
                          alt={currency?.symbol}
                          style={{ opacity: image ? 1 : 0.3 }}
                        />
                      ) : (
                        <div className="flex justify-center items-center w-16 h-16 font-bold text-base border border-base-content rounded-full">
                          {currency?.symbol.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div className="bg-gray-200 rounded-lg text-center p-2 text-gray-700 flex gap-1 items-center">
                  <span className="capitalize">{type}</span>
                  {type === "send" ? (
                    <BsArrowUpRightCircle className="" />
                  ) : (
                    <BsArrowDownLeftCircle className="" />
                  )}
                </div>
              </div> */}
            </div>
          );
        }
      }
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
