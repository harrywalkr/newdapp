import Copy from '@/components/ui/copy';
import { ImageType } from '@/types/Image.type';
import { TransactionType } from '@/types/swap.type';
import PriceFormatter from '@/utils/PriceFormatter';
import Image from 'next/image';
import React from 'react'
import { FaEthereum } from 'react-icons/fa';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { minifyContract } from '@/utils/truncate';

dayjs.extend(relativeTime);


interface Props {
    swap: TransactionType;
    image?: string,
    isSwap?: boolean
}

export default function Transaction({ swap, image, isSwap }: Props) {
    // 
    //  {/* logo + token name */}
    //             {/* type = 
    //     withdrawal/send (red) 
    //     deposit/receive (green)
    //     sellSwap 
    //     buySwap
    // */}
    return (
        <div className='px-4 py-5'>
            {
                isSwap ?
                    <div className='swap flex flex-col items-start justify-start text-sm'>
                        <div className="top w-full flex items-start justify-between">
                            <div className='flex flex-col items-center justify-center gap-2'>
                                <div className='image flex flex-col items-center justify-center -space-y-2'>
                                    {
                                        swap.description?.sentTokenName === "ETH" ? (
                                            <div className="w-10 h-10 border border-muted rounded-full flex justify-center items-center">
                                                <FaEthereum className="text-sm" />
                                            </div>
                                        ) : (<>
                                            {image != undefined ? (
                                                <Image
                                                    width={40}
                                                    height={40}
                                                    className='rounded-full z-10'
                                                    src={image}
                                                    alt={swap.description?.sentTokenName || 'token image'}
                                                />
                                            ) : (
                                                <div className="flex justify-center items-center w-10 h-10 font-bold text-base border border-muted rounded-full">
                                                    {swap.description?.sentTokenName.charAt(0)}
                                                </div>
                                            )}
                                        </>)
                                    }
                                    {
                                        swap.description?.receivedTokenName === "ETH" ? (
                                            <div className="w-10 h-10 border border-muted rounded-full flex justify-center items-center">
                                                <FaEthereum className="text-base" />
                                            </div>
                                        ) : (<>
                                            {image != undefined ? (
                                                <Image
                                                    width={40}
                                                    height={40}
                                                    className='rounded-full z-10'
                                                    src={image}
                                                    alt={swap.description?.receivedTokenName || 'token image'}
                                                />
                                            ) : (
                                                <div className="flex justify-center items-center w-10 h-10 font-bold text-base border border-muted rounded-full">
                                                    {swap.description?.receivedTokenName.charAt(0)}
                                                </div>
                                            )}
                                        </>)
                                    }
                                </div>
                            </div>
                            <div className='flex flex-col items-center justify-center'>
                                {swap.type && swap.type.split(" ")[0] === "sell" ? (
                                    <span className="text-red-400 text-sm">
                                        Sell Swap
                                    </span>
                                ) : (
                                    <span className="text-green-500 text-sm">
                                        Buy Swap
                                    </span>
                                )}
                                {
                                    swap.description?.sentTokenAddress != undefined &&
                                    <Copy text={minifyContract(swap.description.sentTokenAddress)} value={swap.description.sentTokenAddress} />
                                }
                            </div>
                            <div className='flex flex-col items-center justify-center gap-2'>
                                {swap.description != undefined &&
                                    <PriceFormatter value={swap.description.sentAmount} />
                                }
                                {
                                    swap.description?.sentTokenName != undefined &&
                                    <span className="sent-token-name">{swap.description.sentTokenName}</span>}

                                {
                                    swap.description?.receivedAmount != undefined &&
                                    <PriceFormatter value={swap.description.receivedAmount} />}
                                {
                                    swap.description?.receivedTokenName != undefined &&
                                    <span className="opacity-60">{swap.description.receivedTokenName}</span>}
                                {
                                    swap.description?.receivedTokenAddress != undefined &&
                                    <Copy text={minifyContract(swap.description.receivedTokenAddress)} value={swap.description.receivedTokenAddress} />}
                            </div>
                            <div className='flex flex-col items-center justify-center gap-2'>

                                {
                                    swap.description?.profit != undefined &&
                                    <span className={`${swap.description.profit > 0 ? "text-success" : "text-error"}`}>
                                        {`$${swap.description.profit.toFixed(2)}`}
                                    </span>
                                }
                            </div>
                        </div>
                        <div className="bottom flex items-center justify-start gap-2">
                            <div>
                                {
                                    swap.transactions != undefined &&
                                    <a
                                        className="whitespace-nowrap underline text-sm"
                                        href={`https://etherscan.io/tx/${swap.transactions[0].transaction.hash}`}
                                        target="_blank"
                                    >
                                        Tx Hash
                                    </a>
                                }
                            </div>
                            <div>
                                {
                                    swap.description?.timestamp != undefined &&
                                    <>
                                        <span>{dayjs().format(swap.description.timestamp.split(" ")[0])}</span>
                                        <span>{dayjs().format(swap.description.timestamp.split(" ")[1])}</span>
                                    </>
                                }
                            </div>
                        </div>

                    </div>
                    : <div className='no-swap'>
                        <div className="image">
                            {image != undefined ? (
                                <Image
                                    width={40}
                                    height={40}
                                    className='rounded-full'
                                    src={`/${image}.png`}
                                    alt={swap.currency?.symbol || 'token image'}
                                />
                            ) : (
                                <div className="flex justify-center items-center w-10 h-10 font-bold text-base border border-muted rounded-full">
                                    {swap.description?.receivedTokenName.charAt(0)}
                                </div>
                            )}
                        </div>
                    </div>
            }


            <div>
                {/* amount usd */}
                {/* amount usd */}
                {/* token amount (small) */}
            </div>
        </div >
    )
}
