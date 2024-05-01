'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FaRankingStar } from 'react-icons/fa6'
import { MdChecklist } from 'react-icons/md'
import { RiExchangeDollarFill } from 'react-icons/ri'
import Chart from './chart'
import { TokenType } from '@/types/token.type'
import { ImageType } from '@/types/Image.type'
import clsx from 'clsx'
import TradeReport from './trade-report'
import CentralizedExchange from './CentralizedExchange'
import DecentralizedExchange from './DecentralizedExchange'
import TokenSummary from './TokenSummary'
import DoughnutChart from './Doughnut'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { ScrollBar } from '@/components/ui/scroll-area'
import { IoShieldHalfOutline } from 'react-icons/io5'
import ContractSecurity from './ContractSecurity'

interface Props {
  token: TokenType,
  logo: ImageType,
  tokenAddress: string
}

export default function TokenDetail({ token, tokenAddress }: Props) {
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
            <TabsTrigger value="markets">
              <RiExchangeDollarFill />
              <span className='ml-1'>Markets</span>
            </TabsTrigger>
            <TabsTrigger value="scoring">
              <FaRankingStar />
              <span className='ml-1'>Scoring</span>
            </TabsTrigger>
            <TabsTrigger value="security">
              <IoShieldHalfOutline />
              <span className='ml-1'>Security</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="summary" className='mt-5'>
            <TokenSummary token={token} tokenAddress={tokenAddress} />
          </TabsContent>
          <TabsContent value="markets" className='mt-5'>
            <div className='flex flex-col items-start justify-center gap-5'>
              <CentralizedExchange token={token} />
              <DecentralizedExchange token={token} />
            </div>
          </TabsContent>
          <TabsContent value="scoring" className='mt-5'>
            <div className='grid grid-cols-2 gap-1'>
              {
                token?.ScoreData?.score1 != undefined &&
                < DoughnutChart title='overall'
                  tooltip="The Entry Point Score indicates the suitability of buying the token based on technical analysis.
                  The score ranges from 0 to 400, where 0 implies that it is not in a good condition for buying,
                  and 400 means it is highly favorable for purchase!"
                  data={[token?.ScoreData?.score1, 400]}
                />
              }
              {
                token?.ScoreData?.score2 != undefined &&
                <DoughnutChart title='Reliability'
                  tooltip="Reliability Score indicates the risk associated with buying the token. The score ranges from 0 to 400, where 0 implies a high level of risk, and 400 means the token can be considered relatively reliable!"
                  data={[token?.ScoreData?.score2, 400]}

                />}
              {
                token?.ScoreData?.score3 != undefined &&
                <DoughnutChart title='Security'
                  tooltip="The Token Security Score reflects the safety of the token based on smart contract analysis and age. The score ranges from 0 to 400, where 0 implies it is not safe and can be risky, while 400 indicates a high level of security!"
                  data={[token?.ScoreData?.score3, 400]}

                />}
              {
                token?.ScoreData?.score4 != undefined &&
                <DoughnutChart title='Holders'
                  tooltip="The Onchain Analysis Score gauges the suitability of prior onchain engagement, scrutinizing transaction participants and trading acumen. It ranges from 0 (indicating low quality) to 400 (reflecting the highest quality)."
                  data={[token?.ScoreData?.score4, 400]}
                />}
            </div>
          </TabsContent>
          <TabsContent value="security" className='mt-5'>
            <ContractSecurity token={token} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
