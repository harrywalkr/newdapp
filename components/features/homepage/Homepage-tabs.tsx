'use client'
import { TopLatestHotPairs } from './TopLatestHotPairs'
import Wallets from './wallets-table'
import NFT from './NFT'
import { useQuery } from '@tanstack/react-query';
import { getImages } from '@/services/http/image.http';
import Loading from '@/components/layout/Loading';
import { getTopNFTs } from '@/services/http/nft.http';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


export default function HomepageTabs() {

    const { isLoading: isImagesLoading, error: imageErros, data: images } = useQuery({
        queryKey: ['images'],
        queryFn: () => getImages().then((data) => data.imageUrls),
    });

    const { isLoading: isNtfLoading, error: nftErros, data: nfts } = useQuery({
        queryKey: ['nfts'],
        queryFn: () => getTopNFTs(),
    });

    if (isImagesLoading || isNtfLoading) return <Loading times={10} />
    if (imageErros || nftErros) return <div>Failed to load data, please try again.</div>;

    return (
        <Tabs defaultValue="TopLatestHotPairs" className="w-full mt-7">
            <TabsList className='bg-transparent' >
                <TabsTrigger value="TopLatestHotPairs" className="text-lg">Top Tokens</TabsTrigger>
                <TabsTrigger value="Wallets" className="text-lg">Top Wallets</TabsTrigger>
                <TabsTrigger value="NFTs" className="text-lg">Trending NFTs</TabsTrigger>
            </TabsList>
            <TabsContent value="TopLatestHotPairs" className='mt-5'>
                {images && <TopLatestHotPairs images={images} />}
            </TabsContent>
            <TabsContent value="Wallets" className='mt-5'>
                <Wallets />
            </TabsContent>
            <TabsContent value="NFTs" className='mt-5'>
                {nfts && <NFT NFTs={nfts} />}
            </TabsContent>
        </Tabs>
    )
}
