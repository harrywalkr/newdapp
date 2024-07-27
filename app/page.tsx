
import Insight from "@/components/features/homepage/insight/Insight";
import HomepageTabs from "@/components/features/homepage/homepage-tabs/Homepage-tabs";
import { getImages } from "@/services/http/image.http";
import { getTopNFTs } from "@/services/http/nft.http";
// import {getImages} from '@/app/services/http/image.http'
// import {getTopNFTs} from '@/app/services/http/nft.http'

export default async function Home() {
    try {
        const images = await getImages();
        const nfts = await getTopNFTs();

        return (
            <div className="w-full">
                <Insight />
                <HomepageTabs images={images} nfts={nfts} />
                <div className="fixed flex items-center justify-center w-full py-2 font-semibold text-center text-lg md:text-xl bottom-0 left-0 right-0 bg-red-500">
                    Don&apos;t miss out on DexTrading anniversary Discounts!!
                </div>
            </div>
        );
    } catch (error) {
        return <div>Failed to load data, please try again.</div>;
    }
}
