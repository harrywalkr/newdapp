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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import { ImageType } from "@/types/Image.type";
import { useEffect, useState } from "react";
import { getTrends } from "@/http/trends.http";
import { useCounterStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { minifyContract } from "@/utils/truncate";
import { Button } from "@/components/ui/button";
import Copy from "@/components/ui/copy";
import { BiFilterAlt } from "react-icons/bi";



export default function Tokens() {
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const count = useCounterStore((state) => state.count);


  const {
    isLoading,
    error,
    data: trends,
  } = useQuery(
    {
      queryKey: ["trends"],
      queryFn: () => getTrends({}).then(({ data }) => data),
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
        <Button variant="secondary" className="mb-5 flex items-center justify-center gap-2">
          <BiFilterAlt />
          <span>
            Filters
          </span>
        </Button>
        <div className="w-full">
          {trends && (
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
                        <div className="header relative flex items-start justify-start gap-6">
                          <Image
                            width={52}
                            height={52}
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
                                href={`/token/eth/${data.address}`} //FIXME: network must be coming from gloab state. Fix it when network/chain selector is ready
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
                            width={52}
                            height={52}
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
                                href={`/token/eth/${data.address}`} //FIXME: network must be coming from gloab state. Fix it when network/chain selector is ready
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
                  {trends.data.slice(6, 9).map((data: any, id: number) => (
                    <Card key={id} className="w-full">
                      <CardContent className="pt-6">
                        <div className="header relative flex items-start justify-start gap-6">
                          <Image
                            width={52}
                            height={52}
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
                                href={`/token/eth/${data.address}`} //FIXME: network must be coming from gloab state. Fix it when network/chain selector is ready
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
            </Swiper>
          )}
        </div>
      </SectionContent>
    </Section>
  );
}
