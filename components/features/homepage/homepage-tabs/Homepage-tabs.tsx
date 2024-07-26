'use client';
import  { FC } from 'react';
import { TopLatestHotPairs } from './TopLatestHotPairs';
import { NFTTradeReportType } from '@/types/nft.type';
import Wallets from './Wallets';
import NFT from './NFT';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TopHotTokens from './Top-hot-tokens';
import TableLoading from '@/components/layout/Table-loading';
import LatestHotTokens from './latest-hot-tokens';
import { ImageType } from '@/types/Image.type';

 interface HomepageTabsProps {
    images:  ImageType[];
    nfts:  NFTTradeReportType;
}
const HomepageTabs: FC<HomepageTabsProps> = ({ images, nfts }) => {
    if (!images || !nfts) {
        return (
            <Tabs defaultValue="TopLatestHotPairs" className="w-full mt-7 no-scrollbar">
                <TabsList className="bg-transparent p-0 m-0 w-full overflow-y-scroll flex items-center justify-start">
                    <TabsTrigger value="TopLatestHotPairs" className="text-[17px] md:text-lg">Top Tokens</TabsTrigger>
                    <TabsTrigger value="Wallets" className="text-[17px] md:text-lg">Top Wallets</TabsTrigger>
                    <TabsTrigger value="NFTs" className="text-[17px] md:text-lg">Trending NFTs</TabsTrigger>
                    <TabsTrigger value="TopHotTokens" className="text-[17px] md:text-lg">Top Hot Tokens</TabsTrigger>
                    <TabsTrigger value="LatestHotTokens" className="text-[17px] md:text-lg">Latest Hot Tokens</TabsTrigger>
                </TabsList>
                {['TopLatestHotPairs', 'Wallets', 'NFTs', 'TopHotTokens', 'LatestHotTokens'].map(value => (
                    <TabsContent key={value} value={value} className="mt-5">
                        <TableLoading />
                    </TabsContent>
                ))}
            </Tabs>
        );
    }

    return (
        <Tabs defaultValue="TopLatestHotPairs" className="w-full mt-7 no-scrollbar">
            <TabsList className="bg-transparent p-0 m-0 w-full overflow-y-scroll flex items-center justify-start">
                <TabsTrigger value="TopLatestHotPairs" className="text-[17px] md:text-lg">Top Tokens</TabsTrigger>
                <TabsTrigger value="Wallets" className="text-[17px] md:text-lg">Top Wallets</TabsTrigger>
                <TabsTrigger value="NFTs" className="text-[17px] md:text-lg">Trending NFTs</TabsTrigger>
                <TabsTrigger value="TopHotTokens" className="text-[17px] md:text-lg">Top Hot Tokens</TabsTrigger>
                <TabsTrigger value="LatestHotTokens" className="text-[17px] md:text-lg">Latest Hot Tokens</TabsTrigger>
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

export default HomepageTabs;