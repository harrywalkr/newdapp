import React from 'react'
import TradeReport from './trade-report'
import Chart from './chart'
import { TokenType } from '@/types/token.type'
import clsx from 'clsx'
import RenderConditionalComponent from '@/utils/RenderConditionalComponent'
import Tradingview from './Tradingview'

interface Props {
    token: TokenType,
    tokenAddress: string
}
export default function TokenSummary({ token, tokenAddress }: Props) {
    return (
        <div className='flex flex-col items-start justify-center gap-4'>
            {RenderConditionalComponent(token?.data && token?.data.length > 0, {
                trueValueComponent: (
                    <>
                        {RenderConditionalComponent(token?.ScoreData?.riskLevel, {
                            trueValueComponent: (
                                <div className='whitespace-nowrap'>
                                    {'Risk level: '}
                                    <h2 className={clsx('text-sm inline text-center',
                                        token!.ScoreData!.riskLevel === "High Risk"
                                            ? " text-red-500"
                                            : " text-green-400"
                                    )}
                                    >
                                        {token!.ScoreData!.riskLevel}
                                    </h2>
                                </div>
                            ),
                        })}
                        {RenderConditionalComponent(token?.BalancesData?.numberOfAddresses, {
                            trueValueComponent: (
                                <div className='whitespace-nowrap'>
                                    {'Total holders: '}
                                    <h2 className={clsx('text-sm inline text-center',
                                        token!.BalancesData!.numberOfAddresses! > 10
                                            ? " text-green-400"
                                            : " text-red-500"
                                    )}
                                    >
                                        {token?.BalancesData?.numberOfAddresses}
                                    </h2>
                                </div>
                            ),
                        })}
                        {RenderConditionalComponent(token?.BalancesData?.numberOfAddresses, {
                            trueValueComponent: (
                                <div className='whitespace-nowrap'>
                                    {'Contract security: '}
                                    <h2 className={clsx('text-sm inline text-center', " text-green-400")}
                                    >
                                        safe
                                    </h2>
                                </div>
                            ),
                        })}
                        {RenderConditionalComponent(token?.BalancesData?.numberOfAddresses, {
                            trueValueComponent: (
                                <div className='whitespace-nowrap'>
                                    {'Launch date: '}
                                    <h2 className={clsx('text-sm inline text-center text-muted-foreground')}
                                    >
                                        2021
                                    </h2>
                                </div>
                            ),
                        })}
                    </>
                ),
                falseValueComponent: <p>Data is not available :(</p>
            })}

            {RenderConditionalComponent(token?.TickersData?.cex && token?.TickersData?.cex.length > 0, {
                trueValueComponent: (
                    <div
                        id="tradingviewcontainer"
                        className="my-6 md:my-7 w-full h-80 md:h-96"
                    >
                        <Tradingview
                            symbol={
                                `${token!.TickersData!.cex![0].market!.name!}:` +
                                token!.TickersData!.cex![0].base +
                                token.TickersData!.cex![0].target
                            }
                        />
                    </div>
                ),
                falseValueComponent: (
                    <div className='h-80 md:h-96 w-full my-6 md:my-7'>
                        <Chart tokenAddress={tokenAddress} cex={token!.TickersData!.cex!} />
                    </div>
                )
            })}

            <TradeReport tokenAddress={tokenAddress} />
        </div>
    )
}