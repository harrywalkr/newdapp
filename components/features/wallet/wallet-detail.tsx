import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletBalanceType } from '@/types/wallet-balance.type'
import { WalletSummaryType } from '@/types/wallet-summary.type'
import { FaRankingStar } from 'react-icons/fa6'
import { IoShieldHalfOutline } from 'react-icons/io5'
import { MdChecklist } from 'react-icons/md'
import { RiExchangeDollarFill, RiNftLine } from 'react-icons/ri'
import CustomizedTimeline from './Timeline'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import WalletSummaryComponent from "./Wallet-summary"
import { IoMdTime } from "react-icons/io";
import DoughnutChart from "@/components/ui/Doughnut"
import { Progress } from "@/components/ui/progress"
import { KeyValue } from "@/components/ui/key-value"
import { IoIosSwap } from "react-icons/io";
import WalletSwaps from "./Wallet-swaps"
import { TbTransactionBitcoin } from "react-icons/tb"
import WalletTransactions from "./Wallet-transactions"
import { GoGraph } from "react-icons/go";
import WalletStatistical from "./WalletStatistical-old-dex/WalletStatistical"


interface Props {
  walletAddress: string
  walletSummary: WalletSummaryType,
  walletBalance: WalletBalanceType,
  dateRange: {
    limit?: number;
    from?: string;
    till?: string;
  }
}

export default function WalletDetail({ walletSummary, walletAddress, dateRange }: Props) {
  return (
    <Card className="w-full">
      <CardContent className="mt-5 overflow-hidden relative">
        <Tabs defaultValue="summary" className='w-full no-scrollbar'>
          <TabsList className='bg-transparent p-0 m-0 w-full overflow-y-scroll flex items-center justify-start'>
            <TabsTrigger value="summary">
              <MdChecklist />
              <span className='ml-1'>
                Summary
              </span>
            </TabsTrigger>
            <TabsTrigger value="scoring">
              <FaRankingStar />
              <span className='ml-1'>Scoring</span>
            </TabsTrigger>
            <TabsTrigger value="swaps">
              <IoIosSwap />
              <span className='ml-1'>Swaps</span>
            </TabsTrigger>
            <TabsTrigger value="timeline">
              <IoMdTime />
              <span className='ml-1'>
                Timeline
              </span>
            </TabsTrigger>
            <TabsTrigger value="transactions">
              <TbTransactionBitcoin />
              <span className='ml-1'>Transactions</span>
            </TabsTrigger>
            <TabsTrigger value="nft">
              <RiNftLine />
              <span className='ml-1'>NFT Balance</span>
            </TabsTrigger>
            <TabsTrigger value="statistics">
              <GoGraph />
              <span className='ml-1'>Statistics</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="summary" className='mt-5'>
            <WalletSummaryComponent walletSummary={walletSummary} />
          </TabsContent>
          <TabsContent value="timeline" className='mt-5'>
            <CustomizedTimeline />
          </TabsContent>
          <TabsContent value="scoring" className='mt-5 flex flex-col gap-5'>
            {
              walletSummary.totalScore != undefined &&
              <KeyValue
                stretch
                title="Total Score"
                description={`${walletSummary.totalScore}/1600`}
                valueIcon={<Progress
                  value={(walletSummary.totalScore / 1600) * 100}
                />}
                className="w-full h-5"
                variant="default"
              />
            }
            <div className="flex items-center justify-center gap-2">
              <h2>Total Score</h2>
            </div>
            <div className='grid grid-cols-2 gap-1'>
              {
                walletSummary.holdingTimeScore != undefined &&
                < DoughnutChart
                  title='Duration'
                  tooltip="The holding duration of the wallet"
                  data={[walletSummary.holdingTimeScore, 400 - walletSummary.holdingTimeScore]}
                />
              }
              {
                walletSummary.profitScore != undefined &&
                <DoughnutChart
                  title='PnL'
                  tooltip="PnL stands for Profit and Loss. It is a financial metric that represents the gain or loss incurred on an investment over a specific period of time."
                  data={[walletSummary.profitScore, 400 - walletSummary.profitScore]}

                />}
              {
                walletSummary.sizeScore != undefined &&
                <DoughnutChart
                  title='Margin'
                  // FIXME: Ask Safari for the right tooltips
                  tooltip="So Empty :("
                  data={[walletSummary.sizeScore, 400 - walletSummary.sizeScore]}

                />}
              {
                walletSummary.DextraderScore != undefined && walletSummary.DextraderScore.length > 0 &&
                <DoughnutChart
                  title='DexTrader'
                  tooltip="the wallet's consistency to trade on Decentralized Exchange platforms"
                  data={[walletSummary.DextraderScore[0], 400 - walletSummary.DextraderScore[0]]}
                />}
            </div>
          </TabsContent>
          <TabsContent value="swaps" className='mt-5'>
            <WalletSwaps walletAddress={walletAddress} dateRange={dateRange} />
          </TabsContent>
          <TabsContent value="transactions" className='mt-5'>
            <WalletTransactions walletAddress={walletAddress} dateRange={dateRange} />
          </TabsContent>
          <TabsContent value="nft" className='mt-5'>
            NFT Holdings
            <br />
            <span className="text-sm text-muted-foreground">
              No Activity in NFT
            </span>
            <br />
            <br />
            NFT Trades
            <br />
            <span className="text-sm text-muted-foreground">
              No Activity in NFT
            </span>
          </TabsContent>
          <TabsContent value="statistics" className='mt-5'>
            {/* FIXME: remove this abomination from the old project and all its files and folders and deps */}
            <WalletStatistical walletInfo={walletSummary} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
