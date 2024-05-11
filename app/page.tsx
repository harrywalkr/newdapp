import { NFT } from "@/components/features/homepage/NFT";
import Tokens from "@/components/features/homepage/Tokens";
import Wallet from "@/components/features/homepage/Wallet";
import TableExample from "@/components/features/data-table/data";
import { getAverageRank } from "@/http/averagerank.http";
import { getImages } from "@/http/image.http";
import { getWallets } from "@/http/wallets.http";
import { ImageEndpoint, ImageType } from "@/types/Image.type";
import { getTopNFTs } from "@/http/nft.http";

export default async function Home() {
  const images: ImageType[] = (await getImages({
    // cache: 'no-store' //FIXME: stop cache for this page
  })).data.imageUrls
  const { data: initHotPairs } = await getAverageRank({});
  const { data: wallets } = await getWallets({});
  const { data: nfts } = await getTopNFTs();

  return (
    <div className="flex flex-col w-full gap-11 md:gap-11 lg:gap-14">
      <Tokens />
      <Wallet initTopWallets={wallets} />
      <TableExample initTopWallets={wallets} />
      <NFT nft={nfts} />
    </div>
  );
}
