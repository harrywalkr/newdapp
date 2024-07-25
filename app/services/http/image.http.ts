// src/services/http/image.http.js
import { ImageEndpoint, ImageType } from '@/types/Image.type';
import {fetchData} from "@/services/http/axios.config";

export const getImages = async (options = {}): Promise<ImageType[]> => {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL_TWO}/images`;
    const data: ImageEndpoint = await fetchData(url, options);
    return data.imageUrls;
};
