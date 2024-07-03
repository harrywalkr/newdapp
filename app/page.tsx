import NFT from "@/components/features/homepage/NFT";
import TrendPairs from "@/components/features/homepage/Trend-pair";
import Wallet from "@/components/features/homepage/Wallet";
import { getImages } from "@/services/http/image.http";
import { getWallets } from "@/services/http/wallets.http";
import { TopLatestHotPairs } from "@/components/features/homepage/TopLatestHotPairs";
import { getTopNFTs } from "@/services/http/nft.http";
import Insight from "@/components/features/homepage/Insight";
import Wallets from "@/components/features/homepage/wallets-table";

export const revalidate = 0;

export default async function Home() {
  const images = await getImages();
  const wallets = await getWallets({ params: { network: 'eth' } });
  const nfts = await getTopNFTs();

  return (
    <div className="flex flex-col w-full gap-10 md:gap-10 lg:gap-14">
      <Insight />
      <TrendPairs />
      <TopLatestHotPairs images={images.imageUrls} />
      {/* <Wallet initTopWallets={wallets} /> */}
      <Wallet />
      {/* FIXME: dex old migrate */}
      <Wallets initTopWallets={wallets} />
      <NFT NFTs={nfts} />
    </div>
  );
}
