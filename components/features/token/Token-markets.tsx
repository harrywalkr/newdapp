import React from 'react'
import Renounce from './Renounce'
import CentralizedExchange from './CentralizedExchange'
import DecentralizedExchange from './DecentralizedExchange'
import { IToken } from '@/types/token.type'
import { Progress } from '@/components/ui/progress'
import TokenSecurityBox from './TokenSecurity-old-shit/TokenSecurityBox'
import TokenSecurityCallActivity from './TokenSecurity-old-shit/TokenSecurityCallActivity'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Props {
    token: IToken,
    tokenAddress: string
}

export default function TokenMarkets({ token, tokenAddress }: Props) {
    return (
        <div className='flex flex-col items-start justify-center gap-10'>
            <Tabs defaultValue="account" className="w-full">
                <TabsList>
                    <TabsTrigger value="account">DEX</TabsTrigger>
                    <TabsTrigger value="password">CEX</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                    <DecentralizedExchange token={token} />
                </TabsContent>
                <TabsContent value="password">
                    <CentralizedExchange token={token} />
                </TabsContent>
            </Tabs>
        </div>

    )
}
