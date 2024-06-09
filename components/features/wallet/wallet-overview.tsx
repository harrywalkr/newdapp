'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Copy from '@/components/ui/copy'
import { KeyValue } from '@/components/ui/key-value'
import { WalletBalanceType } from '@/types/wallet-balance.type'
import { WalletSummaryType } from '@/types/wallet-summary.type'
import { separate3digits } from '@/utils/numbers'
import { minifyContract, minifyTokenName } from '@/utils/truncate'
import React from 'react'
import { BiCoin } from 'react-icons/bi'
import { FaRankingStar } from 'react-icons/fa6'
import { IoMoonOutline, IoReceiptOutline, IoSunnyOutline } from 'react-icons/io5'
import { MdAttachMoney, MdOutlineScoreboard } from 'react-icons/md'
import { TbSunMoon } from 'react-icons/tb'
import { IoIosWine } from "react-icons/io";
import { DatePickerWithRange } from './DatePickerWithRange'
import { AvatarPlaceholder } from '@/components/ui/avatar'
import WalletTimelineActivity from './WalletTimelineActivity'
import { Progress } from '@/components/ui/progress'
import WalletOverviewChart from './WalletOverviewChart'
import { useMedia } from 'react-use'

interface Props {
    walletAddress: string;
    initialWalletSummary: WalletSummaryType;
    walletBalance: WalletBalanceType;
    onDateChange: (newDateRange: { from: string, till: string }) => void;
}

// FIXME: Add hover card tooltip for more info and redirect to blog
export default function WalletOverview({ walletAddress, initialWalletSummary, walletBalance, onDateChange }: Props) {
    const isDesktop = useMedia('(min-width: 1024px)');
    const isMobile = useMedia('(max-width: 767px)');


    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 w-full gap-5'>
            <Card>
                <CardHeader>
                    <CardTitle>Trader Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='top flex flex-col md:flex-row items-start justify-between'>
                        <div className='left flex items-start justify-start gap-4'>
                            <AvatarPlaceholder />
                            <div>
                                <Copy className='text-sm' text={isDesktop ? walletAddress : minifyContract(walletAddress)} value={walletAddress} />
                                <div className='flex items-center justify-start gap-3'>
                                    {
                                        initialWalletSummary?.transactionMetrics?.walletAge != undefined &&
                                        <KeyValue
                                            title='Age'
                                            value={initialWalletSummary.transactionMetrics.walletAge + ' Days'}
                                            variant='default' />
                                    }
                                    {
                                        initialWalletSummary.totalScore &&
                                        <KeyValue
                                            title='Score'
                                            titleIcon={<MdOutlineScoreboard />}
                                            // FIXME:what is the total score so I can type 400/2000
                                            value={initialWalletSummary.totalScore}
                                            variant={initialWalletSummary.totalScore > 1000 ? 'good' : 'bad'} />
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="right mt-3 md:mt-0">
                            {
                                initialWalletSummary.holdingTimeLabel != undefined &&
                                <div>{initialWalletSummary.holdingTimeLabel}</div>
                            }
                        </div>
                    </div>
                    <div className='bottom'>
                        <WalletTimelineActivity walletSummary={initialWalletSummary} />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col md:flex-row items-start justify-between gap-5 md:gap-10'>
                    <div className="left flex flex-col gap-2">
                        {
                            initialWalletSummary.netProfit != undefined &&
                            <KeyValue
                                title='Net Profit'
                                value={
                                    separate3digits(initialWalletSummary.netProfit?.toFixed(2)) + '$'
                                }
                                variant={
                                    initialWalletSummary.netProfit > 0
                                        ? "good"
                                        : "bad"
                                } />
                        }
                        {
                            initialWalletSummary.overallAverageHoldingTimeAndProfit?.HoldingTime != undefined &&
                            <KeyValue
                                title='Avg Holding Time'
                                value={initialWalletSummary.overallAverageHoldingTimeAndProfit?.HoldingTime}
                                variant='default' />
                        }
                        {
                            initialWalletSummary?.highestProfit && initialWalletSummary.highestProfit[1] != undefined &&
                            initialWalletSummary.highestProfit[0] != undefined &&
                            <KeyValue
                                stretch
                                title="Highest Profit"
                                value={minifyTokenName(initialWalletSummary.highestProfit[1]) + ' : $' + separate3digits(initialWalletSummary.highestProfit[0]?.toFixed(2))}
                                valueIcon={<Copy value={initialWalletSummary.highestProfit[2]} />}
                                variant="default"
                            />
                        }
                        {
                            initialWalletSummary.overallAverageHoldingTimeAndProfit?.Profit != undefined &&
                            <KeyValue
                                stretch
                                symbol='dollar'
                                title="Avg P&L"
                                value={
                                    separate3digits(
                                        initialWalletSummary.overallAverageHoldingTimeAndProfit.Profit?.toFixed(2)
                                    )
                                }
                                variant="default"
                            />
                        }
                        {
                            initialWalletSummary.winRate != undefined &&
                            <div >
                                {
                                    initialWalletSummary.winRate != undefined &&
                                    <KeyValue
                                        title='Winrate'
                                        className='mt-1'
                                        titleIcon={<IoIosWine />}
                                        value={(+initialWalletSummary.winRate / 10).toFixed(2)}
                                        variant='default' />
                                }
                                <Progress className='mt-2' value={+initialWalletSummary.winRate} />

                            </div>

                        }

                    </div>
                    <div className="right h-32 my-10 md:mt-0 w-full">
                        <WalletOverviewChart walletSummary={initialWalletSummary} />
                        <div className="bottom"></div>
                    </div>
                </CardContent>
            </Card>

        </div>
    )
}
