import React from 'react'
import TradeReport from './trade-report'
import Chart from './chart'
import { TokenType } from '@/types/token.type'
import clsx from 'clsx'

interface Props {
    token: TokenType,
    tokenAddress: string
}


export default function TokenSummary({ token, tokenAddress }: Props) {
    return (
        <div className='flex flex-col items-start justify-center gap-3'>
            {
                token?.data && token?.data.length > 0 ? <>
                    {
                        token?.ScoreData?.riskLevel &&
                        <div className='whitespace-nowrap'>
                            {`Risk level : `}
                            <h2
                                className={clsx('text-sm inline text-center',
                                    token?.ScoreData.riskLevel === "High Risk"
                                        ? " text-red-500"
                                        : " text-green-400"
                                )}
                            >
                                {token?.ScoreData.riskLevel}
                            </h2>
                        </div>
                    }
                    {
                        token?.BalancesData?.numberOfAddresses != undefined &&
                        <div className='whitespace-nowrap'>
                            {`Total holders : `}
                            <h2
                                className={clsx('text-sm inline text-center',
                                    token?.BalancesData?.numberOfAddresses > 10
                                        ? " text-green-400"
                                        : " text-red-500"
                                )}
                            >
                                {token?.BalancesData?.numberOfAddresses}
                            </h2>
                        </div>
                    }
                    {
                        // FIXME: where do I get contract security from? remove hard code
                        token?.BalancesData?.numberOfAddresses != undefined &&
                        <div className='whitespace-nowrap'>
                            {`Contract security : `}
                            <h2
                                className={clsx('text-sm inline text-center',
                                    token?.BalancesData?.numberOfAddresses > -1
                                        ? " text-green-400"
                                        : " text-red-500"
                                )}
                            >
                                safe
                            </h2>
                        </div>
                    }
                    {
                        // FIXME: where do I get launch date from? remove hard code
                        token?.BalancesData?.numberOfAddresses != undefined &&
                        <div className='whitespace-nowrap'>
                            {`Launch date : `}
                            <h2
                                className={clsx('text-sm inline text-center text-muted-foreground')}
                            >
                                2021
                            </h2>
                        </div>
                    }
                </> : <p>
                    Data is not available :(
                </p>}
            <div className='h-80 w-full mt-5'>
                <Chart />
            </div>
            <TradeReport tokenAddress={tokenAddress} />
        </div>
    )
}
