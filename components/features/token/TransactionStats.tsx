import { Button } from '@/components/ui/button';
import { IToken } from '@/types/token.type';
import React, { useState } from 'react';
import { IoMdTrendingDown } from 'react-icons/io';
import { IoTrendingUp } from 'react-icons/io5';
import { LuWallet } from 'react-icons/lu';

interface Props {
    token: IToken;
}

const TransactionStats = ({ token }: Props) => {
    const [selectedTime, setSelectedTime] = useState<string>('h1');

    const transactions = token.data && token.data.length > 0 && token.data[0].attributes?.transactions && token.data[0].attributes?.transactions[selectedTime];
    const volumeUSD = token.data && token.data.length > 0 && token.data[0].attributes?.volume_usd && token.data[0].attributes.volume_usd[selectedTime];

    const sells = transactions?.sells || 0;
    const buys = transactions?.buys || 0;
    const totalTrans = sells + buys;

    const sellers = transactions?.sellers || 0;
    const buyers = transactions?.buyers || 0;
    const totalPeople = sellers + buyers;

    const formatCash = (number: number) => {
        return `$${number.toLocaleString()}`;
    };

    return (
        <div className="border w-full border-base-content/50 rounded-md p-2 lg:col-span-3 grid grid-cols-2 lg:grid-cols-3">
            <div className="flex lg:flex-col gap-3 mb-5 lg:mb-0 lg:border-r-2 border-base-content/50 px-8 col-span-2 lg:col-span-1">
                <div className="flex gap-2 items-center w-full">
                    <div
                        className="h-[3px] bg-red-500"
                        style={{
                            width: `${(sells / totalTrans) * 100}%`,
                        }}
                    ></div>
                    {sells > 0 && (
                        <span className="text-sm whitespace-nowrap flex items-center gap-1">
                            <span>{sells} Sells</span>
                            <IoMdTrendingDown className="text-lg text-error/80" />
                        </span>
                    )}
                </div>
                <div className="flex gap-2 items-center w-full">
                    <div
                        className="h-[3px] bg-green-500"
                        style={{
                            width: `${(buys / totalTrans) * 100}%`,
                        }}
                    ></div>
                    {buys > 0 && (
                        <span className="text-sm whitespace-nowrap flex items-center gap-1">
                            <span>{buys} Buys</span>
                            <IoTrendingUp className="text-lg text-success" />
                        </span>
                    )}
                </div>
            </div>
            <div className="hidden lg:flex flex-col gap-3 border-r-2 border-base-content/50 px-8 col-span-2 lg:col-span-1">
                <div className="flex gap-2 items-center">
                    <div
                        className="h-[3px] max-w-[3px] lg:max-w-2xl bg-red-500"
                        style={{
                            width: `${(sells / totalPeople) * 100}%`,
                        }}
                    ></div>
                    {sellers > 0 && (
                        <span className="text-sm whitespace-nowrap flex items-center gap-1">
                            <span>{sellers} Sellers</span>
                            <LuWallet className="text-lg text-error" />
                        </span>
                    )}
                </div>
                <div className="flex gap-2 items-center">
                    <div
                        className="h-[3px] max-w-[3px] lg:max-w-2xl bg-green-500"
                        style={{
                            width: `${(buys / totalPeople) * 100}%`,
                        }}
                    ></div>
                    {buyers > 0 && (
                        <span className="text-sm whitespace-nowrap flex items-center gap-1">
                            <span>{buyers} Buyers</span>
                            <LuWallet className="text-lg text-success" />
                        </span>
                    )}
                </div>
            </div>
            <div className="flex gap-2 max-h-[60px] items-center pl-5 col-span-2 lg:col-span-1">
                <div className='flex items-center justify-center gap-2'>
                    <Button
                        className={`btn btn-ghost text-sm w-20 rounded-md ${selectedTime === 'h24' ? 'bg-muted-foreground' : ''}`}
                        onClick={() => setSelectedTime('h1')}
                    >
                        1h
                    </Button>
                    <Button
                        className={`btn btn-ghost text-sm w-20 rounded-md ${selectedTime === 'h1' ? 'bg-muted-foreground' : ''}`}
                        onClick={() => setSelectedTime('h24')}
                    >
                        24h
                    </Button>
                </div>
                {volumeUSD && (
                    <div className="h-full mx-auto rounded-md px-4 text-lg w-full flex justify-center items-center">
                        <span className="text-center text-white whitespace-nowrap">
                            Volume: {formatCash(+parseFloat(volumeUSD).toFixed(2))}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionStats;
