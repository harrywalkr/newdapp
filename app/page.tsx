import { NFT } from "@/components/features/homepage/NFT";
import Tokens from "@/components/features/homepage/Tokens";
import Wallet from "@/components/features/homepage/Wallet";
import { getAverageRank } from "@/http/averagerank.http";
import { getImages } from "@/http/image.http";
import { ImageEndpoint, ImageType } from "@/types/Image.type";
import { AxiosResponse } from "axios";

export default async function Home() {
  const images: ImageType[] = (await getImages({})).data.imageUrls
  const initHotPairs = await getAverageRank({});

  return (
    <div className="flex flex-col gap-11 md:gap-11">
      <Tokens />
      {/* <Wallet /> */}
      {/* <NFT columns={columns} data={payments} /> */}
    </div>
  );
}
