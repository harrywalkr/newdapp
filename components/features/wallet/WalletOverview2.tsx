import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { WalletSummaryType } from '@/types/wallet-summary.type'
import { KeyValue } from '@/components/ui/key-value'
import { minifyContract, minifyTokenName } from '@/utils/truncate'
import { separate3digits } from '@/utils/numbers'
import Copy from '@/components/ui/copy'


interface Props {
    walletSummary: WalletSummaryType,
}
// FIXME: what's SHIV holder? implement it in this new project
export default function WalletOverview({ walletSummary }: Props) {
    return (
        <Card className='max-w-2xl border-none'>
            <CardHeader>
                <CardTitle>Data Overview</CardTitle>
                <CardDescription>Snapshot of financial gains and losses</CardDescription>
            </CardHeader>
            <CardContent>
                <Card className="border-none w-full ">
                    <CardHeader>
                        <CardTitle>P&L Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className='flex flex-col gap-2'>
                            {walletSummary.highestProfit != undefined &&
                                <li>
                                    <KeyValue
                                        stretch
                                        title="Top Profit"
                                        value={minifyTokenName(walletSummary.highestProfit[1]) + ' : $' + separate3digits(walletSummary.highestProfit[0]?.toFixed(2))}
                                        valueIcon={<Copy value={walletSummary.highestProfit[2]} />}
                                        variant="default"
                                    />

                                </li>
                            }
                            {
                                walletSummary.lowestProfit != undefined &&
                                <li>
                                    <KeyValue
                                        stretch
                                        title="Min Profit"
                                        value={minifyTokenName(walletSummary.lowestProfit[1]) + ' : $' + separate3digits(walletSummary.lowestProfit[0]?.toFixed(2))}
                                        valueIcon={<Copy value={walletSummary.lowestProfit[2]} />}
                                        variant="default"
                                    />
                                </li>
                            }
                            {
                                walletSummary.lowestLoss != undefined &&
                                <li>
                                    <KeyValue
                                        stretch
                                        title="Max Loss"
                                        value={minifyTokenName(walletSummary.lowestLoss[1]) + ' : $' + separate3digits(walletSummary.lowestLoss[0]?.toFixed(2))}
                                        valueIcon={<Copy value={walletSummary.lowestLoss[2]} />}
                                        variant="default"
                                    />
                                </li>
                            }
                            {
                                walletSummary.highestLoss != undefined &&
                                <li>
                                    <KeyValue
                                        stretch
                                        title="Min Loss"
                                        value={minifyTokenName(walletSummary.highestLoss[1]) + ' : $' + separate3digits(walletSummary.highestLoss[0]?.toFixed(2))}
                                        valueIcon={<Copy value={walletSummary.highestLoss[2]} />}
                                        variant="default"
                                    />
                                </li>
                            }
                            {
                                walletSummary.overallAverageHoldingTimeAndProfit?.Profit != undefined &&
                                <li>
                                    <KeyValue
                                        stretch
                                        symbol='dollar'
                                        title="Avg P&L"
                                        value={
                                            separate3digits(
                                                walletSummary.overallAverageHoldingTimeAndProfit.Profit?.toFixed(2)
                                            )
                                        }
                                        variant="default"
                                    />
                                </li>
                            }
                            <li>
                                <KeyValue
                                    stretch
                                    symbol='percentage'
                                    title="Avg P&L %"
                                    value={separate3digits(walletSummary.averagePercentageProfit || 0)}
                                    variant="default"
                                />
                            </li>
                            {
                                walletSummary.overallAverageHoldingTimeAndProfit?.HoldingTime != undefined &&
                                <li>
                                    <KeyValue
                                        stretch
                                        title="Avg Duration"
                                        value={walletSummary.overallAverageHoldingTimeAndProfit.HoldingTime}
                                        variant="default"
                                    />
                                </li>
                            }
                            {
                                walletSummary.avgBuyAmount != undefined &&
                                <li>
                                    <KeyValue
                                        stretch
                                        symbol='dollar'
                                        title="Avg Margin"
                                        value={separate3digits(walletSummary.avgBuyAmount.toFixed(2))}
                                        variant="default"
                                    />
                                </li>
                            }
                        </ul>
                    </CardContent>
                </Card>

                <Card className="border-none w-full">
                    <CardHeader>
                        <CardTitle>HODL Activity</CardTitle>
                        <CardDescription>Duration and Closure Status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className='flex flex-col gap-2'>
                            <li>
                                <KeyValue
                                    stretch
                                    title="Open Positions"
                                    value={walletSummary?.totalNumofPartiallyClosed?.totalnumPartiallyClosedData || '0'}
                                    variant="default"
                                />
                            </li>
                            <li>
                                <KeyValue
                                    stretch
                                    title="Partially Closed Positions"
                                    value={walletSummary?.totalNumofFullyOpenedData?.totalnumPartiallyClosedData || '0'}
                                    variant="default"
                                />
                            </li>
                            {
                                walletSummary.swapTimeResults?.longestTokenInfo?.currencyAddress != undefined &&
                                <li>
                                    <KeyValue
                                        stretch
                                        title="Longest Held Token"
                                        value={minifyTokenName(walletSummary.swapTimeResults.longestTokenInfo.tokenName)}
                                        valueIcon={<Copy value={walletSummary.swapTimeResults.longestTokenInfo.currencyAddress} />}
                                        variant="default"
                                    />
                                </li>
                            }
                            {
                                walletSummary.swapTimeResults?.shortestTokenInfo?.currencyAddress != undefined &&
                                <li>
                                    <KeyValue
                                        stretch
                                        title="Shortest Held Token"
                                        value={minifyTokenName(walletSummary.swapTimeResults.shortestTokenInfo.tokenName)}
                                        valueIcon={<Copy value={walletSummary.swapTimeResults.shortestTokenInfo.currencyAddress} />}
                                        variant="default"
                                    />
                                </li>
                            }
                        </ul>
                    </CardContent>
                </Card>
                <Card className="border-none w-full">
                    <CardHeader>
                        <CardTitle>Transfers</CardTitle>
                        <CardDescription>Overview of deposits and withdrawals</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className='flex flex-col gap-2'>
                            {
                                walletSummary.totalDeposit != undefined &&
                                <li>
                                    <KeyValue
                                        symbol='dollar'
                                        stretch
                                        title="Deposited Amount"
                                        value={walletSummary.totalDeposit.toFixed(2)}
                                        variant="default"
                                    />
                                </li>
                            }
                            {
                                walletSummary.totalWithdraw != undefined &&
                                <li>
                                    <KeyValue
                                        stretch
                                        title="Withdrawn Amount"
                                        value={walletSummary.totalWithdraw.toFixed(2)}
                                        variant="default"
                                    />
                                </li>
                            }
                            {
                                walletSummary.DepositDuration != undefined &&
                                <li>
                                    <KeyValue
                                        stretch
                                        title="Avg Deposit Time"
                                        value={walletSummary.DepositDuration}
                                        variant="default"
                                    />
                                </li>
                            }
                            {
                                walletSummary.WithdrawDuration != undefined &&
                                <li>
                                    <KeyValue
                                        stretch
                                        title="Avg Withdrawal Time"
                                        value={walletSummary.WithdrawDuration}
                                        variant="default"
                                    />
                                </li>
                            }
                        </ul>
                    </CardContent>
                </Card>
                <Card className="border-none w-full">
                    <CardHeader>
                        <CardTitle>Interactions</CardTitle>
                        <CardDescription>Overview of interactions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className='flex flex-col gap-2'>
                            {
                                walletSummary.totalNumTransactionsData?.totalTransactions != undefined &&
                                <li>
                                    <KeyValue
                                        stretch
                                        title="Total Transactions"
                                        value={walletSummary.totalNumTransactionsData.totalTransactions}
                                        variant="default"
                                    />
                                </li>
                            }
                            {
                                walletSummary.totalPositions != undefined &&
                                <li>
                                    <KeyValue
                                        stretch
                                        title="Total Positions"
                                        value={walletSummary.totalPositions}
                                        variant="default"
                                    />
                                </li>
                            }
                            {
                                walletSummary.BotActivity != undefined &&
                                <li>
                                    <KeyValue
                                        stretch
                                        title='Bot Activity'
                                        value={walletSummary.BotActivity === "Bot activity" ? 'Yes' : 'No'}
                                        variant="default"
                                    />
                                </li>
                            }
                            {
                                walletSummary.details != undefined &&
                                <li>
                                    <KeyValue
                                        stretch
                                        title="Dex Trader"
                                        value={walletSummary.details === 'Dex Trader' ? 'Yes' : 'No'}
                                        variant="default"
                                    />
                                </li>
                            }
                            {walletSummary.Interaction?.mostRepeatedSendAddress?.count != undefined &&
                                <li>
                                    <KeyValue
                                        stretch
                                        title="Most Send To"
                                        description={
                                            `Count: ${walletSummary.Interaction.mostRepeatedSendAddress.count}`
                                        }
                                        valueIcon={<Copy value={walletSummary.Interaction.mostRepeatedSendAddress.address} text={minifyContract(walletSummary.Interaction.mostRepeatedSendAddress.address)} />}
                                        variant="default"
                                    />
                                </li>}

                            {walletSummary.Interaction?.mostRepeatedReceiveAddress?.count != undefined && (
                                <li>
                                    <KeyValue
                                        stretch
                                        title="Frequently Received From"
                                        description={`Count: ${walletSummary.Interaction.mostRepeatedReceiveAddress.count}`}
                                        valueIcon={<Copy value={walletSummary.Interaction.mostRepeatedReceiveAddress.address} text={minifyContract(walletSummary.Interaction.mostRepeatedReceiveAddress.address)} />}
                                        variant="default"
                                    />
                                </li>
                            )}
                            {walletSummary.Interaction?.mostIncludedAddress?.count != undefined && (
                                <li>
                                    <KeyValue
                                        stretch
                                        title="Recurring Address"
                                        description={`Count: ${walletSummary.Interaction.mostIncludedAddress.count}`}
                                        valueIcon={<Copy value={walletSummary.Interaction.mostIncludedAddress.address} text={minifyContract(walletSummary.Interaction.mostIncludedAddress.address)} />}
                                        variant="default"
                                    />
                                </li>
                            )}
                        </ul>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    )
}
