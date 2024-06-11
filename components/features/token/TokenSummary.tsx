import React from 'react';
import TradeReport from './trade-report';
import Chart from './chart';
import { IToken } from '@/types/token.type';
import Tradingview from './Tradingview';
import { KeyValue } from '@/components/ui/key-value';

interface Props {
    token: IToken;
    network: string,
    tokenAddress: string;
}

export default function TokenSummary({ token, tokenAddress, network }: Props) {
    return (
        <div className='flex flex-col items-start justify-center gap-4'>
            {token?.data && token?.data.length > 0 ? (
                <>
                    {token?.ScoreData?.riskLevel != undefined && (
                        <KeyValue
                            title="Risk level"
                            value={token!.ScoreData!.riskLevel}
                            variant={token!.ScoreData!.riskLevel === "High Risk" ? "bad" : "good"}
                        />
                    )}
                    {token?.BalancesData?.numberOfAddresses != undefined && (
                        <KeyValue
                            title="Total holders"
                            value={token?.BalancesData?.numberOfAddresses}
                            variant={token!.BalancesData!.numberOfAddresses! > 10 ? "good" : "bad"}
                        />
                    )}
                    {token?.BalancesData?.numberOfAddresses != undefined && (
                        <KeyValue
                            title="Contract security"
                            value="safe"
                            variant="good"
                        />
                    )}
                    {token?.BalancesData?.numberOfAddresses != undefined && (
                        <KeyValue
                            title="Launch date"
                            value="2021"
                            variant="default"
                        />
                    )}
                </>
            ) : (
                <p>Data is not available :(</p>
            )}
            {token?.TickersData?.cex !== undefined &&
                token?.TickersData?.cex?.length > 0 &&
                token?.TickersData?.cex[0]?.market?.name !== undefined ? (
                <div id="tradingviewcontainer" className="my-6 md:my-7 w-full h-96 md:h-[30rem] rounded-lg overflow-hidden">
                    <Tradingview
                        symbol={`${token.TickersData.cex[0].market.name}:${token.TickersData.cex[0].base}${token.TickersData.cex[0].target}`}
                    />
                </div>
            ) : (
                <>
                    {token!.data![0]?.id?.split("_")[1] != undefined && (
                        <Chart tokenAddress={token!.data![0]?.id!.split("_")[1]} network={network} />
                    )}
                </>
            )}
            <TradeReport tokenAddress={tokenAddress} />
        </div>
    );
}
