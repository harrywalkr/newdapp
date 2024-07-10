"use client";

import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { spotlightSearch } from "@/services/http/spotlight.http";
import { searchToken } from "@/services/http/token.http";
import { useState, useEffect } from "react";
import { SpotlightSearchType } from "@/types/spotlight.type";
import { IToken } from "@/types/token.type";
import { get, set } from "local-storage";
import { getImages } from "@/services/http/image.http";
import { minifyContract, minifyTokenName, truncate } from "@/utils/truncate";
import PriceFormatter from "@/utils/PriceFormatter";
import Loading from "@/components/common/Loading";
import { IoWalletOutline } from "react-icons/io5";
import { useDebouncedCallback, useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { formatCash } from "@/utils/numbers";
import ChainImage from "@/utils/ChainImage";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { imageUrl } from "@/utils/imageUrl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ImageType } from "@/types/Image.type";
import { useTokenChainStore } from "@/store";
import { getNetworkSymbol } from "@/utils/NetworkSymbol";

dayjs.extend(relativeTime);

type localStorageItem = {
  name: string,
  address: string,
  network?: string
}

type PreviousSearchesProps = {
  images: ImageType[] | undefined,
  router: ReturnType<typeof useRouter>,
  setOpen: (open: boolean) => void,
}

const useImages = () => {
  return useQuery({
    queryKey: ['images'],
    queryFn: () => getImages().then((data) => data.imageUrls)
  });
};

type SpotlightSearchResult = {
  type: 'wallet' | 'token',
  data: SpotlightSearchType | IToken
}


const useSpotlightSearch = (debouncedSearchTerm: string, network: string): UseQueryResult<SpotlightSearchResult | undefined, Error> => {
  return useQuery({
    queryKey: ['spotlightSearch', debouncedSearchTerm],
    queryFn: async (): Promise<SpotlightSearchResult | undefined> => {
      if (!debouncedSearchTerm) return;

      const tokenData = await searchToken({
        params: {
          currencyAddress: debouncedSearchTerm,
        },
      });

      if (tokenData.data && tokenData.data.length > 0) {
        return { type: 'token', data: tokenData };
      }

      const data = await spotlightSearch({
        params: { address: debouncedSearchTerm, chain: network },
      });

      if (data?.subject?.label?.includes("Wallet")) {
        return { type: 'wallet', data };
      }

      return undefined; // If neither API returns valid data, return undefined
    },
    enabled: !!debouncedSearchTerm,
  });
};

const addToLocalStorage = (item: localStorageItem): void => {
  if (!item) return;
  const historySearches = (get("historySearches") as localStorageItem[]) || [];
  set("historySearches", [item, ...historySearches.splice(0, 5)]);
};

const PreviousSearches = ({ images, router, setOpen }: PreviousSearchesProps) => {
  const historySearches: localStorageItem[] = (get("historySearches") as localStorageItem[]) || [];
  return historySearches.length ? (
    <>
      <h4>Previous searches:</h4>
      <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {historySearches.map((item) => (
          <li
            key={item.address}
            className="cursor-pointer flex items-center justify-center"
            onClick={() => {
              if (item.network === undefined) {
                router.push(`/wallet/${item.address}`);
              } else {
                router.push(`/tokens/${item.network}/${item.address}`);
              }
              setOpen(false);
            }}
          >
            {item.network === undefined ? (
              <p>{minifyContract(item.address)}</p>
            ) : (
              <div className="flex items-center justify-start gap-1 w-full md:gap-2">
                {images && imageUrl(item.address, images) && (
                  <Avatar>
                    <AvatarImage
                      src={imageUrl(item.address, images)}
                      alt="token logo"
                    />
                    <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <p>{minifyTokenName(item.name)}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  ) : null;
};

const Spotlight = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState<SpotlightSearchType | undefined>();
  const [token, setToken] = useState<IToken | undefined>();
  const router = useRouter();
  const { selectedChain } = useTokenChainStore();

  const [debouncedSearchTerm] = useDebounce(searchTerm, 200);

  const { isLoading: imagesLoading, error: imagesError, data: images } = useImages();
  const { data: searchData, refetch: refetchSearchData, error: searchError } = useSpotlightSearch(debouncedSearchTerm, selectedChain.symbol);

  useEffect(() => {
    if (searchData) {
      setLoading(false);
      if (searchData.type === 'wallet') {
        setWallet(searchData.data as SpotlightSearchType);
      } else {
        setToken(searchData.data as IToken);
      }
    }
  }, [searchData]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setLoading(true);
      refetchSearchData();
    }
  }, [debouncedSearchTerm, refetchSearchData]);

  const onInputChange = useDebouncedCallback(
    (value: string) => {
      setSearchTerm(value);
      setToken(undefined);
      setWallet(undefined);
    },
    200,
    { maxWait: 2000 }
  );

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setOpen((open) => !open);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <div className="w-full relative">
        <Input
          onFocus={(e) => {
            e.preventDefault();
            setOpen((open) => !open);
          }}
          type="text"
          placeholder="Search for Wallets, Tokens, NFTs ..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <kbd className="absolute top-1/2 right-0 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>J
        </kbd>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 max-w-5xl rounded-md w-[99%] top-[30%] md:top-[40%]">
          <Input
            placeholder="Search for Wallets, Tokens, NFTs ..."
            className="focus-visible:ring-0 h-12 rounded-b-none"
            onChange={(e) => onInputChange(e.target.value)}
          />
          {searchError && (
            <div className="pb-4 text-red-500">
              An error occurred while searching. Please try again.
            </div>
          )}
          {imagesError && (
            <div className="pb-4 text-red-500">
              An error occurred while fetching images. Please try again.
            </div>
          )}
          {token || wallet ? (
            <>
              {wallet && (
                <div
                  className="cursor-pointer px-3 flex items-center gap-3 pb-4"
                  onClick={() => {
                    setOpen(!open)
                    addToLocalStorage({
                      name: wallet.subject.address,
                      address: wallet.subject.address,
                      // network: wallet.network.protocol
                    });
                    router.push(`/wallet/${wallet.subject.address}?network=${getNetworkSymbol(wallet.network.network)}`);
                  }}
                >
                  <IoWalletOutline className="text-xl" />
                  <div className="flex items-center gap-2">
                    <div className="hidden md:block">
                      {wallet.subject.address}
                    </div>
                    <div className="block md:hidden">
                      {minifyContract(wallet.subject.address)}
                    </div>
                  </div>
                </div>
              )}
              {token && (
                <ScrollArea className="max-h-80 md:max-h-96 w-full px-3 pb-4">
                  <ScrollBar orientation="horizontal" />
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Token</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Change</TableHead>
                        <TableHead>Liquidity</TableHead>
                        <TableHead>Volume</TableHead>
                        <TableHead>Dex</TableHead>
                        <TableHead>Age</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {token.data && token.data.map((item) => (
                        <TableRow
                          key={item.id}
                          className="cursor-pointer"
                          onClick={() => {
                            addToLocalStorage({
                              name: token.data![0].attributes!.name!,
                              address: token.data?.[0]?.relationships?.base_token?.data?.id?.split("_")[1]!,
                              network: token.data?.[0]?.relationships?.base_token?.data?.id?.split("_")[0]!
                            });
                            if (item?.relationships?.base_token?.data?.id) {
                              const [baseToken, tokenId] = item.relationships.base_token.data.id.split("_");
                              router.push(`/tokens/${baseToken}/${tokenId}`);
                              setOpen(!open)
                            }
                          }}
                        >
                          <TableCell className="font-medium flex items-center justify-start gap-4 w-56">
                            <div className="w-10 h-10">
                              {
                                item.relationships?.base_token?.data?.id && images != undefined ? (
                                  <Avatar>
                                    <AvatarImage
                                      src={
                                        imageUrl(
                                          item.relationships.base_token.data.id.split(
                                            "_"
                                          )[1],
                                          images
                                        )
                                      }
                                      alt="token logo"
                                    />
                                    <AvatarFallback>{item.attributes?.name && item.attributes.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                ) : <ChainImage chainName={item.id!.split("_")[0]} />}
                            </div>
                            <div className="flex flex-col items-start justify-center gap-1">
                              <div className="whitespace-nowrap">
                                {item.attributes?.name && truncate(item.attributes.name, 15)}
                              </div>
                              <div>
                                {item.attributes?.address && minifyContract(item.attributes.address)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {
                              item?.attributes?.base_token_price_usd &&
                              PriceFormatter({
                                value: (+item.attributes.base_token_price_usd),
                              })}
                          </TableCell>
                          <TableCell>
                            {item.attributes?.price_change_percentage?.h24 && item.attributes.price_change_percentage.h24}%
                          </TableCell>
                          <TableCell>
                            {
                              item.attributes?.reserve_in_usd != undefined &&
                              `$${formatCash(+item.attributes.reserve_in_usd)}`
                            }
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {item.attributes?.volume_usd?.h24 &&
                              `$${formatCash(+item.attributes.volume_usd.h24)}`
                            }
                          </TableCell>
                          <TableCell>
                            {item.relationships?.dex?.data?.id && item.relationships.dex.data.id}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {item.attributes?.pool_created_at &&
                              dayjs().to(item.attributes.pool_created_at)
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </>
          ) : (
            <div className="pb-4">
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loading width={50} height={50} />
                </div>
              ) : (
                <p className="text-muted-foreground opacity-40 flex items-center justify-center">
                  Start typing to search
                </p>
              )}
            </div>
          )}
          <Separator />
          <div className="px-4 pb-4 flex flex-col md:flex-row items-start justify-start gap-6 md:gap-12">
            <PreviousSearches images={images} router={router} setOpen={setOpen} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Spotlight;
