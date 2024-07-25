'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Copy from '@/components/ui/copy';
import { IToken } from '@/types/token.type';
import PriceFormatter from '@/utils/PriceFormatter';
import { formatCash } from '@/utils/numbers';
import { minifyContract, minifyTokenName } from '@/utils/truncate';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { KeyValue } from '@/components/ui/key-value';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SocialMedia from './social-media';
import { useLoadingStore, useWatchlistStore } from '@/store';
import { useQuery } from '@tanstack/react-query';
import { getLogo } from '@/services/http/image.http';
import { Button } from '@/components/ui/button';
import { StarIcon } from '@radix-ui/react-icons';
import { FaStar } from 'react-icons/fa';
import ChainImage from '@/utils/ChainImage';
import Renounce from './Renounce';
import { CiLock } from 'react-icons/ci';
import { Progress } from '@/components/ui/progress';
import CustomPieChart from './CustomPieChart';

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

    const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlistStore();
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const setLoading = useLoadingStore((state) => state.setLoading); // Use setLoading from the store

    useEffect(() => {
        const inWatchlist = watchlist.some(w => w.contractAddress === tokenAddress);
        setIsInWatchlist(inWatchlist);
    }, [watchlist, tokenAddress]);

    useEffect(() => {
        if (!logoLoading && !logoError) {
            setLoading(false);
        }
    }, [logoLoading, logoError, setLoading]);

    const handleWatchlistToggle = () => {
        if (isInWatchlist) {
            removeFromWatchlist(tokenAddress);
        } else {
            if (token.data && token.data.length > 0 && token.data[0]?.attributes?.name) addToWatchlist({ name: token.data[0].attributes.name, contractAddress: tokenAddress, type: 'token' });
        }
        setIsInWatchlist(!isInWatchlist);
    };

    return (
        <div className='flex flex-col items-stretch justify-stretch lg:flex-row gap-4 w-full'>
            <Card className="w-full flex-1">
                <CardContent>
                    <div className="pt-6 flex flex-col  md:flex-row items-stretch justify-between h-full">
                        <div className="left flex flex-col gap-5">
                            <div className="top flex flex-col md:flex-row items-center justify-start gap-5">
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
                                                <Button size='icon' variant='outline' onClick={handleWatchlistToggle}>
                                                    {isInWatchlist ? <FaStar /> : <StarIcon />}
                                                </Button>
                                            </div>
                                            <div className='flex items-center justify-start gap-1'>
                                                <div className='flex items-center justify-start gap-1 mr-4'>
                                                    <KeyValue
                                                        title="chain"
                                                        value={token!.data![0].id.split('_')[0]}
                                                    />
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
                                {/* ... other content */}
                            </div>
                        </div>
                        <div className='right flex flex-col items-start justify-between gap-2'>
                            <div className='flex flex-col items-start justify-center gap-2'>
                                {token?.data?.[0]?.attributes?.base_token_price_usd != undefined ? (
                                    <div className='flex gap-3 items-end justify-center'>
                                        <PriceFormatter dollarSign className='text-2xl mt-2 font-bold' value={token!.data![0].attributes!.base_token_price_usd!} />
                                        <PriceChange token={token} />
                                    </div>
                                ) : (
                                    <p>No price available</p>
                                )}
                                <BuySellTaxes token={token} />
                            </div>
                        </div>
                    </div>
                    <div className='flex items-start justify-between mt-6'>
                        <Renounce
                            active={token.FunctionCallsData?.renounceOwnership?.status === "renounced"}
                            text={token.FunctionCallsData?.renounceOwnership?.Date !== undefined
                                ? `Contract was Renounced at ${token.FunctionCallsData?.renounceOwnership?.Date}`
                                : `Contract is not Renounced`}
                            status={token?.ScoreData?.status || ''}
                        />
                        <Button variant='outline' className='hidden md:flex'>
                            <span className='mr-2'>
                                Security Checker
                            </span>
                            <CiLock />
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <Card className="w-full flex-1">
                <CardHeader>
                    <CardTitle>
                        Overview
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col-reverse items-center md:flex-row md:items-start justify-between w-full h-full gap-4">
                    <div className='right flex flex-col gap-2'>
                        {
                            token.data != undefined &&
                            token.data[0]?.attributes?.pool_created_at != undefined &&
                            <KeyValue
                                title="Age"
                                value={dayjs().to(token.data[0].attributes?.pool_created_at)}
                            />
                        }
                        <Liquidity token={token} />
                        <HolderInterest token={token} />
                    </div>
                    <div className='left '>
                        {
                            token.ScoreData?.totalScore != undefined &&
                            <CustomPieChart title="Total Score" totalScore={token.ScoreData.totalScore} maxScore={1600} />
                        }
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function PriceChange({ token }: { token: IToken }) {
    return (
        token?.data && token?.data[0]?.attributes?.price_change_percentage?.h24 != undefined ? (
            <div>
                <div className='hidden md:block'>
                    <KeyValue
                        title="24hr Change"
                        value={`${token!.data![0].attributes!.price_change_percentage!.h24!}%`}
                        variant={+token!.data![0].attributes!.price_change_percentage!.h24! > 0 ? "good" : "bad"}
                    />
                </div>
                <div className='block md:hidden'>
                    <KeyValue
                        title=""
                        value={`${token!.data![0].attributes!.price_change_percentage!.h24!}%`}
                        variant={+token!.data![0].attributes!.price_change_percentage!.h24! > 0 ? "good" : "bad"}
                    />
                </div>
            </div>
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
            <div>
                <KeyValue
                    title="Holder interest"
                    value={token?.BalancesData?.numberOfAddresses}
                    variant={token!.BalancesData!.numberOfAddresses! > 10 ? "good" : "bad"}
                />
                <Progress className='mt-3' value={token!.BalancesData!.numberOfAddresses!} />
            </div>
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
