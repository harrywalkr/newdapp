import React from 'react';
import TradeReport from './trade-report';
import Chart from './chart';
import { IToken } from '@/types/token.type';
import Tradingview from './Tradingview';
import { KeyValue } from '@/components/ui/key-value';
import TransactionStats from './TransactionStats';

interface Props {
    token: IToken;
    network: string,
    tokenAddress: string;
}

export default function TokenSummary({ token, tokenAddress, network }: Props) {
    return (
        <div className='flex flex-col items-start justify-center gap-4'>

            {token?.data && token?.data.length > 0 ? (
                <TransactionStats token={token} />
                // <>
                //     {token?.ScoreData?.riskLevel != undefined && (
                //         <KeyValue
                //             title="Risk level"
                //             value={token!.ScoreData!.riskLevel}
                //             variant={token!.ScoreData!.riskLevel === "High Risk" ? "bad" : "good"}
                //         />
                //     )}
                //     {token?.BalancesData?.numberOfAddresses != undefined && (
                //         <KeyValue
                //             title="Total holders"
                //             value={token?.BalancesData?.numberOfAddresses}
                //             variant={token!.BalancesData!.numberOfAddresses! > 10 ? "good" : "bad"}
                //         />
                //     )}
                //     {token?.BalancesData?.numberOfAddresses != undefined && (
                //         <KeyValue
                //             title="Contract security"
                //             value="safe"
                //             variant="good"
                //         />
                //     )}
                //     {token?.BalancesData?.numberOfAddresses != undefined && (
                //         <KeyValue
                //             title="Launch date"
                //             value="2021"
                //             variant="default"
                //         />
                //     )}
                // </>
            ) : (
                <p>Data is not available :(</p>
            )}
            {token?.TickersData?.cex !== undefined &&
                token?.TickersData?.cex?.length > 0 &&
                token?.TickersData?.cex[0]?.market?.name !== undefined ? (
                <div id="tradingviewcontainer" className="my-6 md:my-7 w-full h-[600px] rounded-lg overflow-hidden">
                    <Tradingview
                        symbol={`${token.TickersData.cex[0].market.name}:${token.TickersData.cex[0].base}${token.TickersData.cex[0].target}`}
                    />
                </div>
            ) : (
                <div className='w-full'>
                    {token!.data![0]?.id?.split("_")[1] != undefined && (
                        <Chart className="h-[600px]" tokenAddress={token!.data![0]?.id!.split("_")[1]} network={network} />
                    )}
                </div>
            )}
            {
                token.data && token.data[0].attributes?.name != undefined &&
                <TradeReport tokenAddress={token!.data![0]?.id!.split("_")[1]} tokenAddress2={tokenAddress} tokenName={token!.data![0].attributes!.name} network={network} />
            }
        </div>
    );
}
