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

    if (walletSwapsLoading || imagesLoading) return <div>Loading...</div>;
    if (walletSwapsError || imagesError) return <div>Error loading data</div>;

    return (
        <div className="wallet-portfolio mt-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="balance-display">
                    <span className="text-lg font-bold">Total Balance: ${formatCash(walletSummary.CurrentBalance!)}</span>
                    <Pie data={totalScore} width={200} height={200} />
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-lg font-bold">Partially Closed</span>
                    <div className="flex flex-col gap-2">
                        {walletSwaps!.partiallyClosedPositions.slice(0, 3).map((pcp, idx) => (
                            <ClosedTokenCard key={idx} images={images!} token={pcp} />
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-lg font-bold">Open</span>
                    <div className="flex flex-col gap-2">
                        {walletSwaps!.notClosedPositions.slice(0, 3).map((pcp, idx) => (
                            <OpenTokenCard key={idx} images={images!} token={pcp} />
                        ))}
                    </div>
                </div>
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
        <div className="bg-base-200 p-2 pr-4 rounded-xl">
            <div className="flex items-center gap-2">
                <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                        {image ? (
                            <Image
                                width={48}
                                height={48}
                                src={image}
                                alt={token.tokenName}
                                className="rounded-full"
                            />
                        ) : (
                            <div className="flex justify-center items-center w-12 h-12 font-bold text-base border border-base-content rounded-full">
                                {token.tokenName.charAt(0)}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="font-medium">{minifyTokenName(token.tokenName)}</span>
                    <div className="flex items-center gap-2">
                        <span className="opacity-40">{minifyContract(token['Currency Address'])}</span>
                        <Copy value={token['Currency Address']} />
                    </div>
                </div>
                <div className="font-medium ml-auto">
                    ${separate3digits(token['Buy Amount (USD)'].toFixed(2))}
                </div>
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
        <div className="bg-base-200 p-2 pr-4 rounded-xl">
            <div className="flex items-center gap-2">
                <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                        {image ? (
                            <Image
                                width={48}
                                height={48}
                                src={image}
                                alt={token[0].tokenName}
                                className="rounded-full"
                            />
                        ) : (
                            <div className="flex justify-center items-center w-12 h-12 font-bold text-base border border-base-content rounded-full">
                                {token[0]?.tokenName != undefined && token[0].tokenName.charAt(0)}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="font-medium">{minifyTokenName(token[0].tokenName)}</span>
                    <div className="flex items-center gap-2">
                        <span className="opacity-40">{minifyContract(token[1]['Currency Address'])}</span>
                        <Copy text={token[1]['Currency Address']} />
                    </div>
                </div>
                <div className="font-medium ml-auto">
                    ${separate3digits(token[1]['Buy Amount (USD)'].toFixed(2))}
                </div>
            </div>
        </div>
    );
};