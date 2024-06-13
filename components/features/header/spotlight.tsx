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
import { useEffect, useState } from "react";
import { SpotlightSearchType } from "@/types/spotlight.type";
import { Daum, IToken } from "@/types/token.type";
import { get, set } from "local-storage";
import { ImageType } from "@/types/Image.type";
import { getImages } from "@/services/http/image.http";
import { useMounted } from "@/utils/useMounted";
import Image from "next/image";
import { minifyContract, minifyTokenName, truncate } from "@/utils/truncate";
import PriceFormatter from "@/utils/PriceFormatter";
import formatDate, { convertIsoToDate } from "@/utils/date";
import Loading from "@/components/common/Loading";
import { IoWalletOutline } from "react-icons/io5";
import { useDebouncedCallback } from "use-debounce";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { formatCash } from "@/utils/numbers";

export function Spotlight() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState<SpotlightSearchType>();
  const [token, setToken] = useState<IToken>();
  const [images, setImages] = useState<ImageType[]>([]);
  const isMounted = useMounted();
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    getImages({}).then((data) => setImages(data.imageUrls));
  }, []);

  const onInputChange = useDebouncedCallback(
    (value) => {
      setSearchTerm(value);
    },
    200,
    { maxWait: 2000 }
  );

  useEffect(() => {
    if (!searchTerm || searchTerm == "" || !isMounted) return;
    setToken(undefined);
    setWallet(undefined);
    const controller = new AbortController();
    spotlightSearch({
      params: { address: searchTerm, chain: 'ETH' }, //FIXME: chain/network must be coming from global state. Fix it when react query/zustand/network-selector is working
      signal: controller.signal,
    }).then((data) => {
      if (data?.subject?.label?.includes("Wallet")) {
        setLoading(false);
        return setWallet(data);
      }
      searchToken({
        params: {
          currencyAddress: searchTerm,
        },
        signal: controller.signal,
      })
        .then((data) => {
          setToken(data);
        })
        .finally(() => setLoading(false));
    });
    return () => {
      controller.abort();
    };
  }, [searchTerm]);

  const addToLocalStorage = (address: IToken | SpotlightSearchType) => {
    if (!address) return;
    const previousSearches = (get("previousSearches") as IToken[] | SpotlightSearchType[]) || [];
    set("previousSearches", [address, ...previousSearches.splice(0, 5)]);
  };

  const imageUrl = (address?: string): string | undefined => {
    const temp = images.find((image) => image.token == address);
    return temp?.imageUrl;
  };

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
        />
        <kbd className="absolute top-1/2 right-0 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>J
        </kbd>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 max-w-3xl rounded-md w-[99%] top-[30%] md:top-[40%]">
          <Input
            placeholder="Search for Wallets, Tokens, NFTs ..."
            className="focus-visible:ring-0 h-12 rounded-b-none"
            onChange={(e) => {
              setLoading(true);
              onInputChange(e.target.value);
            }}
          />

          {token || wallet ? (
            <>
              {wallet && (
                <div
                  className="cursor-pointer px-3 flex items-center gap-3 pb-4"
                  onClick={() => {
                    addToLocalStorage(wallet);
                    router.push(`/wallet/${wallet.subject.address}`);
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
                            addToLocalStorage(token);
                            if (item?.relationships?.base_token?.data?.id) {
                              const [baseToken, tokenId] = item.relationships.base_token.data.id.split("_");
                              router.push(`/tokens/${baseToken}/${tokenId}`);
                              setOpen(!open)
                            }
                          }}
                        >
                          <TableCell className="font-medium flex items-center justify-start gap-4 w-56">
                            <div className="w-10 h-10">
                              {item.relationships?.base_token?.data?.id && imageUrl(
                                item.relationships.base_token.data.id.split(
                                  "_"
                                )[1]
                              ) != undefined
                                &&
                                images && (
                                  <Image
                                    loading="eager"
                                    width={40}
                                    height={40}
                                    src={
                                      imageUrl(
                                        item.relationships.base_token.data.id.split(
                                          "_"
                                        )[1]
                                      )!
                                    }
                                    alt=""
                                  />
                                )}
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
                                value: + item.attributes.base_token_price_usd,
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
                            {item.attributes?.volume_usd?.h24 && PriceFormatter({
                              value: parseInt(
                                item.attributes.volume_usd.h24
                              ).toFixed(2),
                              dollarSign: true,
                            })}
                          </TableCell>
                          <TableCell>
                            {item.relationships?.dex?.data?.type && item.relationships.dex.data.type}
                          </TableCell>
                          <TableCell>
                            {item.attributes?.pool_created_at && formatDate(
                              convertIsoToDate(item.attributes.pool_created_at)
                            )}
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
                <div className="flex items-center justify-center ">
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
          <div className=" px-4 pb-4 flex flex-col md:flex-row items-start justify-start gap-6 md:gap-12">
            {get("previousSearches") != null && (
              <>
                <h4>
                  Previous searches:
                </h4>
                <ul className=" grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(get("previousSearches") as (SpotlightSearchType | IToken)[]).map((item) => (
                    <li
                      key={(item as SpotlightSearchType).subject?.address || (item as IToken).data?.[0]?.id}
                      className="cursor-pointer flex items-center justify-center"
                      onClick={() => {
                        if ((item as SpotlightSearchType).subject?.address) {
                          router.push(`/wallet/${(item as SpotlightSearchType).subject.address}`);
                          setOpen(!open)
                        } else {
                          router.push(
                            `/tokens/${(item as IToken).data?.[0]?.relationships?.base_token?.data?.id?.split("_")[1]}`
                          );
                          setOpen(!open)
                        }
                      }}
                    >
                      {(item as SpotlightSearchType).subject?.address ? (
                        <p>{minifyContract((item as SpotlightSearchType).subject.address)}</p>
                      ) : (
                        <div className="flex items-center justify-start gap-1 w-full md:gap-2">
                          {imageUrl(
                            (item as IToken).data?.[0]?.relationships?.base_token?.data?.id?.split("_")[1]
                          ) != undefined && (
                              <Image
                                loading="eager"
                                className="w-8 h-8 md:w-9 md:h-9"
                                width={20}
                                height={20}
                                src={imageUrl(
                                  (item as IToken).data![0].relationships?.base_token?.data?.id?.split("_")[1]!
                                )!}
                                alt=""
                              />
                            )}
                          {
                            (item as IToken).data![0].attributes?.name != undefined &&
                            <p>{minifyTokenName((item as IToken).data![0].attributes!.name)}</p>
                          }
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
