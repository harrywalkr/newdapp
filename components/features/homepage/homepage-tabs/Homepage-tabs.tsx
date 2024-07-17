'use client'
import { TopLatestHotPairs } from './TopLatestHotPairs';
import Wallets from './Wallets';
import NFT from './NFT';
import { useQuery } from '@tanstack/react-query';
import { getImages } from '@/services/http/image.http';
import { getTopNFTs } from '@/services/http/nft.http';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TopHotTokens from './Top-hot-tokens';
import TableLoading from '@/components/layout/Table-loading';
import LatestHotTokens from './latest-hot-tokens';

export default function HomepageTabs() {
    const { isLoading: isImagesLoading, error: imageErrors, data: images } = useQuery({
        queryKey: ['images'],
        queryFn: () => getImages().then((data) => data.imageUrls),
    });

    const { isLoading: isNtfLoading, error: nftErrors, data: nfts } = useQuery({
        queryKey: ['nfts'],
        queryFn: () => getTopNFTs(),
    });

    if (isImagesLoading || isNtfLoading) {
        return (
            <Tabs defaultValue="TopLatestHotPairs" className="w-full mt-7 no-scrollbar">
                <TabsList className="bg-transparent p-0 m-0 w-full overflow-y-scroll flex items-center justify-start">
                    <TabsTrigger value="TopLatestHotPairs" className="text-lg">Top Tokens</TabsTrigger>
                    <TabsTrigger value="Wallets" className="text-lg">Top Wallets</TabsTrigger>
                    <TabsTrigger value="NFTs" className="text-lg">Trending NFTs</TabsTrigger>
                    <TabsTrigger value="TopHotTokens" className="text-lg">Top Hot Tokens</TabsTrigger>
                    <TabsTrigger value="LatestHotTokens" className="text-lg">Latest Hot Tokens</TabsTrigger>
                </TabsList>
                {['TopLatestHotPairs', 'Wallets', 'NFTs', 'TopHotTokens', 'LatestHotTokens'].map(value => (
                    <TabsContent key={value} value={value} className="mt-5">
                        <TableLoading />
                    </TabsContent>
                ))}
            </Tabs>
        );
    }

    if (imageErrors || nftErrors) {
        return <div>Failed to load data, please try again.</div>;
    }

    return (
        <Tabs defaultValue="TopLatestHotPairs" className="w-full mt-7 no-scrollbar">
            <TabsList className="bg-transparent p-0 m-0 w-full overflow-y-scroll flex items-center justify-start">
                <TabsTrigger value="TopLatestHotPairs" className="text-lg">Top Tokens</TabsTrigger>
                <TabsTrigger value="Wallets" className="text-lg">Top Wallets</TabsTrigger>
                <TabsTrigger value="NFTs" className="text-lg">Trending NFTs</TabsTrigger>
                <TabsTrigger value="TopHotTokens" className="text-lg">Top Hot Tokens</TabsTrigger>
                <TabsTrigger value="LatestHotTokens" className="text-lg">Latest Hot Tokens</TabsTrigger>
            </TabsList>
            <TabsContent value="TopLatestHotPairs" className="mt-5">
                {images && <TopLatestHotPairs images={images} />}
            </TabsContent>
            <TabsContent value="Wallets" className="mt-5">
                <Wallets />
            </TabsContent>
            <TabsContent value="NFTs" className="mt-5">
                {nfts && <NFT NFTs={nfts} />}
            </TabsContent>
            <TabsContent value="TopHotTokens" className="mt-5">
                <TopHotTokens />
            </TabsContent>
            <TabsContent value="LatestHotTokens" className="mt-5">
                <LatestHotTokens />
            </TabsContent>
        </Tabs>
    );
}
