import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Copy from '@/components/ui/copy';
import { TokenChain } from '@/store/tokenChains';
import { Daum } from '@/types/token.type';
import { minifyContract } from '@/utils/truncate';
import Link from 'next/link';
import React from 'react';

interface Props {
    token: Daum
    selectedChain: TokenChain
}

const TrendItem = ({ token, selectedChain }: Props) => (
    <div className="header relative flex items-start justify-start gap-6 mb-4">
        <Avatar className="h-14 w-14">
            <AvatarImage src={token.logo_url} alt="token logo" />
            <AvatarFallback>{token.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="content flex flex-col items-start justify-between">
            <div className="token flex flex-col items-start justify-start gap-2">
                <Link
                    className="font-medium hover:underline"
                    href={`/tokens/${selectedChain.symbol.toLowerCase()}/${token.address}`}
                >
                    {minifyContract(token.name)}
                </Link>
                <Copy
                    href={`/tokens/${selectedChain.symbol.toLowerCase()}/${token.address}`}
                    className="text-sm !text-muted-foreground link"
                    value={token.address}
                    text={minifyContract(token.address)}
                />
            </div>
        </div>
    </div>
);

export default TrendItem;
