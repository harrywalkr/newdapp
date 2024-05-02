import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Copy from '@/components/ui/copy'
import { ImageType } from '@/types/Image.type'
import { TokenType } from '@/types/token.type'
import { formatCash } from '@/utils/numbers'
import { minifyContract, minifyTokenName } from '@/utils/truncate'
import { StarFilledIcon, StarIcon } from '@radix-ui/react-icons'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { IoEarth } from 'react-icons/io5'
import { RiTwitterXFill } from 'react-icons/ri'


interface Props {
    token: TokenType,
    logo: ImageType,
    tokenAddress: string
}

// FIXME: Add hover card tooltip for more info and redirect to blog
// FIXME: Use KeyValue component

export default function TokenOverview({ token, logo }: Props) {
    return (
        <Card className="w-full">
            <CardContent className="pt-6 flex items-stretch justify-between h-full">
                <div className="left flex flex-col gap-4">
                    <div className="top flex items-start justify-start gap-5">
                        {logo ? (
                            <Image
                                width={60}
                                height={60}
                                className='rounded-full'
                                src={logo.imageUrl}
                                alt={token?.data && token?.data.length > 0 && token?.data[0].attributes?.name ? token?.data[0].attributes.name : ''}
                            />
                        ) : (
                            <>
                                {token?.data && token?.data.length > 0 && token?.data[0]?.attributes?.name ?
                                    <div className="flex justify-center items-center w-[60] h-[60] font-bold text-3xl border rounded-full">
                                        {token?.data[0].attributes.name.charAt(0)}
                                    </div>
                                    : <div className="flex justify-center items-center w-[60] h-[60] font-bold text-3xl border rounded-full" />
                                }
                            </>

                        )}
                        <div className='flex flex-col items-start justify-center gap-2'>
                            {
                                token?.data && token?.data.length > 0 ? <>

                                    {
                                        token?.data[0]?.attributes?.name ?
                                            <h1 className="text-base m-0 p-0">
                                                {minifyTokenName(token.data[0].attributes.name)}
                                            </h1> : <h1 className="text-base">
                                                no token name :(
                                            </h1>
                                    }
                                    {
                                        token?.data[0]?.id ?
                                            <Copy value={token?.data[0]?.id.split("_")[1]} text={minifyContract(
                                                token?.data[0]?.id.split("_")[1]
                                            )}
                                                className='text-sm'
                                            />
                                            : <h1 className="text-sm">
                                                no token address :(
                                            </h1 >
                                    }

                                </> : <p>
                                    Data is not available :(
                                </p>}
                        </div>
                    </div>
                    <div className="bottom flex flex-col gap-3">{
                        token?.data && token?.data.length > 0 ? <>
                            {
                                token?.data[0]?.attributes?.price_change_percentage?.h24 &&
                                <div className='whitespace-nowrap'>
                                    {`24hr Change : `}
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
                            }
                            {
                                token?.data[0]?.attributes?.reserve_in_usd &&
                                <div className='whitespace-nowrap'>
                                    {`Liquidity : `}
                                    <h2 className='text-sm inline text-center text-muted-foreground'>
                                        ${formatCash(+token.data[0].attributes.reserve_in_usd)}
                                    </h2>
                                </div>
                            }
                            {
                                token.SecurityData?.tokenSecurity?.details?.buy_tax &&
                                <div className='whitespace-nowrap'>
                                    {`Buy tax : `}
                                    <h2
                                        className={clsx('text-sm inline text-center',
                                            +token.SecurityData?.tokenSecurity?.details?.buy_tax > 0
                                                ? " text-green-500"
                                                : " text-red-500"
                                        )}
                                    >
                                        {+token.SecurityData?.tokenSecurity?.details.buy_tax * 100}%
                                    </h2>
                                </div>
                            }
                            {
                                // FIXME: what condition should sell tax be what color?
                                token.SecurityData?.tokenSecurity?.details?.sell_tax &&
                                <div className='whitespace-nowrap'>
                                    {`Sell tax : `}
                                    <h2
                                        className={clsx('text-sm inline text-center',
                                            +token.SecurityData?.tokenSecurity?.details?.sell_tax > 0
                                                ? " text-green-500"
                                                : " text-red-500"
                                        )}
                                    >
                                        {+token.SecurityData?.tokenSecurity?.details?.sell_tax * 100}%
                                    </h2>
                                </div>
                            }
                            {
                                token?.BalancesData?.numberOfAddresses != undefined &&
                                <div className='whitespace-nowrap'>
                                    {`Holder interest : `}
                                    <h2
                                        className={clsx('text-sm inline text-center',
                                            token?.BalancesData?.numberOfAddresses > 10
                                                ? " text-green-500"
                                                : " text-red-500"
                                        )}
                                    >
                                        {token?.BalancesData?.numberOfAddresses}
                                    </h2>
                                </div>
                            }
                        </> : <p>
                            Data is not available :(
                        </p>}
                    </div>
                </div>

                <div className='right flex flex-col justify-between' >
                    <div className="top flex flex-col items-end justify-center gap-2">
                        <Button size='icon' variant='outline' >
                            <StarIcon />
                        </Button>
                        <Button size='icon' variant='ghost' >
                            <IoEarth />
                        </Button>
                        <Button size='icon' variant='ghost' >
                            <RiTwitterXFill />
                        </Button>
                    </div>
                    <h3 className="bottom whitespace-nowrap text-muted-foreground text-sm">
                        {/* FIXME: timestamp type weird from backend :| */}
                        {
                            token?.data && token?.data.length > 0 && token?.timestamp &&
                            token?.timestamp.toString()
                        }
                    </h3>
                </div>

            </CardContent>
        </Card>
    )
}
