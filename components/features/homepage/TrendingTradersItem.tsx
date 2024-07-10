// TrendingTradersItem.jsx
import React from 'react';
import { AvatarPlaceholder } from '@/components/ui/avatar';
import Copy from '@/components/ui/copy';
import { Separator } from '@/components/ui/separator';
import { FaSackDollar } from 'react-icons/fa6';
import { RiMedal2Fill } from 'react-icons/ri';
import { Progress } from '@/components/ui/progress';
import { KeyValue } from '@/components/ui/key-value';
import { minifyContract } from '@/utils/truncate';
import { separate3digits } from '@/utils/numbers';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { IWallet } from '@/types/Wallet.type';

interface Props {
    wallet: IWallet
    index: number
    total: number
}

const TrendingTradersItem = ({ wallet, index, total }: Props) => {
    const router = useRouter();

    return (
        <React.Fragment key={wallet.walletAddress}>
            <div
                className="flex items-start justify-between hover:bg-muted/50 rounded-md hover:cursor-pointer py-1"
                onClick={() => router.push(`/wallet/${wallet.walletAddress}`)}
            >
                <div className='flex items-center justify-start gap-5'>
                    <AvatarPlaceholder />
                    <div className="flex flex-col items-start justify-center gap-0">
                        <Copy
                            className="text-muted-foreground text-sm"
                            href={`/wallet/${wallet.walletAddress}`}
                            text={minifyContract(wallet.walletAddress)}
                            value={wallet.walletAddress}
                        />
                        <div className='flex items-center justify-start gap-2'>
                            <span className='text-muted-foreground text-sm'>
                                <FaSackDollar />
                            </span>
                            <span
                                className={clsx(
                                    'text-base-content text-sm whitespace-nowrap leading-none',
                                    wallet.netProfit > 0 ? 'text-success' : 'text-red-300'
                                )}
                            >
                                {separate3digits(wallet.netProfit.toFixed(0))}
                            </span>
                        </div>
                    </div>
                </div>
                <div>
                    <KeyValue
                        title='Winrate'
                        titleIcon={<RiMedal2Fill />}
                        className='text-sm'
                        value={`${Math.ceil((wallet.winRate / 100) * 100)}%`}
                        variant='default' />
                    <Progress className='mt-2' value={+wallet.winRate} />
                </div>
            </div>
        </React.Fragment>
    );
};

export default TrendingTradersItem;
