import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletBalanceType } from '@/types/wallet-balance.type';
import { WalletSummaryType } from '@/types/wallet-summary.type';
import { FaRankingStar } from 'react-icons/fa6';
import { MdChecklist } from 'react-icons/md';
import { RiNftLine } from 'react-icons/ri';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IoIosSwap } from "react-icons/io";
import WalletSwaps from "./Wallet-swaps";
import WalletStatisticalPnLTrades from "./WalletStatistical-old-dex/WalletStatisticalPnLTrades";
import WalletNFTHolding from "./Nft";
import WalletOverview from "./WalletOverview2";
import { Separator } from "@/components/ui/separator";
import WalletScoring from "./WalletScoring/WalletScoring";
import TopRatedTokens from "./TopRatedTokens";
import WalletPortfolio from "./TokenBalance";
import WalletTransactions from "./WalletTransactions";
interface Props {
  walletAddress: string;
  walletSummary: WalletSummaryType;
  walletBalance: WalletBalanceType;
  dateRange: { from?: Date; till?: Date };
}

export default function WalletDetail({ walletSummary, walletAddress, dateRange, walletBalance }: Props) {
  return (
    <Card className="w-full">
      <CardContent className="mt-5 overflow-hidden relative">
        <Tabs defaultValue="Overview" className='w-full no-scrollbar'>
          <TabsList className='bg-transparent p-0 m-0 w-full overflow-y-scroll flex items-center justify-start'>
            <TabsTrigger value="Overview">
              <MdChecklist />
              <span className='ml-1'>
                Overview
              </span>
            </TabsTrigger>
            <TabsTrigger value="Portfolio">
              <IoIosSwap />
              <span className='ml-1'>Portfolio</span>
            </TabsTrigger>
            <TabsTrigger value="Trade History">
              <IoIosSwap />
              <span className='ml-1'>Trade History</span>
            </TabsTrigger>
            <TabsTrigger value="NFT Balance">
              <RiNftLine />
              <span className='ml-1'>NFT Balance</span>
            </TabsTrigger>
            <TabsTrigger value="Transactions">
              <FaRankingStar />
              <span className='ml-1'>Transactions</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="Overview" className='mt-5 h-full flex flex-col lg:flex-row items-start justify-between gap-4'>
            <WalletOverview walletSummary={walletSummary} />
            <Separator orientation="vertical" flex />
            <div className="w-full">
              <Card className="border-none w-full ">
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                  <CardDescription>Analyze Data from traders with high quality</CardDescription>
                </CardHeader>
                <CardContent >
                  <WalletStatisticalPnLTrades walletAddress={walletAddress} />
                </CardContent>
              </Card>
              <Card className="border-none w-full ">
                <CardHeader>
                  <CardTitle>Scoring</CardTitle>
                  <CardDescription>Analyze Data from traders with high quality</CardDescription>
                </CardHeader>
                <CardContent>
                  <WalletScoring walletSummary={walletSummary} />
                </CardContent>
              </Card>
              <Card className="border-none w-full ">
                <CardHeader>
                  <CardTitle>Top Rated</CardTitle>
                </CardHeader>
                <CardContent>
                  <TopRatedTokens walletSummary={walletSummary} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="Portfolio" className='mt-5'>
            <WalletPortfolio walletSummary={walletSummary} walletAddress={walletAddress} />
          </TabsContent>
          <TabsContent value="Trade History" className='mt-5'>
            <WalletSwaps walletAddress={walletAddress} dateRange={dateRange} />
          </TabsContent>
          <TabsContent value="NFT Balance" className='mt-5'>
            <WalletNFTHolding walletAddress={walletAddress} />
          </TabsContent>
          <TabsContent value="Transactions" className='mt-5'>
            <WalletTransactions walletAddress={walletAddress} dateRange={dateRange} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
