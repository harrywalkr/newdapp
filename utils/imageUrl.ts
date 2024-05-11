import { ImageType } from "@/types/Image.type";

export const imageUrl = (
  address?: string,
  images: ImageType[]
): string | undefined => {
  if (!address) return undefined;
  const image = images?.find((image) => image.token === address);
  return image?.imageUrl;
};
