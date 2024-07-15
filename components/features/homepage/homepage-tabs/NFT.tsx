import Copy from "@/components/ui/copy";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  SectionContent,
} from "@/components/layout/Section";
import { NFTTradeReportType } from "@/types/nft.type"
import PriceFormatter from "@/utils/PriceFormatter";
import { minifyContract, minifyTokenName } from "@/utils/truncate";
import Link from "next/link";

interface Props {
  NFTs: NFTTradeReportType
}

export default function NFT({ NFTs }: Props) {
  return (
    <Section variant={'vertical'}>
      {/* <SectionHeader variant={'vertical'}>
        <SectionTitle>Trending NFTs</SectionTitle>
        <SectionDescription>
          Trending NFTs being actively traded
        </SectionDescription>
      </SectionHeader> */}
      <SectionContent variant={'vertical'}>
        <ScrollArea className="w-full rounded-md pb-4">
          <ScrollBar orientation="horizontal" />
          <Table className="bg-card">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center w-[50px]">ID</TableHead>
                <TableHead className="whitespace-nowrap">Contract</TableHead>
                <TableHead className="whitespace-nowrap">Min Price</TableHead>
                <TableHead className="whitespace-nowrap">Max Price</TableHead>
                <TableHead className="whitespace-nowrap">Buy Amount</TableHead>
                <TableHead className="whitespace-nowrap">Sell Amount</TableHead>
                <TableHead className="whitespace-nowrap">Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {NFTs.data.EVM.DEXTrades.slice(0, 5).map((d, id) => (
                <Record key={id} id={id + 1} data={d} />
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </SectionContent>
    </Section>
  )
}


const Record = ({ data, id }: { data: any; id: number }) => {
  return (

    <TableRow>
      <TableCell className="text-center p-4">{id}</TableCell>
      <TableCell >
        <Link
          target="_blank"
          href={`https://opensea.io/assets/ethereum/${data.Trade.Buy.Currency.SmartContract}`}
          rel="noopener noreferrer"
        >
          {minifyTokenName(data.Trade.Buy.Currency.Symbol)}
        </Link>
        <Link
          href={`https://opensea.io/assets/ethereum/${data.Trade.Buy.Currency.SmartContract}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground"
        >
          <Copy text={minifyContract(data.Trade.Buy.Currency.SmartContract)} />
        </Link>
      </TableCell>
      <TableCell >
        <PriceFormatter value={data.Trade.Buy.min_price} />
      </TableCell>
      <TableCell >
        <PriceFormatter value={data.Trade.Buy.max_price} />
      </TableCell>
      <TableCell >
        {parseFloat(data.buy_amount)?.toFixed(2)}
      </TableCell>
      <TableCell >
        {parseFloat(data.sell_amount)?.toFixed(2)}
      </TableCell>
      <TableCell >{data.count}</TableCell>
    </TableRow>
  );
};
