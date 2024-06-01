'use client'
import React from 'react';
import { useWatchlistStore } from "@/store"; // Adjust the import path as necessary
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { imageUrl } from '@/utils/imageUrl';

export function Watchlist() {
  // Fetch watchlist items from the store
  const watchlist = useWatchlistStore(state => state.watchlist);

  return (
    <div className="space-y-8">
      {watchlist.map((item, index) => (
        // Use index as a fallback key if id is undefined
        <div key={item.contractAddress} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={imageUrl(item.contractAddress, [])}
              alt={item.contractAddress || 'N/A'}
            />
            <AvatarFallback>
              {item.contractAddress.substring(0, 2) || 'NA'}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            {/* Display the token symbol or 'Unknown' if undefined */}
            <p className="text-sm font-medium leading-none">
              {item.contractAddress || 'Unknown'}
            </p>
            {/* Safe access to website URL with a default message */}
            <p className="text-sm text-muted-foreground">
              {item.contractAddress || 'No URL provided'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
