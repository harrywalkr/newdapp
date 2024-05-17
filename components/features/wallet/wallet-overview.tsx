'use client'
import { Card, CardContent } from '@/components/ui/card'
import Copy from '@/components/ui/copy'
import { KeyValue } from '@/components/ui/key-value'
import { WalletBalanceType } from '@/types/wallet-balance.type'
import { WalletSummaryType } from '@/types/wallet-summary.type'
import { separate3digits } from '@/utils/numbers'
import { minifyContract } from '@/utils/truncate'
import React from 'react'
import { BiCoin } from 'react-icons/bi'
import { FaRankingStar } from 'react-icons/fa6'
import { IoMoonOutline, IoReceiptOutline, IoSunnyOutline } from 'react-icons/io5'
import { MdAttachMoney, MdOutlineScoreboard } from 'react-icons/md'
import { TbSunMoon } from 'react-icons/tb'
import { IoIosWine } from "react-icons/io";
import { DatePickerWithRange } from './DatePickerWithRange'

interface Props {
    walletAddress: string;
    initialWalletSummary: WalletSummaryType;
    walletBalance: WalletBalanceType;
    onDateChange: (newDateRange: { from: string, till: string }) => void;
}

// FIXME: Add hover card tooltip for more info and redirect to blog
export default function WalletOverview({ walletAddress, initialWalletSummary, walletBalance, onDateChange }: Props) {

    return (
        <Card className="w-full">
            <CardContent className="pt-6 flex flex-col gap-5">
                <div className='top flex items-center justify-between'>
                    <div className="left flex flex-col items-start justify-center gap-4">
                        <Copy className='text-sm' text={minifyContract(walletAddress)} value={walletAddress} />
                        <KeyValue title='Rank' titleIcon={<FaRankingStar />} value='hard-code' variant='bad' />
                        {
                            initialWalletSummary.labelTrader &&
                            <KeyValue title='Type' titleIcon={<TbSunMoon />}
                                value={initialWalletSummary.labelTrader}
                                valueIcon={initialWalletSummary.labelTrader == "Day Trader" ? (
                                    <IoSunnyOutline />
                                ) : (
                                    <IoMoonOutline />
                                )}
                                variant='default' />
                        }
                        {
                            initialWalletSummary.totalScore &&
                            <KeyValue
                                title='Score'
                                titleIcon={<MdOutlineScoreboard />}
                                // FIXME: what is the total score so I can type 400/2000
                                value={initialWalletSummary.totalScore}
                                variant={initialWalletSummary.totalScore > 1000 ? 'good' : 'bad'} />
                        }
                        {
                            initialWalletSummary.netProfit != undefined &&
                            <KeyValue
                                title='Pnl'
                                titleIcon={<MdAttachMoney />}
                                value={
                                    separate3digits(initialWalletSummary.netProfit?.toFixed(2)) + '$'
                                }
                                variant={
                                    initialWalletSummary.netProfit > 0
                                        ? "good"
                                        : "bad"
                                } />
                        }
                    </div>
                    <div className="right flex flex-col items-start justify-center gap-4">
                        {
                            initialWalletSummary.TotalFee != undefined &&
                            <KeyValue title='Fees Paid'
                                titleIcon={<IoReceiptOutline />}
                                value={(initialWalletSummary.TotalFee || 0).toFixed(2)}
                                variant='default' />
                        }
                        {
                            initialWalletSummary.labelTrader &&
                            <KeyValue
                                title='Profit'
                                titleIcon={<BiCoin />}
                                value='HC'
                                variant='bad' />
                        }
                        {
                            initialWalletSummary.winRate != undefined &&
                            <KeyValue
                                title='Winrate'
                                titleIcon={<IoIosWine />}
                                value={+initialWalletSummary.winRate / 10}
                                variant='default' />
                        }
                        {
                            initialWalletSummary.labelTrader &&
                            <KeyValue
                                title='Size'
                                value='HC'
                                variant='bad' />
                        }
                        {
                            initialWalletSummary.overallAverageHoldingTimeAndProfit?.HoldingTime != undefined &&
                            <KeyValue
                                title='Avg Pos'
                                value={initialWalletSummary.overallAverageHoldingTimeAndProfit?.HoldingTime}
                                variant='default' />
                        }
                    </div>
                </div>
                <DatePickerWithRange className='max-w-64' onDateChange={onDateChange} />
            </CardContent>
        </Card>
    )
}
