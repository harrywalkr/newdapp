import NFT from "@/components/features/homepage/NFT";
import { getImages } from "@/services/http/image.http";
import { TopLatestHotPairs } from "@/components/features/homepage/TopLatestHotPairs";
import { getTopNFTs } from "@/services/http/nft.http";
import Insight from "@/components/features/homepage/Insight";
import Wallets from "@/components/features/homepage/wallets-table";
import HomepageTabs from "@/components/features/homepage/Homepage-tabs";
// import HomepageTabs from "@/components/features/homepage/Homepage-tabs";

export const revalidate = 0;

export default async function Home() {
  // const images = await getImages();
  // const nfts = await getTopNFTs();

  return (
    <div className="w-full">
      <Insight />
      <HomepageTabs />
      {/* <TopLatestHotPairs images={images.imageUrls} />
      <Wallets />
      <NFT NFTs={nfts} /> */}
    </div>
  );
}
