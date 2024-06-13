import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletBalanceType } from '@/types/wallet-balance.type';
import { WalletSummaryType } from '@/types/wallet-summary.type';
import { FaRankingStar } from 'react-icons/fa6';
import { IoShieldHalfOutline } from 'react-icons/io5';
import { MdChecklist } from 'react-icons/md';
import { RiExchangeDollarFill, RiNftLine } from 'react-icons/ri';
import CustomizedTimeline from './Timeline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import WalletSummaryComponent from "./Wallet-summary";
import { IoMdTime } from "react-icons/io";
import DoughnutChart from "@/components/ui/Doughnut";
import { Progress } from "@/components/ui/progress";
import { KeyValue } from "@/components/ui/key-value";
import { IoIosSwap } from "react-icons/io";
import WalletSwaps from "./Wallet-swaps";
import { TbTransactionBitcoin } from "react-icons/tb";
import WalletTransactions from "./Wallet-transactions";
import { GoGraph } from "react-icons/go";
import WalletStatistical from "./WalletStatistical-old-dex/WalletStatistical";
import RenderConditionalComponent from "@/components/common/RenderConditionalComponent";
import { isPaidMember } from "@/services/auth.service";
import Paywall from "@/components/common/Paywall";
import WalletTransactionOldShit from "./WalletTransaction-old-shit";
import Nft from "./Nft";
import Statistical from "./statistical";
import TokenBalance from "./TokenBalance";
import WalletStatisticalPnLTrades from "./WalletStatistical-old-dex/WalletStatisticalPnLTrades";
import WalletStatisticalPnLHistory from "./WalletStatistical-old-dex/WalletStatisticalPnLHistory";
import WalletStatisticalPercentageHistory from "./WalletStatistical-old-dex/WalletStatisticalPercentageHistory";
import WalletStatisticalTradeCounts from "./WalletStatistical-old-dex/WalletStatisticalTradeCounts";
import WalletNFTHolding from "./Nft";
import WalletOverview from "./WalletOverview2";
import { Separator } from "@/components/ui/separator";
import WalletScoring from "./WalletScoring/WalletScoring";
import TopRatedTokens from "./TopRatedTokens";
interface Props {
  walletAddress: string;
  walletSummary: WalletSummaryType;
  walletBalance: WalletBalanceType;
  dateRange: { from: string; till: string } | null;
}

export default function WalletDetail({ walletSummary, walletAddress, dateRange, walletBalance }: Props) {
  return (
    // <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
    <Card className="w-full">
      <CardContent className="mt-5 overflow-hidden relative">
        <Tabs defaultValue="Overview" className='w-full h-[1850px] no-scrollbar'>
          <TabsList className='bg-transparent p-0 m-0 w-full overflow-y-scroll flex items-center justify-start'>
            <TabsTrigger value="Overview">
              <MdChecklist />
              <span className='ml-1'>
                Overview
              </span>
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
          <TabsContent value="Overview" className='mt-5 h-full flex items-start justify-between gap-4'>
            <WalletOverview walletSummary={walletSummary} />
            <Separator orientation="vertical" />
            <div>
              <Card className="border-none w-full ">
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                  <CardDescription>Analyze Data from traders with high quality</CardDescription>
                </CardHeader>
                <CardContent>
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
            {/* <TokenBalance walletAddress={walletAddress} walletSummary={walletSummary} /> */}
          </TabsContent>
          <TabsContent value="Trade History" className='mt-5'>
            <WalletSwaps walletAddress={walletAddress} dateRange={dateRange} />
          </TabsContent>
          <TabsContent value="NFT Balance" className='mt-5'>
            <WalletNFTHolding walletAddress={walletAddress} />
          </TabsContent>
          <TabsContent value="transactions" className='mt-5'>
            <WalletTransactionOldShit walletAddress={walletAddress} dateRange={dateRange} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>

    // <Card className="w-full">
    //   <CardHeader>
    //     <CardTitle>Statistical</CardTitle>
    //   </CardHeader>
    //   <CardContent className="mt-5 overflow-hidden relative">
    //     <Tabs defaultValue="Pnl Trades" className='w-full no-scrollbar'>
    //       <TabsList className='bg-transparent p-0 m-0 w-full overflow-y-scroll flex items-center justify-start'>
    //         <TabsTrigger value="Pnl Trades">
    //           <MdChecklist />
    //           <span className='ml-1'>
    //             Pnl Trades
    //           </span>
    //         </TabsTrigger>
    //         <TabsTrigger value="Pnl History">
    //           <FaRankingStar />
    //           <span className='ml-1'>Pnl History</span>
    //         </TabsTrigger>
    //         <TabsTrigger value="Pnl Trade Count">
    //           <IoIosSwap />
    //           <span className='ml-1'>Pnl Trade Count</span>
    //         </TabsTrigger>
    //       </TabsList>
    //       <TabsContent value="Pnl Trades" className='mt-5 w-full'>
    //         <WalletStatisticalPnLTrades walletAddress={walletAddress} />
    //       </TabsContent>
    //       <TabsContent value="Pnl History" className='mt-5'>
    //         <div className="w-full lg:col-span-2">
    //           <WalletStatisticalPnLHistory walletInfo={walletSummary} />
    //         </div>
    //         <div className="w-full lg:col-span-2 mt-5">
    //           <WalletStatisticalPercentageHistory walletInfo={walletSummary} />
    //         </div>
    //       </TabsContent>
    //       <TabsContent value="Pnl Trade Count" className='mt-5'>
    //         <WalletStatisticalTradeCounts walletInfo={walletSummary} />
    //       </TabsContent>
    //     </Tabs>
    //   </CardContent>
    // </Card> 
    // </div>
  );
}
