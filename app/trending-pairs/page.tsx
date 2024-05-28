"use client";
import { useEffect, useState } from "react";
import RenderConditionalComponent from "@/components/common/RenderConditionalComponent";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { isPaidMember } from "@/services/auth.service";
import { getTrends } from "@/services/http/trends.http";
import { useTokenChainStore } from "@/store";
import { Daum } from "@/types/token.type";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function TableA({ params }: any) {
  const { selectedChain } = useTokenChainStore();
  const [paidMember, setPaidMember] = useState(false);
  const [loadingPaidMember, setLoadingPaidMember] = useState(true);

  useEffect(() => {
    isPaidMember().then((result) => {
      setPaidMember(result);
      setLoadingPaidMember(false);
    });
  }, []);

  const {
    isLoading,
    error,
    data: trends,
  } = useQuery({
    queryKey: ["trends", selectedChain.name],
    queryFn: () => getTrends(selectedChain.url),
    refetchInterval: 300000,
  });

  if (error) return <div>Failed to load trends, please try again.</div>;
  if (isLoading) return <div className='flex flex-col gap-3'>
    {Array.from({ length: 10 }, (_, i) => (
      <div key={i} className="flex items-center space-x-4 w-full">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      </div>
    ))}
  </div>;
  if (loadingPaidMember) return <div>Checking membership status...</div>;

  return (
    <div className="px-2 pt-8 relative">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Token Name</TableHead>
              <TableHead className="text-center">Symbol</TableHead>
              <TableHead className="text-center">Price</TableHead>
              <TableHead className="text-right">Volume</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paidMember ? (
              trends!.data != undefined &&
              trends!.data.map((d) => <Record key={d.id} token={d} />)
            ) : (
              trends!.data != undefined &&
              trends!.data.slice(0, 15).map((d) => <Record key={d.id} token={d} />)
            )}
          </TableBody>
        </Table>
        {!paidMember && (
          <div className="absolute z-10 bottom-0 left-0 right-0 w-full h-96 bg-gradient-to-t from-muted via-background flex flex-col items-center justify-center gap-6 md:gap-5 px-10 text-center">
            <p className="text-2xl font-medium">
              Please login to see more trending tokens
            </p>
            <Link
              href="/login"
              className="bg-base-200/70 hover:bg-base-200 p-2 px-4 rounded-md text-base cursor-pointer"
            >
              login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

const Record = ({ token }: { token: Daum }) => {
  return (
    <TableRow>
      <TableCell className="text-center text-base-content">
        <Avatar >
          <AvatarImage
            src={token.logo_url}
            alt="token logo"
          />
          <AvatarFallback>{token.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell className="text-base-content">symbol</TableCell>
      <TableCell className="text-center text-base-content">
        {/* <PriceFormatter value={data.price_stats.usd.price} dollarSign={true} /> */}
        price
      </TableCell>
      <TableCell className="text-right text-base-content">
        {/* <PriceFormatter
          value={data.price_stats.usd.volume_24h.toFixed(2)}
          dollarSign={true}
        /> */}
        vol 24
      </TableCell>
    </TableRow>
  );
};
