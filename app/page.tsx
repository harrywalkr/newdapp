import NFT from "@/components/features/homepage/NFT";
import Tokens from "@/components/features/homepage/Tokens";
import Wallet from "@/components/features/homepage/Wallet";
import TableExample from "@/components/features/data-table/data";
import { getAverageRank } from "@/services/http/averagerank.http";
import { getImages } from "@/services/http/image.http";
import { getWallets } from "@/services/http/wallets.http";
import { ImageEndpoint, ImageType } from "@/types/Image.type";
import { getTopNFTs } from "@/services/http/nft.http";
import { TopLatestHotPairs } from "@/components/features/homepage/TopLatestHotPairs";
import { getLatestTokens } from "@/services/http/latestTokens.http";

export default async function Home() {
  //   // cache: 'no-store' //FIXME: stop cache for this page
  const images = await getImages();
  const { data: wallets } = await getWallets({});
  const nfts = await getTopNFTs();

  return (
    <div className="flex flex-col w-full gap-11 md:gap-11 lg:gap-16">
      <Tokens />
      <TopLatestHotPairs images={images.imageUrls} />
      <Wallet initTopWallets={wallets} />
      {/* FIXME: dex old migrate */}
      {/* <TableExample initTopWallets={wallets} /> */}
      <NFT NFTs={nfts} />
    </div>
  );
}
