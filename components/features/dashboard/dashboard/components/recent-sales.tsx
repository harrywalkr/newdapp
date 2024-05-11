'use client'
import React from 'react';
import { useWatchlistStore } from "@/store"; // Adjust the import path as necessary
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RecentSales() {
  // Fetch watchlist items from the store
  const watchlist = useWatchlistStore(state => state.watchlist);

  return (
    <div className="space-y-8">
      {watchlist.map((token, index) => (
        // Use index as a fallback key if id is undefined
        <div key={token.data?.[0]?.id || index} className="flex items-center">
          <Avatar className="h-9 w-9">
            {/* Safe access to imageURL and symbol with fallbacks */}
            <AvatarImage
              src={token.TokenMedia?.Token_Currency || '/default-avatar.png'}
              alt={token.TokenMedia?.Token_Symbol || 'N/A'}
            />
            {/* Fallback content if symbol is undefined */}
            <AvatarFallback>
              {token.TokenMedia?.Token_Symbol?.substring(0, 2) || 'NA'}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            {/* Display the token symbol or 'Unknown' if undefined */}
            <p className="text-sm font-medium leading-none">
              {token.TokenMedia?.Token_Symbol || 'Unknown'}
            </p>
            {/* Safe access to website URL with a default message */}
            <p className="text-sm text-muted-foreground">
              {token.TokenMedia?.Token_Website || 'No URL provided'}
            </p>
          </div>
          {/* Display the base token price or '0.00' if undefined */}
          {
            token.data &&
            <div className="ml-auto font-medium">
              +${token.data[0].attributes?.base_token_price_usd || '0.00'}
            </div>
          }
        </div>
      ))}
    </div>
  );
}
