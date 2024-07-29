
import Insight from "@/components/features/homepage/insight/Insight";
import HomepageTabs from "@/components/features/homepage/homepage-tabs/Homepage-tabs";
import { getImages } from "@/services/http/image.http";
import { getTopNFTs } from "@/services/http/nft.http";
import Link from "next/link";

export default async function Home() {
    try {
        const images = await getImages();
        const nfts = await getTopNFTs();

        return (
            <div className="w-full">
                <Insight />
                <HomepageTabs images={images} nfts={nfts} />
                <Link target="_blank" href='https://app.galxe.com/quest/RxeSqDQ5wdkTTK8XF7wHXD/GC9TLtkWJ5' className="fixed flex items-center justify-center hover:underline w-full py-2 font-semibold text-center text-lg md:text-xl bottom-0 left-0 right-0 bg-[#d9308a] text-white dark:text-black">
                    Don&apos;t miss out on DexTrading anniversary Discounts!!
                </Link>
            </div>
        );
    } catch (error) {
        return <div>Failed to load data, please try again.</div>;
    }
}

