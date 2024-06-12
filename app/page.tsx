import NFT from "@/components/features/homepage/NFT";
import TrendPairs from "@/components/features/homepage/Trend-pair";
import Wallet from "@/components/features/homepage/Wallet";
import { getImages } from "@/services/http/image.http";
import { getWallets } from "@/services/http/wallets.http";
import { TopLatestHotPairs } from "@/components/features/homepage/TopLatestHotPairs";
import { getLatestTokens } from "@/services/http/latestTokens.http";
import { getTopNFTs } from "@/services/http/nft.http";
import Insight from "@/components/features/homepage/Insight";

export default async function Home() {
  //   // cache: 'no-store' //FIXME: stop cache for this page
  const images = await getImages();
  const wallets = await getWallets();
  const nfts = await getTopNFTs();

  console.log('wallet', wallets)

  return (
    <div className="flex flex-col w-full gap-11 md:gap-11 lg:gap-16">
      <Insight wallets={wallets.splice(0, 3)} />
      <TrendPairs />
      <TopLatestHotPairs images={images.imageUrls} />
      <Wallet initTopWallets={wallets} />
      {/* FIXME: dex old migrate */}
      {/* <TableExample initTopWallets={wallets} /> */}
      <NFT NFTs={nfts} />
    </div>
  );
}
