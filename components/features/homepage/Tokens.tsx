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
import { getTrends } from "@/http/trends.http";
import useTokenChainStore from "@/store/tokenChains";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { minifyContract } from "@/utils/truncate";
import Copy from "@/components/ui/copy";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";



export default function Tokens() { // FIXME: this component must include trending, top and hot tokens all
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const { selectedChain } = useTokenChainStore();

  const {
    isLoading,
    error,
    data: trends,
  } = useQuery(
    {
      queryKey: ["trends", selectedChain.name],
      queryFn: () => getTrends(selectedChain.url).then(({ data }) => data),
    }
  )

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
          {false ? (
            <Swiper
              onSlideChange={(swiper) => setActivePageIndex(swiper.activeIndex)}
              navigation={{
                nextEl: ".review-swiper-button-next",
                prevEl: ".review-swiper-button-prev",
              }}
              modules={[Navigation]}
              className="mySwiper"
              spaceBetween={20}
            >
              <SwiperSlide className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {trends.data.slice(0, 3).map((data: any, id: number) => (
                    <Card key={id} className="w-full">
                      <CardContent className="pt-6">
                        {/* <Link href={`/token/${data?.relationships?.base_token?.data?.id?.split("_")[1]}
                        ?network=${data.relationships?.base_token?.data?.id?.split("_")[0]}
                        `}*/}
                        <div className="header relative flex items-start justify-start gap-6">
                          <Image
                            width={60}
                            height={60}
                            className='rounded-full'
                            src={data.logo_url}
                            alt="token logo"
                            style={{
                              opacity: data.logo_url ? 1 : 0.3,

                              height: '100%'
                            }}
                          />
                          <div className="content flex flex-col items-start justify-between h-28 ">
                            <div className="token flex flex-col items-start justify-start gap-2">
                              <Link
                                //FIXME: extend next/link to take searchparams and params without this mess :|
                                //FIXME: network must come from global state not passed around as a url param! (canceled; what about global token search)
                                href={`/monitoring/${data.address}`}
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
                  {trends.data.slice(3, 6).map((data: any, id: number) => (
                    <Card key={id} className="w-full">
                      <CardContent className="pt-6">
                        <div className="header relative flex items-start justify-start gap-6">
                          <Image
                            width={60}
                            height={60}
                            className='rounded-full'
                            src={data.logo_url}
                            alt="token logo"
                            style={{
                              opacity: data.logo_url ? 1 : 0.3,

                              height: '100%'
                            }}
                          />
                          <div className="content flex flex-col items-start justify-between h-28 ">
                            <div className="token flex flex-col items-start justify-start gap-2">
                              <Link
                                //FIXME: extend next/link to take searchparams and params without this mess :|
                                //FIXME: network must come from global state not passed around as a url param! (canceled; what about global token search)
                                href={`/monitoring/${data.address}`}
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
                  {trends.data.slice(6, 9).map((data: any, id: number, arr: any[]) => (
                    <Card key={id} className="w-full">
                      <CardContent className="pt-6 h-full">
                        {id === arr.length - 1 ? (
                          <Link
                            href={`/trending/${selectedChain.symbol}`}
                            className="flex h-full w-ful items-center justify-center text-lg cursor-pointer" >
                            Show More
                          </Link>
                        ) : <div className="header relative flex items-start justify-start gap-6">
                          <Image
                            width={60}
                            height={60}
                            className='rounded-full'
                            src={data.logo_url}
                            alt="token logo"
                            style={{ opacity: data.logo_url ? 1 : 0.3, height: '100%' }}
                          />
                          <div className="content flex flex-col items-start justify-between h-28 ">
                            <div className="token flex flex-col items-start justify-start gap-2">
                              <Link href={`/monitoring/${data.address}`} className="font-medium text-lg link">
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

              {/* <div className="review-swiper-button-next">s</div>
              <div className="review-swiper-button-prev">f</div> */}

              {/* <div className=" w-full flex items-center justify-end gap-2 mt-3">
                  <div className="review-swiper-button-prev p-2 bg-base-100/50 rounded-sm hover:bg-base-100/80 cursor-pointer">
                    prev
                  </div>
                  {activePageIndex == 1 && (
                    <Link
                      href={`/trending/${network.symbol}`}
                      className="p-2 bg-base-100/50 rounded-sm hover:bg-base-100/80 cursor-pointer"
                    >
                      show all
                    </Link>
                  )}
                  <div
                    className={`review-swiper-button-next
                  rounded-sm hover:bg-base-100/80 cursor-pointer
                   ${activePageIndex == 0 && "p-2 bg-base-100/50"}
                  `}
                  >
                    {activePageIndex == 0 && "next"}
                  </div>
                </div> */}
            </Swiper >
          ) : <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {Array(3).fill(true).map((data: any, id: number) => (
              <Card key={id} className="w-full h-40 relative overflow-hidden flex flex-col justify-center gap-2 p-4">
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
          }
        </div >
      </SectionContent >
    </Section >
  );
}
