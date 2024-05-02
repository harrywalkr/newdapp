import { Button } from '@/components/ui/button'
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
    walletAddress: string
    walletSummary: WalletSummaryType,
    walletBalance: WalletBalanceType,
}

// FIXME: Add hover card tooltip for more info and redirect to blog
export default function WalletOverview({ walletAddress, walletSummary, walletBalance }: Props) {
    return (
        <Card className="w-full">
            <CardContent className="pt-6 flex flex-col gap-5">
                <div className='top flex items-center justify-between'>
                    <div className="left flex flex-col items-start justify-center gap-4">
                        <Copy className='text-sm' text={minifyContract(walletAddress)} value={walletAddress} />
                        <KeyValue title='Rank' titleIcon={<FaRankingStar />} value='hard-code' variant='bad' />
                        {
                            walletSummary.labelTrader &&
                            <KeyValue title='Type' titleIcon={<TbSunMoon />}
                                value={walletSummary.labelTrader}
                                valueIcon={walletSummary.labelTrader == "Day Trader" ? (
                                    <IoSunnyOutline />
                                ) : (
                                    <IoMoonOutline />
                                )}
                                variant='default' />
                        }
                        {
                            walletSummary.totalScore &&
                            <KeyValue
                                title='Score'
                                titleIcon={<MdOutlineScoreboard />}
                                // FIXME: what is the total score so I can type 400/2000
                                value={walletSummary.totalScore}
                                variant={walletSummary.totalScore > 1000 ? 'good' : 'bad'} />
                        }
                        {
                            walletSummary.netProfit != undefined &&
                            <KeyValue
                                title='Pnl'
                                titleIcon={<MdAttachMoney />}
                                value={
                                    separate3digits(walletSummary.netProfit?.toFixed(2)) + '$'
                                }
                                variant={
                                    walletSummary.netProfit > 0
                                        ? "good"
                                        : "bad"
                                } />
                        }
                    </div>
                    <div className="right flex flex-col items-start justify-center gap-4">
                        {
                            walletSummary.TotalFee != undefined &&
                            <KeyValue title='Fees Paid'
                                titleIcon={<IoReceiptOutline />}
                                value={(walletSummary.TotalFee || 0).toFixed(2)}
                                variant='default' />
                        }
                        {
                            walletSummary.labelTrader &&
                            <KeyValue
                                title='Profit'
                                titleIcon={<BiCoin />}
                                value='HC'
                                variant='bad' />
                        }
                        {
                            walletSummary.winRate != undefined &&
                            <KeyValue
                                title='Winrate'
                                titleIcon={<IoIosWine />}
                                value={+walletSummary.winRate / 10}
                                variant='default' />
                        }
                        {
                            walletSummary.labelTrader &&
                            <KeyValue
                                title='Size'
                                value='HC'
                                variant='bad' />
                        }
                        {
                            walletSummary.overallAverageHoldingTimeAndProfit?.HoldingTime != undefined &&
                            <KeyValue
                                title='Avg Pos'
                                value={walletSummary.overallAverageHoldingTimeAndProfit?.HoldingTime}
                                variant='default' />
                        }

                    </div>
                </div>
                <DatePickerWithRange />
            </CardContent>
        </Card>
    )
}
