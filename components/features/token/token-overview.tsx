import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Copy from '@/components/ui/copy'
import { ImageType } from '@/types/Image.type'
import { Token } from '@/types/token.type'
import { minifyContract, minifyTokenName } from '@/utils/truncate'
import { StarFilledIcon, StarIcon } from '@radix-ui/react-icons'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { IoEarth } from 'react-icons/io5'
import { RiTwitterXFill } from 'react-icons/ri'


interface Props {
    token: Token,
    logo: ImageType
}

export default function TokenOverview({ token, logo }: Props) {

    return (
        <Card className="w-full">
            <CardContent className="pt-6 flex items-start justify-between">
                <div className="left">
                    <div className="top flex items-start justify-start gap-4">
                        {logo ? (
                            <Image
                                width={60}
                                height={60}
                                className='rounded-full'
                                src={logo.imageUrl}
                                alt={token?.data && token?.data[0].attributes?.name ? token?.data[0].attributes.name : ''}
                            />
                        ) : (
                            <>
                                {token?.data && token?.data[0]?.attributes?.name ?
                                    <div className="flex justify-center items-center w-[60] h-[60] font-bold text-3xl border rounded-full">
                                        {token?.data[0].attributes.name.charAt(0)}
                                    </div>
                                    : <div className="flex justify-center items-center w-[60] h-[60] font-bold text-3xl border rounded-full" />
                                }
                            </>

                        )}
                        <div className='flex flex-col items-start justify-center gap-2'>
                            {
                                token?.data ? <>

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
                                    {
                                        token?.data[0]?.attributes?.price_change_percentage?.h24 &&
                                        <div className='whitespace-nowrap'>
                                            {`24hr Change : `}
                                            <h2
                                                className={clsx('text-sm inline text-center',
                                                    +token.data[0]?.attributes.price_change_percentage.h24 > 0
                                                        ? "bg-green-300 text-green-900"
                                                        : "bg-red-300 text-red-900"
                                                )}
                                            >
                                                {`${token?.data[0]?.attributes?.price_change_percentage?.h24}%`}

                                            </h2>
                                        </div>
                                    }
                                </> : <p>
                                    Data is not available :(
                                </p>}
                        </div>
                    </div>
                    <div className="bottom"></div>
                </div>
                <div className="right flex flex-col items-end justify-center gap-4">
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
                    <div className="bottom whitespace-nowrap text-muted-foreground text-sm">
                        {/* FIXME: make it dynamic NOT hardcode */}
                        29m ago
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
