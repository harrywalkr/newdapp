import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Copy from '@/components/ui/copy';
import { ImageType } from '@/types/Image.type';
import { TokenType } from '@/types/token.type';
import PriceFormatter from '@/utils/PriceFormatter';
import { formatCash } from '@/utils/numbers';
import { minifyContract, minifyTokenName } from '@/utils/truncate';
import { StarIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';
import Image from 'next/image';
import { IoEarth } from 'react-icons/io5';
import { RiTwitterXFill } from 'react-icons/ri';
import renderConditionalComponent from '@/utils/RenderConditionalComponent';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

interface Props {
    token: TokenType,
    logo: ImageType
}

export default function TokenOverview({ token, logo }: Props) {
    return (
        <Card className="w-full">
            <CardContent className="pt-6 flex items-stretch justify-between h-full">
                <div className="left flex flex-col gap-5">
                    <div className="top flex items-center justify-start gap-5">
                        {renderConditionalComponent(logo, {
                            trueValueComponent: (
                                <Image
                                    width={60}
                                    height={60}
                                    className='rounded-full'
                                    src={logo.imageUrl}
                                    alt={token?.data?.[0]?.attributes?.name || ''}
                                />
                            ),
                            falseValueComponent: (
                                <div className="flex justify-center items-center w-15 h-15 font-bold text-3xl border rounded-full">
                                    {token?.data?.[0]?.attributes?.name?.charAt(0) || "N/A"}
                                </div>
                            )
                        })}
                        <div className='flex flex-col items-start justify-center gap-2'>
                            {renderConditionalComponent(token?.data?.[0]?.attributes?.name, {
                                trueValueComponent: (
                                    <>
                                        <h1 className="text-base m-0 p-0">
                                            {minifyTokenName(token.data[0].attributes.name)}
                                        </h1>
                                        <Copy value={token?.data[0]?.id?.split("_")[1]} text={minifyContract(
                                            token?.data[0]?.id.split("_")[1]
                                        )}
                                            className='text-sm'
                                        />
                                    </>
                                ),
                                falseValueComponent: <p>No token name :(</p>
                            })}
                        </div>
                    </div>
                    <div className="bottom flex flex-col gap-4">
                        {renderConditionalComponent(token?.data?.[0]?.attributes, {
                            trueValueComponent: (
                                <>
                                    <PriceChange token={token} />
                                    <Liquidity token={token} />
                                    <BuySellTaxes token={token} />
                                    <HolderInterest token={token} />
                                </>
                            ),
                            falseValueComponent: <p>Data is not available :(</p>
                        })}
                    </div>
                </div>
                <div className='right flex flex-col justify-between'>
                    <div className="top flex flex-col items-end justify-center gap-2">
                        <Button size='icon' variant='outline'>
                            <StarIcon />
                        </Button>
                        <Button size='icon' variant='ghost'>
                            <IoEarth />
                        </Button>
                        <Button size='icon' variant='ghost'>
                            <RiTwitterXFill />
                        </Button>
                    </div>
                    <div className='flex flex-col items-end justify-end gap-3 mt-2'>
                        {renderConditionalComponent(token?.data?.[0]?.attributes?.base_token_price_usd, {
                            trueValueComponent: (
                                <PriceFormatter dollarSign value={token.data[0]?.attributes?.base_token_price_usd} />
                            ),
                            falseValueComponent: <p>No price available</p>
                        })}
                        <Timestamp token={token} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function PriceChange({ token }) {
    return renderConditionalComponent(token?.data[0]?.attributes?.price_change_percentage?.h24, {
        trueValueComponent: (
            <div className='whitespace-nowrap'>
                {`24hr Change: `}
                <h2
                    className={clsx('text-sm inline text-center',
                        +token.data[0]?.attributes.price_change_percentage.h24 > 0
                            ? " text-green-500"
                            : " text-red-500"
                    )}
                >
                    {`${token?.data[0]?.attributes?.price_change_percentage?.h24}%`}
                </h2>
            </div>
        ),
        falseValueComponent: <p>No 24hr change data</p>
    });
}

function Liquidity({ token }) {
    return renderConditionalComponent(token?.data[0]?.attributes?.reserve_in_usd, {
        trueValueComponent: (
            <div className='whitespace-nowrap'>
                {`Liquidity: `}
                <h2 className='text-sm inline text-center text-muted-foreground'>
                    ${formatCash(+token.data[0].attributes.reserve_in_usd)}
                </h2>
            </div>
        ),
        falseValueComponent: <p>No liquidity data</p>
    });
}

function BuySellTaxes({ token }) {
    // Implementation similar to PriceChange using renderConditionalComponent
    return (
        <div className='flex items-center justify-start gap-2'>
            {renderConditionalComponent(token.SecurityData?.tokenSecurity?.details?.buy_tax, {
                trueValueComponent: (
                    <div className='whitespace-nowrap'>
                        {`Buy tax: `}
                        <h2 className='text-sm inline text-center text-green-500'>
                            {token.SecurityData?.tokenSecurity?.details?.buy_tax * 100}%
                        </h2>
                    </div>
                ),
                falseValueComponent: <p>No buy tax data</p>
            })}
            {renderConditionalComponent(token.SecurityData?.tokenSecurity?.details?.sell_tax, {
                trueValueComponent: (
                    <div className='whitespace-nowrap'>
                        {`Sell tax: `}
                        <h2 className='text-sm inline text-center text-red-500'>
                            {token.SecurityData?.tokenSecurity?.details?.sell_tax * 100}%
                        </h2>
                    </div>
                ),
                falseValueComponent: <p>No sell tax data</p>
            })}
        </div>
    );
}

function HolderInterest({ token }) {
    return renderConditionalComponent(token?.BalancesData?.numberOfAddresses, {
        trueValueComponent: (
            <div className='whitespace-nowrap'>
                {`Holder interest: `}
                <h2 className={clsx('text-sm inline text-center',
                    token?.BalancesData?.numberOfAddresses > 10 ? "text-green-500" : "text-red-500"
                )}>
                    {token?.BalancesData?.numberOfAddresses}
                </h2>
            </div>
        ),
        falseValueComponent: <p>No holder interest data</p>
    });
}

function Timestamp({ token }) {
    return renderConditionalComponent(token?.timestamp, {
        trueValueComponent: (
            <h3 className="bottom whitespace-nowrap text-muted-foreground text-sm">
                {dayjs().to(token.timestamp)}
            </h3>
        ),
        falseValueComponent: <p>No timestamp available</p>
    });
}
