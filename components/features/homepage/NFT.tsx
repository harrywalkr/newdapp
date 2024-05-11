import Copy from "@/components/ui/copy";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { NFTTradeReportType } from "@/types/nft.type"
import PriceFormatter from "@/utils/PriceFormatter";
import { minifyContract, minifyTokenName } from "@/utils/truncate";
import Link from "next/link";

interface Props {
  NFTs: NFTTradeReportType
}

export default function NFT({ NFTs }: Props) {
  return (
    <Table>
      <TableCaption>A list of NFT transactions.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center w-[50px]">ID</TableHead>
          <TableHead>Contract</TableHead>
          <TableHead>Min Price</TableHead>
          <TableHead>Max Price</TableHead>
          <TableHead>Buy Amount</TableHead>
          <TableHead>Sell Amount</TableHead>
          <TableHead>Count</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {NFTs.data.EVM.DEXTrades.slice(0, 5).map((d, idx) => (
          <TableRow key={idx}>
            <Record key={idx} idx={idx + 1} data={d} />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}


const Record = ({ data, idx }: { data: any; idx: number }) => {
  return (
    <TableRow>
      <TableCell className="text-center">{idx}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="flex space-x-2 items-center">
            <div className="flex flex-col gap-2">
              <Link
                href={`https://opensea.io/assets/ethereum/${data.Trade.Buy.Currency.SmartContract}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium cursor-pointer"
              >
                {minifyTokenName(data.Trade.Buy.Currency.Symbol)}
              </Link>
              <div >
                <Link
                  href={`https://opensea.io/assets/ethereum/${data.Trade.Buy.Currency.SmartContract}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-40"
                >
                  {minifyContract(data.Trade.Buy.Currency.SmartContract)}
                </Link>
              </div>
            </div>
            <Copy text={data.Trade.Buy.Currency.SmartContract} />
          </div>
        </div>
      </TableCell>
      <TableCell>
        <PriceFormatter value={data.Trade.Buy.min_price} />
      </TableCell>
      <TableCell>
        <PriceFormatter value={data.Trade.Buy.max_price} />
      </TableCell>
      <TableCell>
        {parseFloat(data.buy_amount)?.toFixed(2)}
      </TableCell>
      <TableCell>
        {parseFloat(data.sell_amount)?.toFixed(2)}
      </TableCell>
      <TableCell>{data.count}</TableCell>
    </TableRow>
  );
};
