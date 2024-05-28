import React from 'react';
import TradeReport from './trade-report';
import Chart from './chart';
import { IToken } from '@/types/token.type';
import clsx from 'clsx';
import RenderConditionalComponent from '@/components/common/RenderConditionalComponent';
import Tradingview from './Tradingview';

interface Props {
    token: IToken;
    network: string,
    tokenAddress: string;
}

export default function TokenSummary({ token, tokenAddress, network }: Props) {
    return (
        <div className='flex flex-col items-start justify-center gap-4'>
            <RenderConditionalComponent
                value={token?.data && token?.data.length > 0}
                options={{
                    trueValueComponent: (
                        <>
                            <RenderConditionalComponent
                                value={token?.ScoreData?.riskLevel}
                                options={{
                                    trueValueComponent: (
                                        <div className='whitespace-nowrap'>
                                            {'Risk level: '}
                                            <h2
                                                className={clsx('text-sm inline text-center', token!.ScoreData!.riskLevel === "High Risk" ? "text-red-500" : "text-green-400")}
                                            >
                                                {token!.ScoreData!.riskLevel}
                                            </h2>
                                        </div>
                                    ),
                                }}
                            />
                            <RenderConditionalComponent
                                value={token?.BalancesData?.numberOfAddresses}
                                options={{
                                    trueValueComponent: (
                                        <div className='whitespace-nowrap'>
                                            {'Total holders: '}
                                            <h2
                                                className={clsx('text-sm inline text-center', token!.BalancesData!.numberOfAddresses! > 10 ? "text-green-400" : "text-red-500")}
                                            >
                                                {token?.BalancesData?.numberOfAddresses}
                                            </h2>
                                        </div>
                                    ),
                                }}
                            />
                            <RenderConditionalComponent
                                value={token?.BalancesData?.numberOfAddresses}
                                options={{
                                    trueValueComponent: (
                                        <div className='whitespace-nowrap'>
                                            {'Contract security: '}
                                            <h2 className={clsx('text-sm inline text-center', "text-green-400")}>
                                                safe
                                            </h2>
                                        </div>
                                    ),
                                }}
                            />
                            <RenderConditionalComponent
                                value={token?.BalancesData?.numberOfAddresses}
                                options={{
                                    trueValueComponent: (
                                        <div className='whitespace-nowrap'>
                                            {'Launch date: '}
                                            <h2 className={clsx('text-sm inline text-center text-muted-foreground')}>
                                                2021
                                            </h2>
                                        </div>
                                    ),
                                }}
                            />
                        </>
                    ),
                    falseValueComponent: <p>Data is not available :(</p>,
                }}
            />
            {token?.TickersData?.cex !== undefined &&
                token?.TickersData?.cex?.length > 0 &&
                token?.TickersData?.cex[0]?.market?.name !== undefined ? (
                <div id="tradingviewcontainer" className="my-6 md:my-7 w-full h-80 md:h-96">
                    <Tradingview
                        symbol={`${token.TickersData.cex[0].market.name}:${token.TickersData.cex[0].base}${token.TickersData.cex[0].target}`}
                    />
                </div>
            ) : (
                <Chart tokenAddress={tokenAddress} cex={token!.TickersData!.cex!} network={network} />
            )}
            <TradeReport tokenAddress={tokenAddress} />
        </div>
    );
}
