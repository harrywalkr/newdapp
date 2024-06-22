import React from 'react'
import Renounce from './Renounce'
import CentralizedExchange from './CentralizedExchange'
import DecentralizedExchange from './DecentralizedExchange'
import { IToken } from '@/types/token.type'
import { Progress } from '@/components/ui/progress'

interface Props {
    token: IToken
}

export default function TokenMarkets({ token }: Props) {
    return (
        <div className='flex flex-col items-start justify-center gap-5'>
            <div className='flex items-center justify-between w-full'>

                <Renounce
                    active={token.FunctionCallsData?.renounceOwnership?.status === "renounced"}
                    text={token.FunctionCallsData?.renounceOwnership?.Date !== undefined
                        ? `Contract was Renounced at ${token.FunctionCallsData?.renounceOwnership?.Date}`
                        : `Contract is not Renounced`}
                    status={token?.ScoreData?.status || ''}
                />
                {
                    token.ScoreData?.totalScore != undefined && (
                        <div className='w-full max-w-[500px] flex flex-col items-center justify-center gap-2'>
                            <span>Security Score : {token.ScoreData.totalScore + '/' + 1600}</span>
                            <Progress value={60} className='w-full max-w-[500px] h-3' />
                        </div>
                    )
                }
            </div>
            <CentralizedExchange token={token} />
            <DecentralizedExchange token={token} />
        </div>

    )
}
