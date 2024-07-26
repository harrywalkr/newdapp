"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { imageUrl } from "@/utils/imageUrl";
import { useQuery } from "@tanstack/react-query";
import { getImages } from "@/services/http/image.http";
import { useWatchlistStore } from "@/store";
import { minifyContract, minifyTokenName } from "@/utils/truncate";
import { IWatchlistItem } from "@/store/watchlist";
import Link from "next/link";
import { useTokenChainStore } from "@/store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function Watchlist() {
  const watchlist = useWatchlistStore((state) => state.watchlist);
  const { selectedChain } = useTokenChainStore();
  const {
    isLoading,
    error,
    data: images,
  } = useQuery({
    queryKey: ["images"],
    queryFn: () => getImages().then((data) => data.imageUrls),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading images.</div>;
  }

  const renderTokenItem = (item: IWatchlistItem) => {
    const tokenId = item?.contractAddress || "";
    return (
        <Link
            href={`/tokens/${selectedChain.symbol.toLowerCase()}/${tokenId}`}
            key={item.contractAddress}
            className="flex items-center"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage
                src={imageUrl(item.contractAddress, images!)}
                alt={item.contractAddress || "N/A"}
            />
            <AvatarFallback>
              {item.contractAddress?.substring(0, 2) || "NA"}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {item.name ? minifyTokenName(item.name) : "Unknown"}
            </p>
            <p className="text-sm text-muted-foreground">
              {item.contractAddress
                  ? minifyContract(item.contractAddress)
                  : "No URL provided"}
            </p>
          </div>
        </Link>
    );
  };

  const renderWalletItem = (item: IWatchlistItem) =>{
    const walletItem = item?.contractAddress || "";
    return (
        <Link
            href={`/${item.type}/${walletItem}`}
            key={item.contractAddress}
            className="flex items-center"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage
                src={imageUrl(item.contractAddress, images!)}
                alt={item.contractAddress || "N/A"}
            />
            <AvatarFallback>
              {item.contractAddress?.substring(0, 2) || "NA"}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {item.name ? minifyTokenName(item.name) : "Unknown"}
            </p>
            <p className="text-sm text-muted-foreground">
              {item.contractAddress
                  ? minifyContract(item.contractAddress)
                  : "No URL provided"}
            </p>
          </div>
        </Link>
    )
  };

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Tokens</CardTitle>
            <CardDescription>Your Favorite Tokens</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {watchlist
                .filter((item: IWatchlistItem) => item.type === "token")
                .map(renderTokenItem)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Wallets</CardTitle>
            <CardDescription>Your Favorite Wallets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {watchlist
                .filter((item: IWatchlistItem) => item.type === "wallet")
                .map(renderWalletItem)}
          </CardContent>
        </Card>
      </div>
  );
}
