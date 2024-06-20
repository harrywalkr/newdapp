'use client'
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Copy from '@/components/ui/copy';
import { ImageType } from '@/types/Image.type';
import { IToken } from '@/types/token.type';
import PriceFormatter from '@/utils/PriceFormatter';
import { formatCash } from '@/utils/numbers';
import { minifyContract, minifyTokenName } from '@/utils/truncate';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { KeyValue } from '@/components/ui/key-value';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SocialMedia from './social-media';
import { useTokenChainStore } from '@/store';
import { useQuery } from '@tanstack/react-query';
import { getLogo } from '@/services/http/image.http';
import { Button } from '@/components/ui/button';
import { StarIcon } from '@radix-ui/react-icons';
import ChainImage from '@/utils/ChainImage';
import Renounce from './Renounce';
import { CiLock } from 'react-icons/ci';
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
        <div className='flex flex-col items-stretch justify-stretch md:flex-row gap-4 w-full'>
            <Card className="w-full flex-1">
                <CardContent className="pt-6 flex items-stretch justify-between h-full">
                    <div className="left flex flex-col gap-5">
                        <div className="top flex items-center justify-start gap-5">
                            <Avatar className="h-20 w-20">
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
                                {token?.data?.[0]?.attributes?.name != undefined && token?.data[0]?.id != undefined ? (
                                    <>
                                        <div className='flex items-center justify-start gap-2'>
                                            <h1 className="text-base m-0 p-0">
                                                {minifyTokenName(token!.data![0].attributes!.name.split('/')[0])}
                                            </h1>
                                            <h2 className="text-sm m-0 p-0 text-muted-foreground">
                                                {minifyTokenName(token!.data![0].attributes!.name)}
                                            </h2>
                                            <Button size='icon' variant='outline'>
                                                <StarIcon />
                                            </Button>
                                        </div>
                                        <div className='flex items-center justify-start gap-1'>
                                            <div className='flex items-center justify-start gap-1 mr-4'>
                                                <ChainImage chainName={token!.data![0].id.split('_')[0]} />
                                                <h3 className="m-0 p-0">
                                                    {token!.data![0].id.split('_')[0]}
                                                </h3>
                                            </div>
                                            <Copy value={token!.data![0]?.id?.split("_")[1]} text={minifyContract(
                                                token!.data![0].id!.split("_")[1]
                                            )}
                                                className='text-blue-400'
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <p>No token name :(</p>
                                )}
                                <SocialMedia token={token} />
                            </div>
                        </div>
                        <div className="bottom flex flex-col gap-4">
                            <Renounce
                                active={token.FunctionCallsData?.renounceOwnership?.status === "renounced"}
                                text={token.FunctionCallsData?.renounceOwnership?.Date !== undefined
                                    ? `Contract was Renounced at ${token.FunctionCallsData?.renounceOwnership?.Date}`
                                    : `Contract is not Renounced`}
                                status={token?.ScoreData?.status || ''}
                            />
                        </div>
                    </div>
                    <div className='right flex flex-col items-start justify-between gap-2'>
                        <div  className='flex flex-col items-start justify-center gap-2'>
                            {token?.data?.[0]?.attributes?.base_token_price_usd != undefined ? (
                                <div>
                                    <span className='text-muted-foreground'>Price</span>
                                    <PriceFormatter dollarSign className='text-2xl mt-2' value={token!.data![0].attributes!.base_token_price_usd!} />
                                </div>
                            ) : (
                                <p>No price available</p>
                            )}
                            {/* <Timestamp token={token} /> */}
                            <PriceChange token={token} />
                            <BuySellTaxes token={token} />
                        </div>
                        <Button variant='outline'>
                            <span className='mr-2'>
                                Security Checker
                            </span>
                            <CiLock />
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <Card className="w-full flex-1">
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
                                {token?.data?.[0]?.attributes?.name != undefined && token?.data[0]?.id != undefined ? (
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
                                ) : (
                                    <p>No token name :(</p>
                                )}
                            </div>
                        </div>
                        <div className="bottom flex flex-col gap-4">
                            {token?.data?.[0]?.attributes != undefined ? (
                                <>
                                    <PriceChange token={token} />
                                    <Liquidity token={token} />
                                    <BuySellTaxes token={token} />
                                    <HolderInterest token={token} />
                                </>
                            ) : (
                                <p>Data is not available :(</p>
                            )}
                        </div>
                    </div>
                    <div className='right flex flex-col justify-between'>
                        <SocialMedia token={token} />
                        <div className='flex flex-col items-end justify-end gap-3 mt-2'>
                            {token?.data?.[0]?.attributes?.base_token_price_usd != undefined ? (
                                <PriceFormatter dollarSign value={token!.data![0].attributes!.base_token_price_usd!} />
                            ) : (
                                <p>No price available</p>
                            )}
                            <Timestamp token={token} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function PriceChange({ token }: { token: IToken }) {
    return (
        token?.data && token?.data[0]?.attributes?.price_change_percentage?.h24 != undefined ? (
            <KeyValue
                title="24hr Change"
                value={`${token!.data![0].attributes!.price_change_percentage!.h24!}%`}
                variant={+token!.data![0].attributes!.price_change_percentage!.h24! > 0 ? "good" : "bad"}
            />
        ) : (
            <p>No 24hr change data</p>
        )
    );
}

function Liquidity({ token }: { token: IToken }) {
    return (
        token?.data && token?.data[0]?.attributes?.reserve_in_usd != undefined ? (
            <KeyValue
                title="Liquidity"
                value={`$${formatCash(+token!.data![0].attributes!.reserve_in_usd!)}`}
                variant="default"
            />
        ) : (
            <p>No liquidity data</p>
        )
    );
}

function BuySellTaxes({ token }: { token: IToken }) {
    return (
        <div className='flex items-center justify-start gap-2'>
            {token.SecurityData?.tokenSecurity?.details?.buy_tax != undefined ? (
                <KeyValue
                    title="Buy tax"
                    value={`${+token!.SecurityData!.tokenSecurity!.details!.buy_tax! * 100}%`}
                    variant="good"
                />
            ) : (
                <p>No buy tax data</p>
            )}
            {token.SecurityData?.tokenSecurity?.details?.sell_tax != undefined ? (
                <KeyValue
                    title="Sell tax"
                    value={`${+(+token!.SecurityData!.tokenSecurity!.details!.sell_tax!).toFixed(2) * 100}%`}
                    variant="bad"
                />
            ) : (
                <p>No sell tax data</p>
            )}
        </div>
    );
}

function HolderInterest({ token }: { token: IToken }) {
    return (
        token?.BalancesData?.numberOfAddresses != undefined ? (
            <KeyValue
                title="Holder interest"
                value={token?.BalancesData?.numberOfAddresses}
                variant={token!.BalancesData!.numberOfAddresses! > 10 ? "good" : "bad"}
            />
        ) : (
            <p>No holder interest data</p>
        )
    );
}

function Timestamp({ token }: { token: IToken }) {
    return (
        token?.timestamp != undefined ? (
            <h3 className="bottom whitespace-nowrap text-muted-foreground text-sm">
                {dayjs().to(token.timestamp)}
            </h3>
        ) : (
            <p>No timestamp available</p>
        )
    );
}
