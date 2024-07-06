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
import { AnimationControls, motion, useAnimation } from "framer-motion";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import useWatchlistStore, { IWatchlistItem } from "@/store/watchlist";
import { stopPropagation } from "@/utils/stopPropagation";
import { useRouter } from "next/navigation";
import NonEthTable from "./notEthTable/TopTokenTable";
import { getTopTrends } from "@/services/http/token.http";
import Link from "next/link";
import TableLoading from "@/components/layout/Table-loading";
import TopTokenTable from "./notEthTable/TopTokenTable";

dayjs.extend(relativeTime);

interface Props {
    images: ImageType[];
}

export function TopLatestHotPairs({ images }: Props) {
    const [averageRankPage, setAverageRankPage] = useState(0);
    const [latestTokenPage, setLatestTokenPage] = useState(0);

    const { selectedChain } = useTokenChainStore();
    const router = useRouter()
    const control1 = useAnimation();
    const control2 = useAnimation();

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // const { data: averageRank, isPending: averageRankPending, refetch: averageRankRefetch } = useQuery(
    //     {
    //         queryKey: ['averageRank', selectedChain.symbol],
    //         queryFn: () => getAverageRank(selectedChain.url),
    //         refetchInterval: 100000,
    //         enabled: selectedChain.symbol === 'eth', // Only fetch for ETH
    //     },
    // );

    // const { data: latestTokens, isPending: latestTokensPending, refetch: latestTokenRefetch } = useQuery(
    //     {
    //         queryKey: ['latestTokens', selectedChain.symbol],
    //         queryFn: () => getLatestTokens(selectedChain.url),
    //         refetchInterval: 100000,
    //         enabled: selectedChain.symbol === 'eth', // Only fetch for ETH
    //     },
    // );

    const { data: topTokens, isPending: topTokensPending } = useQuery(
        {
            queryKey: ['topTokens', selectedChain.symbol, page, pageSize],
            queryFn: () => getTopTrends({ params: { network: selectedChain.symbol, page: page, limit: pageSize } }),
            refetchInterval: 100000,
            // enabled: selectedChain.symbol !== 'eth', // Only fetch for non-ETH
        },
    );

    const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlistStore();

    // const handleClick = async (refreshFun: Function, animationControl: AnimationControls) => {
    //     await animationControl.start({ rotate: 360, transition: { duration: 1 } });
    //     animationControl.set({ rotate: 0 });
    //     refreshFun();
    // };

    // const handleStarClick = (token: IWatchlistItem) => {
    //     const isInWatchlist = watchlist.some(w => w.contractAddress === token.contractAddress);
    //     if (isInWatchlist) {
    //         removeFromWatchlist(token.contractAddress);
    //     } else {
    //         addToWatchlist(token);
    //     }
    // };

    // const isTokenInWatchlist = (token: IWatchlistItem) => {
    //     return watchlist.some((w: IWatchlistItem) => w.contractAddress === token.contractAddress);
    // };

    // const maxAverageRankPage = averageRank ? Math.ceil(averageRank.length / 10) - 1 : 0;
    // const maxLatestTokenPage = latestTokens ? Math.ceil(latestTokens.length / 10) - 1 : 0;

    return (
        <Section variant='vertical'>
            {/* <SectionHeader variant='vertical'>
                <SectionTitle>Top & Latest Hot Pairs</SectionTitle>
                <SectionDescription>
                    The most active and recently trending cryptocurrency pairs in real-time.
                </SectionDescription>
            </SectionHeader> */}
            <SectionContent variant='vertical' className="flex flex-col md:flex-row items-stretch justify-between gap-5">
                {/* 
                <>
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
                                <div>
                                    {averageRank!
                                        .slice(averageRankPage * 10, (averageRankPage + 1) * 10)
                                        .map((token: HotPairs, id: number) => (
                                            <div
                                                key={id}
                                                className="flex items-center hover:bg-muted/50 py-4 cursor-pointer"
                                            // onClick={() => router.push(`/tokens/${selectedChain.symbol.toLowerCase()}/${token.contractAddress}`)}
                                            >
                                                <div onClick={(e) => { stopPropagation(e); handleStarClick({ name: token.tokenName, contractAddress: token.contractAddress, type: 'token' }) }} className="cursor-pointer">
                                                    {isTokenInWatchlist({ name: token.tokenName, contractAddress: token.contractAddress, type: 'token' }) ? <AiFillStar size={20} /> : <AiOutlineStar size={20} />}
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
                                <div>
                                    {latestTokens!
                                        .slice(latestTokenPage * 10, (latestTokenPage + 1) * 10)
                                        .map((token: LatestIToken, id: number) => (
                                            <div
                                                key={id}
                                                className="flex items-center hover:bg-muted/50 py-4 cursor-pointer"
                                            // onClick={() => router.push(`/tokens/${selectedChain.symbol.toLowerCase()}/${token.contractAddress}`)}
                                            >
                                                <div onClick={() => handleStarClick({ name: token.tokenName, contractAddress: token.contractAddress, type: 'token' })} className="cursor-pointer">
                                                    {isTokenInWatchlist({ name: token.tokenName, contractAddress: token.contractAddress, type: 'token' }) ? <AiFillStar size={20} /> : <AiOutlineStar size={20} />}
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
                </>
            */}
                <div className="w-full">
                    {
                        topTokensPending ? <TableLoading /> :
                            <TopTokenTable
                                page={page}
                                pageCount={pageSize}
                                setPage={setPage}
                                setPageSize={setPageSize}
                                images={images} initNonEthData={topTokens?.data || []}
                            />
                    }
                </div>
            </SectionContent>
        </Section>
    )
}