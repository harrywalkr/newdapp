'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Section, SectionHeader, SectionTitle, SectionDescription, SectionContent } from "@/components/layout/Section";
import { HotPairs } from "@/types/hotpair.type";
import { ILatestToken, LatestIToken } from "@/types/latestToke.type";
import { useQuery } from "@tanstack/react-query";
import { getAverageRank } from "@/services/http/averagerank.http";
import { Skeleton } from "@/components/ui/skeleton";
import { getLatestTokens } from "@/services/http/latestTokens.http";
import { useState } from "react";
import { ImageType } from "@/types/Image.type";
import { minifyContract, minifyTokenName } from "@/utils/truncate";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { imageUrl } from "@/utils/imageUrl";
import Copy from "@/components/ui/copy";
import { useTokenChainStore } from "@/store";
import { ChevronLeftIcon, ChevronRightIcon, UpdateIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getTopTrends } from "@/services/http/token.http";
import PriceFormatter from "@/utils/PriceFormatter";
import { formatCash } from "@/utils/numbers";
import clsx from "clsx";
import Link from "next/link";
import { AnimationControls, motion, useAnimation } from "framer-motion";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import useWatchlistStore, { IWatchlistItem } from "@/store/watchlist";

dayjs.extend(relativeTime);

interface Props {
    images: ImageType[];
}

