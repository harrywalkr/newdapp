"use client";

import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  SectionContent,
} from "@/components/layout/Section";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import { useState } from "react";
import { getTrends } from "@/services/http/trends.http";
import useTokenChainStore from "@/store/tokenChains";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { minifyContract } from "@/utils/truncate";
import Copy from "@/components/ui/copy";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";



export default function TrendPairs() { // FIXME: this component must include trending, top and hot tokens all
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const { selectedChain } = useTokenChainStore();
  const router = useRouter()

  const {
    isLoading,
    error,
    data: trends,
  } = useQuery(
    {
      queryKey: ["trends", selectedChain.name],
      queryFn: () => getTrends(selectedChain.url).then(data => data),
    }
  )

  if (error) return <div>Failed to load trends, please try again.</div>;
  if (isLoading) return <Section>
    <SectionHeader>
      <SectionTitle>Hot Tokens</SectionTitle>
      <SectionDescription>
        Tokens with the most potentionl return on investment. Browse tokens
        for Security & investment value.
      </SectionDescription>
    </SectionHeader>
    <SectionContent>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {Array(3).fill(true).map((data: any, id: number) => (
          <Card key={id} className="w-full h-40 relative overflow-hidden flex flex-col justify-center gap-1 p-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[210px]" />
            </div>
            <div className="space-y-2 mt-5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[210px]" />
            </div>
          </Card>
        ))}
      </div>
    </SectionContent>
  </Section>

  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Hot Tokens</SectionTitle>
        <SectionDescription>
          Tokens with the most potentionl return on investment. Browse tokens
          for Security & investment value.
        </SectionDescription>
      </SectionHeader>
      <SectionContent>
        {/* FIXME: dex old */}
        {/* <Button variant="secondary" className="mb-5 flex items-center justify-center gap-2">
          <BiFilterAlt />
          <span>
            Filters
          </span>
        </Button> */}
        <div className="w-full">
          <Swiper
            onSlideChange={(swiper) => setActivePageIndex(swiper.activeIndex)}
            navigation={{
              nextEl: ".review-swiper-button-next",
              prevEl: ".review-swiper-button-prev",
            }}
            slidesPerView={1.1}
            modules={[Navigation]}
            className="mySwiper"
            spaceBetween={20}
          >
            <SwiperSlide className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {trends!.data.slice(0, 3).map((data, id: number) => (
                  <Card key={id} className="w-full">
                    <CardContent className="pt-6">
                      {/* <Link href={`/token/${data?.relationships?.base_token?.data?.id?.split("_")[1]}
                        ?network=${data.relationships?.base_token?.data?.id?.split("_")[0]}
                        `}*/}
                      <div className="header relative flex items-start justify-start gap-6">
                        <Avatar className="h-14 w-14">
                          <AvatarImage
                            src={data.logo_url}
                            alt="token logo"
                          />
                          <AvatarFallback>{data.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="content flex flex-col items-start justify-between h-28 ">
                          <div className="token flex flex-col items-start justify-start gap-2">
                            {/* <Link */}
                            {/* //FIXME: extend next/link to take searchparams and params without this mess :| */}
                            {/* //FIXME: network must come from global state not passed around as a url param! (canceled; what about global token search) */}
                            {/* > */}
                            {/* {minifyContract(data.name)}
                            </Link> */}
                            <Copy
                              href={`/tokens/${data.address}`}
                              className="font-medium text-lg link"
                              value={data.address}
                              text={minifyContract(data.address)} />
                          </div>
                          <div className="flex items-center justify-center gap-5">
                            <p className="text-muted-foreground">more detail</p>
                            <p className="text-muted-foreground">more detail</p>
                            <p className="text-muted-foreground">more detail</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </SwiperSlide>
            <SwiperSlide className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {trends!.data.slice(3, 6).map((data, id: number) => (
                  <Card key={id} className="w-full">
                    <CardContent className="pt-6">
                      <div className="header relative flex items-start justify-start gap-6">
                        <Avatar className="h-14 w-14">
                          <AvatarImage
                            src={data.logo_url}
                            alt="token logo"
                            width={60}
                            height={60}
                          />
                          <AvatarFallback>{data.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="content flex flex-col items-start justify-between h-28 ">
                          <div className="token flex flex-col items-start justify-start gap-2">
                            <Link
                              //FIXME: network must come from global state not passed around as a url param! (canceled; what about global token search)
                              href={`/tokens/${data.address}`}
                              className="font-medium text-lg link"
                            >
                              {minifyContract(data.name)}
                            </Link>
                            <Copy text={minifyContract(data.address)} />
                          </div>
                          <div className="flex items-center justify-center gap-5">
                            <p className="text-muted-foreground">more detail</p>
                            <p className="text-muted-foreground">more detail</p>
                            <p className="text-muted-foreground">more detail</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </SwiperSlide>
            <SwiperSlide className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {trends!.data.slice(6, 9).map((data, id: number, arr: any[]) => (
                  <Card key={id} className="w-full">
                    <CardContent className="pt-6 h-full">
                      {id === arr.length - 1 ? (
                        <Link
                          href={`/trending/${selectedChain.symbol}`}
                          className="flex h-full w-ful items-center justify-center text-lg cursor-pointer" >
                          Show More
                        </Link>
                      ) : <div className="header relative flex items-start justify-start gap-6">
                        <Avatar className="h-14 w-14">
                          <AvatarImage
                            src={data.logo_url}
                            alt="token logo"
                            width={60}
                            height={60}
                          />
                          <AvatarFallback>{data.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="content flex flex-col items-start justify-between h-28 ">
                          <div className="token flex flex-col items-start justify-start gap-2">
                            <Link href={`/tokens/${data.address}`} className="font-medium text-lg link">
                              {minifyContract(data.name)}
                            </Link>
                            <Copy text={minifyContract(data.address)} />
                          </div>
                          <div className="flex items-center justify-center gap-5">
                            <p className="text-muted-foreground">more detail</p>
                            <p className="text-muted-foreground">more detail</p>
                            <p className="text-muted-foreground">more detail</p>
                          </div>
                        </div>
                      </div>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </SwiperSlide>
            <div className=" w-full flex items-center justify-end gap-2 mt-3">
              <Button className="review-swiper-button-prev" variant='secondary'>
                prev
              </Button>
              <Button className='review-swiper-button-next' variant='secondary'>
                next
              </Button>
              {activePageIndex == 2 && (
                <Button disabled={false} onClick={() => router.push(`/trending/${selectedChain.symbol}`)}>
                  show more
                </Button>
              )}
            </div>
          </Swiper >
        </div >
      </SectionContent >
    </Section >
  );
}
