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
  //FIXME: Create loading component where you can use everywhere
  if (isLoading) return <div>Loading...</div>;
  if (loadingPaidMember) return <div>Checking membership status...</div>;

  return (
    <div className="px-2 pt-8 min-h-[80vh] relative">
      <div className="overflow-x-auto">
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
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
              trends!.data.map((d) => <Record key={d.id} data={d} />)
            ) : (
              trends!.data != undefined &&
              trends!.data.slice(0, 10).map((d) => <Record key={d.id} data={d} />)
            )}
          </TableBody>
        </Table>
        {!paidMember && (
          <div className="absolute z-10 bottom-0 left-0 right-0 w-full h-96 bg-gradient-to-t from-white via-white flex flex-col items-center justify-center gap-6 md:gap-5 px-10 text-center">
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

const Record = ({ data }: { data: Daum }) => {
  return (
    <TableRow>
      <TableCell className="text-base-content">image</TableCell>
      <TableCell className="text-center text-base-content">
        {/* {data.symbol} */}
      </TableCell>
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