export function TopLatestHotPairs({ images }: Props) {
    const [averageRankPage, setAverageRankPage] = useState(0);
    const [latestTokenPage, setLatestTokenPage] = useState(0);
    const [nonEthDataPage, setNonEthDataPage] = useState(0);
    const { selectedChain } = useTokenChainStore();
    const control1 = useAnimation();
    const control2 = useAnimation();

    const { data: averageRank, isPending: averageRankPending, refetch: averageRankRefetch } = useQuery(
        {
            queryKey: ['averageRank', selectedChain.name],
            queryFn: () => getAverageRank(selectedChain.url),
            refetchInterval: 100000,
            enabled: selectedChain.symbol === 'eth', // Only fetch for ETH
        },
    );

    const { data: latestTokens, isPending: latestTokensPending, refetch: latestTokenRefetch } = useQuery(
        {
            queryKey: ['latestTokens', selectedChain.name],
            queryFn: () => getLatestTokens(selectedChain.url),
            refetchInterval: 100000,
            enabled: selectedChain.symbol === 'eth', // Only fetch for ETH
        },
    );

    const { data: nonEthData, isPending: nonEthDataPending, refetch: nonEthDataRefetch } = useQuery(
        {
            queryKey: ['nonEthData', selectedChain.name],
            queryFn: () => getTopTrends({ params: { network: selectedChain.symbol, page: 1 } }),
            refetchInterval: 100000,
            enabled: selectedChain.symbol !== 'eth', // Only fetch for non-ETH
        },
    );

    const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlistStore();

    const handleClick = async (refreshFun: Function, animationControl: AnimationControls) => {
        await animationControl.start({ rotate: 360, transition: { duration: 1 } });
        animationControl.set({ rotate: 0 });
        refreshFun();
    };

    const handleStarClick = (token: IWatchlistItem) => {
        const isInWatchlist = watchlist.some(w => w.contractAddress === token.contractAddress);
        if (isInWatchlist) {
            removeFromWatchlist(token.contractAddress);
        } else {
            addToWatchlist(token);
        }
    };

    const isTokenInWatchlist = (token: IWatchlistItem) => {
        return watchlist.some((w: IWatchlistItem) => w.contractAddress === token.contractAddress);
    };

    const maxAverageRankPage = averageRank ? Math.ceil(averageRank.length / 10) - 1 : 0;
    const maxLatestTokenPage = latestTokens ? Math.ceil(latestTokens.length / 10) - 1 : 0;
    const maxNonEthDataPage = nonEthData ? Math.ceil(nonEthData.data.length / 10) - 1 : 0;

    return (
        <Section variant='vertical'>
            <SectionHeader variant='vertical'>
                <SectionTitle>Top & Latest Hot Pairs</SectionTitle>
                <SectionDescription>
                    The most active and recently trending cryptocurrency pairs in real-time.
                </SectionDescription>
            </SectionHeader>
            <SectionContent variant='vertical' className="flex flex-col md:flex-row items-stretch justify-between gap-5">
                {selectedChain.symbol === 'eth' ? <>
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between cursor-pointer">
                                <span>Top Hot Pairs</span>
                                <Button size="icon" variant='outline' onClick={() => handleClick(averageRankRefetch, control1)}>
                                    <motion.div animate={control1}>
                                        <UpdateIcon />
                                    </motion.div>
                                </Button>
                            </CardTitle>
                            <CardDescription>Hot Pairs of the last one week</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {averageRankPending ?
                                <ul>
                                    {Array.from({ length: 10 }).map((_, index) => (
                                        <li key={index} className="flex items-center space-x-4 mb-4">
                                            <Skeleton className="h-12 w-12 rounded-full" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-[250px]" />
                                                <Skeleton className="h-4 w-[200px]" />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                :
                                <div className="space-y-8">
                                    {averageRank!
                                        .slice(averageRankPage * 10, (averageRankPage + 1) * 10)
                                        .map((token: HotPairs, id: number) => (
                                            <div key={id} className="flex items-center">
                                                <div onClick={() => handleStarClick({ name: token.tokenName, contractAddress: token.contractAddress })} className="cursor-pointer">
                                                    {isTokenInWatchlist({ name: token.tokenName, contractAddress: token.contractAddress }) ? <AiFillStar size={20} /> : <AiOutlineStar size={20} />}
                                                </div>
                                                <Avatar className="h-9 w-9 ml-4">
                                                    <AvatarImage src={imageUrl(token.contractAddress, images)} alt="Avatar" />
                                                    <AvatarFallback>{token.tokenName.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="ml-4 space-y-1">
                                                    <Link
                                                        href={`/tokens/${selectedChain.symbol.toLowerCase()}/${token.contractAddress}`}
                                                        className="text-sm">
                                                        {minifyTokenName(token.tokenName)}
                                                    </Link>
                                                    <Copy className="text-sm text-muted-foreground leading-none"
                                                        text={minifyContract(token.contractAddress)}
                                                        value={token.contractAddress}
                                                    />
                                                </div>
                                                <div className="ml-auto font-medium text-sm lg:text-base">{dayjs().to(token.latestDate)}</div>
                                            </div>
                                        ))}
                                </div>
                            }
                        </CardContent>
                        <CardFooter className="flex items-center justify-end gap-2">
                            <Button variant='outline' size='icon' disabled={averageRankPage <= 0} onClick={() => setAverageRankPage(averageRankPage - 1)}>
                                <ChevronLeftIcon />
                            </Button>
                            <Button variant='outline' size='icon' disabled={averageRankPage >= maxAverageRankPage} onClick={() => setAverageRankPage(averageRankPage + 1)}>
                                <ChevronRightIcon />
                            </Button>
                        </CardFooter>
                    </Card>
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between cursor-pointer">
                                <span>Latest Hot Pairs</span>
                                <Button size="icon" variant='outline' onClick={() => handleClick(latestTokenRefetch, control2)}>
                                    <motion.div animate={control2}>
                                        <UpdateIcon />
                                    </motion.div>
                                </Button>
                            </CardTitle>
                            <CardDescription>Hot Pairs of the last 24 hours</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {latestTokensPending ?
                                <ul>
                                    {Array.from({ length: 10 }).map((_, index) => (
                                        <li key={index} className="flex items-center space-x-4 mb-4">
                                            <Skeleton className="h-12 w-12 rounded-full" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-[250px]" />
                                                <Skeleton className="h-4 w-[200px]" />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                :
                                <div className="space-y-8">
                                    {latestTokens!
                                        .slice(latestTokenPage * 10, (latestTokenPage + 1) * 10)
                                        .map((token: LatestIToken, id: number) => (
                                            <div key={id} className="flex items-center">
                                                <div onClick={() => handleStarClick({ name: token.tokenName, contractAddress: token.contractAddress })} className="cursor-pointer">
                                                    {isTokenInWatchlist({ name: token.tokenName, contractAddress: token.contractAddress }) ? <AiFillStar size={20} /> : <AiOutlineStar size={20} />}
                                                </div>
                                                <Avatar className="h-9 w-9 ml-4">
                                                    <AvatarImage src={imageUrl(token.contractAddress, images)} alt="Avatar" />
                                                    <AvatarFallback>{token.tokenName.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="ml-4 space-y-1">
                                                    <Link
                                                        href={`/tokens/${selectedChain.symbol.toLowerCase()}/${token.contractAddress}`}
                                                        className="text-sm">
                                                        {minifyTokenName(token.tokenName)}
                                                    </Link>
                                                    <Copy className="text-sm text-muted-foreground font-medium leading-none"
                                                        text={minifyContract(token.contractAddress)}
                                                        value={token.contractAddress}
                                                    />
                                                </div>
                                                <div className="ml-auto font-medium">{dayjs().to(token.latestDate)}</div>
                                            </div>
                                        ))}
                                </div>
                            }
                        </CardContent>
                        <CardFooter className="flex items-center justify-end gap-2">
                            <Button variant='outline' size='icon' disabled={latestTokenPage <= 0} onClick={() => setLatestTokenPage(latestTokenPage - 1)}>
                                <ChevronLeftIcon />
                            </Button>
                            <Button variant='outline' size='icon' disabled={latestTokenPage >= maxLatestTokenPage} onClick={() => setLatestTokenPage(latestTokenPage + 1)}>
                                <ChevronRightIcon />
                            </Button>
                        </CardFooter>
                    </Card>
                </> :
                    <ScrollArea className="w-full rounded-md">
                        <ScrollBar orientation="horizontal" />
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px] break-words">Token</TableHead>
                                    <TableHead className="break-words">24%</TableHead>
                                    <TableHead className="break-words">Price</TableHead>
                                    <TableHead className="">Liquidity</TableHead>
                                    <TableHead className="">24 Volume</TableHead>
                                    <TableHead className="">Age</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {nonEthDataPending ?
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">
                                            <Skeleton className="h-4 w-full" />
                                        </TableCell>
                                    </TableRow>
                                    :
                                    nonEthData!.data!
                                        .slice(nonEthDataPage * 10, (nonEthDataPage + 1) * 10)
                                        .map((token, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium break-words">
                                                    {
                                                        token?.attributes?.address != undefined &&
                                                        token.attributes.name != undefined &&
                                                        <div key={index} className="flex items-center">
                                                            <Avatar className="h-9 w-9">
                                                                <AvatarImage src={imageUrl(token.attributes.address, images)} alt="Avatar" />
                                                                <AvatarFallback>{token.attributes.address.charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                            <div className="ml-4 space-y-1">
                                                                <Link
                                                                    href={`/tokens/${selectedChain.symbol.toLowerCase()}/${token.attributes.address}`}
                                                                    className="text-sm">
                                                                    {token.attributes.name.split('/')[0]}
                                                                </Link>
                                                                <Copy className="text-sm text-muted-foreground leading-none"
                                                                    text={minifyContract(token.attributes.address)}
                                                                    value={token.attributes.address}
                                                                    href={`/tokens/${selectedChain.symbol.toLowerCase()}/${token.attributes.address}`}
                                                                />
                                                            </div>
                                                        </div>

                                                    }
                                                </TableCell>
                                                <TableCell >
                                                    {
                                                        token?.attributes?.price_change_percentage?.h24 != undefined &&
                                                        <span
                                                            className={clsx({
                                                                'text-green-300': +token.attributes.price_change_percentage.h24 > 0,
                                                                'text-red-300': +token.attributes.price_change_percentage.h24 < 0,
                                                            })}
                                                        >
                                                            {token.attributes.price_change_percentage.h24}
                                                        </span>
                                                    }
                                                </TableCell>
                                                <TableCell className="break-words">
                                                    {
                                                        token?.attributes?.base_token_price_usd &&
                                                        <PriceFormatter dollarSign value={token.attributes?.base_token_price_usd} />

                                                    }
                                                </TableCell>
                                                <TableCell className="break-words">
                                                    {
                                                        token?.attributes?.reserve_in_usd != undefined &&
                                                        formatCash(+token.attributes.reserve_in_usd)
                                                    }
                                                </TableCell>
                                                <TableCell className="break-words">
                                                    {
                                                        token?.attributes?.volume_usd?.h24 != undefined &&
                                                        formatCash(+token?.attributes?.volume_usd?.h24)
                                                    }
                                                </TableCell>
                                                <TableCell className="break-words">
                                                    {
                                                        token?.attributes?.pool_created_at != undefined &&
                                                        dayjs().to(token.attributes?.pool_created_at)
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        ))}
                            </TableBody>
                        </Table>
                        <div className="flex items-center justify-end gap-2 mt-4">
                            <Button variant='outline' size='icon' disabled={nonEthDataPage <= 0} onClick={() => setNonEthDataPage(nonEthDataPage - 1)}>
                                <ChevronLeftIcon />
                            </Button>
                            <Button variant='outline' size='icon' disabled={nonEthDataPage >= maxNonEthDataPage} onClick={() => setNonEthDataPage(nonEthDataPage + 1)}>
                                <ChevronRightIcon />
                            </Button>
                        </div>
                    </ScrollArea>
                }
            </SectionContent>
        </Section>
    )
}
