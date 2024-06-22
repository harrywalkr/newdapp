'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FaRankingStar } from 'react-icons/fa6'
import { MdChecklist } from 'react-icons/md'
import { RiExchangeDollarFill } from 'react-icons/ri'
import { IToken } from '@/types/token.type'
import { ImageType } from '@/types/Image.type'
import CentralizedExchange from './CentralizedExchange'
import DecentralizedExchange from './DecentralizedExchange'
import TokenSummary from './TokenSummary'
import DoughnutChart from '../../ui/Doughnut'
import { IoShieldHalfOutline } from 'react-icons/io5'
import ContractSecurity from './ContractSecurity'
import { GrStakeholder } from 'react-icons/gr'
import RenderConditionalComponent from '@/components/common/RenderConditionalComponent'
import { isPaidMember } from '@/services/auth.service'
import Paywall from '@/components/common/Paywall'
import TokenSecurityOldShit from './TokenSecurity-old-shit/TokenSecurity'
import TokenHolders from './TokenHolders-old-dex/TokenHolders'
import { KeyValue } from '@/components/ui/key-value'
import TokenSecurityMeasureLine from './TokenSecurity-old-shit/TokenSecurityMeasureLine'
import Renounce from './Renounce'
import TokenMarkets from './Token-markets'
import TokenScoring from './Token-scoring'

interface Props {
  token: IToken,
  network: string,
  tokenAddress: string,
}

export default function TokenDetail({ token, tokenAddress, network }: Props) {
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
            <TabsTrigger value="holders" >
              <GrStakeholder />
              <span className='ml-1'>Holders</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="summary" className='mt-5'>
            <TokenSummary token={token} tokenAddress={tokenAddress} network={network} />
          </TabsContent>
          <TabsContent value="markets" className='mt-5'>
            <TokenMarkets token={token} tokenAddress={tokenAddress} />
          </TabsContent>
          <TabsContent value="scoring" className='mt-5'>
            <TokenScoring token={token} />
          </TabsContent>
          <TabsContent value="security" className='mt-5'>
            {/* FIXME: contract security must be uncommented and updated to replace the old next line */}
            {/* <ContractSecurity token={token} /> */}
            <TokenSecurityOldShit token={token} tokenAddress={tokenAddress} />
          </TabsContent>
          <TabsContent value="holders" className='mt-5'>
            <RenderConditionalComponent
              // value={isPaidMember()}
              // FIXME: Fix conditional rendering compoent for promises!!!
              value={true}
              options={{
                trueValueComponent: <TokenHolders
                  token={token} tokenAddress={tokenAddress}
                />,
                falseValueComponent: <Paywall />
              }}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
