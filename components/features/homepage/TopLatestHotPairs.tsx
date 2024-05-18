'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Section,
    SectionHeader,
    SectionTitle,
    SectionDescription,
    SectionContent,
} from "@/components/layout/Section";
import { HotPairs } from "@/types/hotpair.type";
import { ILatestToken, LatestTokenType } from "@/types/latestToke.type";
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

dayjs.extend(relativeTime);

interface Props {
    images: ImageType[]
}

export function TopLatestHotPairs({ images }: Props) {
    const [averageRankPage, setAverageRankPage] = useState(0);
    const [latestTokenPage, setLatestTokenPage] = useState(0);
    const { selectedChain } = useTokenChainStore();

    const { data: averageRank, isPending: averageRankPending, refetch: averageRankRefetch } = useQuery(
        {
            queryKey:
                ['averageRank', selectedChain.name],
            queryFn: () => getAverageRank(selectedChain.url),
            refetchInterval: 100000,
        },
    );

    const { data: latestTokens, isPending: latestTokensPending, refetch: latestTokenRefetch } = useQuery(
        {
            queryKey:
                ['latestTokens', selectedChain.name],
            queryFn: () => getLatestTokens(selectedChain.url),
            refetchInterval: 100000,
        },
    );

    const maxAverageRankPage = averageRank ? Math.ceil(averageRank.length / 10) - 1 : 0;
    const maxLatestTokenPage = latestTokens ? Math.ceil(latestTokens.length / 10) - 1 : 0;


    return (
        <Section>
            <SectionHeader>
                <SectionTitle>Top & Latest Hot Pairs</SectionTitle>
                <SectionDescription>
                    The most active and recently trending cryptocurrency pairs in real-time.
                </SectionDescription>
            </SectionHeader>
            <SectionContent className="flex flex-col md:flex-row items-start justify-between gap-5 ">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between cursor-pointer">
                            <span>
                                Top Hot Pairs
                            </span>
                            <UpdateIcon onClick={() => averageRankRefetch()} />
                        </CardTitle>
                        <CardDescription>
                            Hot Pairs of the last one week
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {
                            averageRankPending ?
                                <ul>
                                    {Array.from({ length: 5 }).map((_, index) => (
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
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage src={imageUrl(token.contractAddress, images)} alt="Avatar" />
                                                    <AvatarFallback>{token.tokenName.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="ml-4 space-y-1">
                                                    <Copy className="text-sm font-medium leading-none"
                                                        text={minifyContract(token.contractAddress)}
                                                        value={token.contractAddress}
                                                        href={`/tokens/${token.contractAddress}`}
                                                    />
                                                    <p className="text-sm text-muted-foreground">
                                                        {minifyTokenName(token.tokenName)}
                                                    </p>
                                                </div>
                                                <div className="ml-auto font-medium">{dayjs().to(token.latestDate)}</div>
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
                            <span>
                                Latest Hot Pairs
                            </span>
                            <UpdateIcon onClick={() => latestTokenRefetch()} />
                        </CardTitle>
                        <CardDescription>
                            Hot Pairs of the last 24 hours
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {
                            latestTokensPending ?
                                <ul>
                                    {Array.from({ length: 5 }).map((_, index) => (
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
                                        .map((token: LatestTokenType, id: number) => (
                                            <div key={id} className="flex items-center">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage src={imageUrl(token.contractAddress, images)} alt="Avatar" />
                                                    <AvatarFallback>{token.tokenName.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="ml-4 space-y-1">
                                                    <Copy className="text-sm font-medium leading-none"
                                                        text={minifyContract(token.contractAddress)}
                                                        value={token.contractAddress}
                                                        href={`/tokens/${token.contractAddress}`}
                                                    />
                                                    <p className="text-sm text-muted-foreground">
                                                        {minifyTokenName(token.tokenName)}
                                                    </p>
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

            </SectionContent >
        </Section >
    )
}
