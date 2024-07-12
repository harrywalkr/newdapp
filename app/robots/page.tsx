import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import React from 'react'
import { FaTelegramPlane } from "react-icons/fa";


export default function Bots() {
    return (
        <div>
            <h1 className='flex items-center justify-center gap-1 text-2xl font-semibold'>
                <FaTelegramPlane className='text-blue-400 text-3xl' />
                <span>Dextrading BOTS for DEX Traders</span>
            </h1>
            <div className="grid grid-cols-6 grid-rows-2 gap-4 mt-6">
                <div className="col-span-2">
                    <Card>
                        <CardContent className='pt-6'>
                            <div className='flex flex-col items-center justify-center gap-2'>
                                <Image
                                    src='/dextrading-logo.png'
                                    alt='Dextrading logo'
                                    width={50}
                                    height={50}
                                />
                                <span>Screener BOT</span>
                            </div>
                            <p className='text-xs text-muted-foreground mt-4'>
                                The Crypto Screener Bot uses AI to provide real-time
                                analysis and customizable filters, helping traders identify
                                profitable opportunities in the cryptocurrency market with
                                features like price alerts and a user-friendly dashboard.
                            </p>
                            <div className='flex items-center justify-center'>

                                <Button className='mt-4 flex' variant='outline'>Use Screener BOT</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-span-2 col-start-3">
                    <Card>
                        <CardContent className='pt-6'>
                            <div className='flex flex-col items-center justify-center gap-2'>
                                <Image
                                    src='/dextrading-logo.png'
                                    alt='Dextrading logo'
                                    width={50}
                                    height={50}
                                />
                                <span>Screener BOT</span>
                            </div>
                            <p className='text-xs text-muted-foreground mt-4'>
                                The Crypto Screener Bot uses AI to provide real-time
                                analysis and customizable filters, helping traders identify
                                profitable opportunities in the cryptocurrency market with
                                features like price alerts and a user-friendly dashboard.
                            </p>
                            <div className='flex items-center justify-center'>
                                <Button className='mt-4 flex' variant='outline'>Use Screener BOT</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-span-2 col-start-5">
                    <Card>
                        <CardContent className='pt-6'>
                            <div className='flex flex-col items-center justify-center gap-2'>
                                <Image
                                    src='/dextrading-logo.png'
                                    alt='Dextrading logo'
                                    width={50}
                                    height={50}
                                />
                                <span>Screener BOT</span>
                            </div>
                            <p className='text-xs text-muted-foreground mt-4'>
                                The Crypto Screener Bot uses AI to provide real-time
                                analysis and customizable filters, helping traders identify
                                profitable opportunities in the cryptocurrency market with
                                features like price alerts and a user-friendly dashboard.
                            </p>
                            <div className='flex items-center justify-center'>
                                <Button className='mt-4 flex' variant='outline'>Use Screener BOT</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-span-3 row-start-2">
                    <Card>
                        <CardContent className='pt-6 flex gap-5'>
                            <div className='flex flex-col items-center justify-center gap-2 w-96'>
                                <Image
                                    src='/dextrading-logo.png'
                                    alt='Dextrading logo'
                                    width={100}
                                    height={100}
                                />
                            </div>
                            <div>
                                <h1>Portfolio BOT</h1>
                                <p className='text-xs text-muted-foreground mt-2'>
                                    The Crypto Portfolio Bot helps traders manage and optimize
                                    their cryptocurrency investments with real-time tracking,
                                    performance analytics, and diversification insights.
                                    Its features include portfolio monitoring, risk assessment,
                                    and customizable alerts, providing a user-friendly
                                    interface to make informed investment decisions.
                                </p>
                                <div className='flex items-center justify-end'>
                                    <Button className='mt-4 flex' variant='outline'>Use Screener BOT</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-span-3 col-start-4 row-start-2">
                    <Card>
                        <CardContent className='pt-6 flex gap-5'>
                            <div className='flex flex-col items-center justify-center gap-2 w-96'>
                                <Image
                                    src='/dextrading-logo.png'
                                    alt='Dextrading logo'
                                    width={100}
                                    height={100}
                                />
                            </div>
                            <div>
                                <h1>Portfolio BOT</h1>
                                <p className='text-xs text-muted-foreground mt-2'>
                                    The Crypto Portfolio Bot helps traders manage and optimize
                                    their cryptocurrency investments with real-time tracking,
                                    performance analytics, and diversification insights.
                                    Its features include portfolio monitoring, risk assessment,
                                    and customizable alerts, providing a user-friendly
                                    interface to make informed investment decisions.
                                </p>
                                <div className='flex items-center justify-end'>
                                    <Button className='mt-4 flex' variant='outline'>Use Screener BOT</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
