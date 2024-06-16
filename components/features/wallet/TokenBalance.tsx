'use client'
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { formatCash, separate3digits } from '@/utils/numbers';
import { useQuery } from '@tanstack/react-query';
import { getWalletSwaps } from '@/services/http/wallets.http';
import { WalletSummaryType } from '@/types/wallet-summary.type';
import { getImages } from '@/services/http/image.http';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { minifyTokenName, minifyContract } from '@/utils/truncate';
import Copy from '@/components/ui/copy';
import { ImageType } from '@/types/Image.type';
import WalletPortfolioHistory from './WalletPortfolioHistory';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
    walletAddress: string,
    walletSummary: WalletSummaryType
}


export default function WalletPortfolio({ walletAddress, walletSummary }: Props) {

    const { data: walletSwaps, isLoading: walletSwapsLoading, isError: walletSwapsError } = useQuery(
        {
            queryKey: ['wallet-swaps', walletAddress],
            queryFn: () => getWalletSwaps({ params: { address: walletAddress } }).then(data => data),
        }
    );

    const { data: images, isLoading: imagesLoading, isError: imagesError } = useQuery(
        {
            queryKey: ['images'],
            queryFn: () => getImages().then((data) => data.imageUrls),
        }
    );

    const totalScore = {
        labels: ['Partial Balance', 'Open Balance'],
        datasets: [
            {
                data: [
                    walletSummary.CurrentBalance! - walletSummary.totalPartiallyClosed!,
                    walletSummary.CurrentBalance! - walletSummary.totalNotClosedBalance!,
                ],
                backgroundColor: ['#81D4FA', '#9575CD'],
                borderWidth: 1,
            },
        ],
    };

    if (walletSwapsLoading || imagesLoading) return <div className='w-full flex-1'>Loading...</div>;
    if (walletSwapsError || imagesError) return <div>Error loading data</div>;

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className='border-none'>
                    <CardHeader>
                        <CardTitle>Partially Closed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {walletSwaps!.partiallyClosedPositions.slice(0, 3).map((pcp, idx) => (
                            <ClosedTokenCard key={idx} images={images!} token={pcp} />
                        ))}
                    </CardContent>
                </Card>
                <Card className='border-none'>
                    <CardHeader>
                        <CardTitle>Open</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {walletSwaps!.notClosedPositions.slice(0, 3).map((pcp, idx) => (
                            <OpenTokenCard key={idx} images={images!} token={pcp} />
                        ))}
                    </CardContent>
                </Card>
                <Card className='border-none'>
                    <CardHeader>
                        <CardTitle>Balance Overview</CardTitle>
                    </CardHeader>
                    <CardContent className='flex items-start justify-start gap-2'>
                        <div className='w-60 h-60'>
                            <Pie data={totalScore} height={200} width={200} />
                        </div>
                        <div>
                            <h3>Total Balance: ${formatCash(walletSummary.CurrentBalance!)}</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <WalletPortfolioHistory walletSwaps={walletSwaps!.balance} images={images!} />
        </div>
    );
}


interface PartialTokenCardProps {
    images: ImageType[];
    token: {
        tokenName: string;
        'Currency Address': string;
        'Buy Amount (USD)': number;
    };
}

const ClosedTokenCard: React.FC<PartialTokenCardProps> = ({ images, token }) => {
    const [image, setImage] = useState<string>('');

    useEffect(() => {
        const foundImage = images.find((img) => img.imageUrl.includes(token['Currency Address']));
        if (foundImage) {
            setImage(foundImage.imageUrl);
        }
    }, [images, token['Currency Address']]);

    return (
        <div className="flex items-center gap-4 mb-5">
            <Avatar>
                <AvatarImage src={image} alt={token.tokenName} />
                <AvatarFallback>{token.tokenName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col ">
                <span className="font-medium">{minifyTokenName(token.tokenName)}</span>
                <Copy className='text-muted-foreground' text={minifyContract(token['Currency Address'])} value={token['Currency Address']} />
            </div>
            <div className="font-medium ml-auto">
                ${separate3digits(token['Buy Amount (USD)'].toFixed(2))}
            </div>
        </div>
    );
};



interface OpenTokenCardProps {
    images: ImageType[];
    token: any[];
}

const OpenTokenCard: React.FC<OpenTokenCardProps> = ({ images, token }) => {
    const [image, setImage] = useState<string>('');

    useEffect(() => {
        if (image) return;
        const foundImage = images.find((img) => img.imageUrl.includes(token[1]['Currency Address']));
        if (foundImage) {
            setImage(foundImage.imageUrl);
        }
    }, [images, token, image]);

    return (
        <div className="flex items-center gap-4 mb-5">
            <Avatar>
                <AvatarImage src={image} alt={token[0]?.tokenName} />
                <AvatarFallback>{token[0]?.tokenName != undefined && token[0].tokenName.charAt(0)}</AvatarFallback>
            </Avatar>
            <Copy className='text-muted-foreground' text={minifyContract(token[1]['Currency Address'])} value={token[1]['Currency Address']} />
            <div className="font-medium ml-auto">
                ${separate3digits(token[1]['Buy Amount (USD)'].toFixed(2))}
            </div>
        </div>
    );
};