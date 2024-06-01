'use client'
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { imageUrl } from '@/utils/imageUrl';
import { useQuery } from "@tanstack/react-query";
import { getImages } from '@/services/http/image.http';
import { useWatchlistStore } from '@/store';

export function Watchlist() {
  const watchlist = useWatchlistStore(state => state.watchlist);

  const { isLoading, error, data: images } = useQuery({
    queryKey: ['images'],
    queryFn: () => getImages().then((data) => data.imageUrls),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading images.</div>;
  }

  return (
    <div className="space-y-8">
      {watchlist.map((item) => (
        <div key={item.contractAddress} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={imageUrl(item.contractAddress, images!)}
              alt={item.contractAddress || 'N/A'}
            />
            <AvatarFallback>
              {item.contractAddress.substring(0, 2) || 'NA'}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {item.name || 'Unknown'}
            </p>
            <p className="text-sm text-muted-foreground">
              {item.contractAddress || 'No URL provided'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
