'use client'
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Copy from '@/components/ui/copy';
import { ImageType } from '@/types/Image.type';
import { IToken } from '@/types/token.type';
import PriceFormatter from '@/utils/PriceFormatter';
import { formatCash } from '@/utils/numbers';
import { minifyContract, minifyTokenName } from '@/utils/truncate';
import RenderConditionalComponent from '@/components/common/RenderConditionalComponent';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { KeyValue } from '@/components/ui/key-value';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SocialMedia from './social-media';
import { useTokenChainStore } from '@/store';
import { useQuery } from '@tanstack/react-query';
import { getLogo } from '@/services/http/image.http';
dayjs.extend(relativeTime);

interface Props {
    tokenAddress: string,
    token: IToken,
    network: string
}

export default function TokenOverview({ token, tokenAddress, network }: Props) {

    const { data: logo, isLoading: logoLoading, error: logoError } = useQuery({
        queryKey: ['logo', tokenAddress, network],
        queryFn: () => getLogo(tokenAddress, network),
        enabled: !!tokenAddress && !!network,
    });

    return (
        <Card className="w-full">
            <CardContent className="pt-6 flex items-stretch justify-between h-full">
                <div className="left flex flex-col gap-5">
                    <div className="top flex items-center justify-start gap-5">
                        <Avatar className="h-14 w-14">
                            {logoLoading ? (
                                <AvatarFallback>Loading...</AvatarFallback>
                            ) : logoError ? (
                                <AvatarFallback>Error</AvatarFallback>
                            ) : (
                                <AvatarImage
                                    src={logo?.imageUrl}
                                    alt={token?.data?.[0]?.attributes?.name || ''}
                                />
                            )}
                            <AvatarFallback>{token?.data?.[0]?.attributes?.name?.charAt(0) || "N/A"}</AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col items-start justify-center gap-2'>
                            <RenderConditionalComponent value={token?.data?.[0]?.attributes?.name && token?.data[0]?.id} options={{
                                trueValueComponent: (
                                    <>
                                        <h1 className="text-base m-0 p-0">
                                            {minifyTokenName(token!.data![0].attributes!.name)}
                                        </h1>
                                        <Copy value={token!.data![0]?.id?.split("_")[1]} text={minifyContract(
                                            token!.data![0].id!.split("_")[1]
                                        )}
                                            className='text-sm'
                                        />
                                    </>
                                ),
                                falseValueComponent: <p>No token name :(</p>
                            }} />
                        </div>
                    </div>
                    <div className="bottom flex flex-col gap-4">
                        <RenderConditionalComponent value={token?.data?.[0]?.attributes} options={{
                            trueValueComponent: (
                                <>
                                    <PriceChange token={token} />
                                    <Liquidity token={token} />
                                    <BuySellTaxes token={token} />
                                    <HolderInterest token={token} />
                                </>
                            ),
                            falseValueComponent: <p>Data is not available :(</p>
                        }} />
                    </div>
                </div>
                <div className='right flex flex-col justify-between'>
                    <SocialMedia token={token} />
                    <div className='flex flex-col items-end justify-end gap-3 mt-2'>
                        <RenderConditionalComponent value={token?.data?.[0]?.attributes?.base_token_price_usd} options={{
                            trueValueComponent: (
                                <PriceFormatter dollarSign value={token!.data![0].attributes!.base_token_price_usd!} />
                            ),
                            falseValueComponent: <p>No price available</p>
                        }} />
                        <Timestamp token={token} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function PriceChange({ token }: { token: IToken }) {
    return (
        <RenderConditionalComponent value={token?.data && token?.data[0]?.attributes?.price_change_percentage?.h24} options={{
            trueValueComponent: (
                <KeyValue
                    title="24hr Change"
                    value={`${token!.data![0].attributes!.price_change_percentage!.h24!}%`}
                    variant={+token!.data![0].attributes!.price_change_percentage!.h24! > 0 ? "good" : "bad"}
                />
            ),
            falseValueComponent: <p>No 24hr change data</p>
        }} />
    );
}

function Liquidity({ token }: { token: IToken }) {
    return (
        <RenderConditionalComponent value={token?.data && token?.data[0]?.attributes?.reserve_in_usd} options={{
            trueValueComponent: (
                <KeyValue
                    title="Liquidity"
                    value={`$${formatCash(+token!.data![0].attributes!.reserve_in_usd!)}`}
                    variant="default"
                />
            ),
            falseValueComponent: <p>No liquidity data</p>
        }} />
    );
}

function BuySellTaxes({ token }: { token: IToken }) {
    return (
        <div className='flex items-center justify-start gap-2'>
            <RenderConditionalComponent value={token.SecurityData?.tokenSecurity?.details?.buy_tax} options={{
                trueValueComponent: (
                    <KeyValue
                        title="Buy tax"
                        value={`${+token!.SecurityData!.tokenSecurity!.details!.buy_tax! * 100}%`}
                        variant="good"
                    />

                ),
                falseValueComponent: <p>No buy tax data</p>
            }} />
            <RenderConditionalComponent value={token.SecurityData?.tokenSecurity?.details?.sell_tax} options={{
                trueValueComponent: (
                    <KeyValue
                        title="Sell tax"
                        value={`${+token!.SecurityData!.tokenSecurity!.details!.sell_tax! * 100}%`}
                        variant="bad"
                    />
                ),
                falseValueComponent: <p>No sell tax data</p>
            }} />
        </div>
    );
}

function HolderInterest({ token }: { token: IToken }) {
    return (
        <RenderConditionalComponent value={token?.BalancesData?.numberOfAddresses} options={{
            trueValueComponent: (
                <KeyValue
                    title="Holder interest"
                    value={token?.BalancesData?.numberOfAddresses}
                    variant={token!.BalancesData!.numberOfAddresses! > 10 ? "good" : "bad"}
                />
            ),
            falseValueComponent: <p>No holder interest data</p>
        }} />
    );
}

function Timestamp({ token }: { token: IToken }) {
    return (
        <RenderConditionalComponent value={token?.timestamp} options={{
            trueValueComponent: (
                <h3 className="bottom whitespace-nowrap text-muted-foreground text-sm">
                    {dayjs().to(token.timestamp)}
                </h3>
            ),
            falseValueComponent: <p>No timestamp available</p>
        }} />
    );
}
