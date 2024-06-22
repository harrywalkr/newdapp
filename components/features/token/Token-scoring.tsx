import DoughnutChart from '@/components/ui/Doughnut'
import { Progress } from '@/components/ui/progress'
import { IToken } from '@/types/token.type'
import React from 'react'

interface Props {
    token: IToken
}

export default function TokenScoring({ token }: Props) {
    return (
        <div>
            {/* {
      token?.ScoreData?.score1 != undefined &&
      token?.ScoreData?.score2 != undefined &&
      token?.ScoreData?.score3 != undefined &&
      token?.ScoreData?.score4 != undefined &&
      <KeyValue
        title="Total score"
        value={token?.ScoreData?.score1 + token?.ScoreData?.score2 + token?.ScoreData?.score3 + token?.ScoreData?.score4 + '/' + 1600}
      />
    } */}
            {
                token.ScoreData?.totalScore != undefined && (
                    <div className='flex items-center justify-center'>
                        <div className='w-full flex flex-col items-center justify-center gap-2'>
                            <span>Security Score : {token.ScoreData.totalScore + '/' + 1600}</span>
                            <Progress value={60} className='w-full max-w-[500px] h-3' />
                        </div>
                    </div>
                )
            }
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 mt-10'>
                {token?.ScoreData?.score1 !== undefined && (
                    <DoughnutChart
                        // title={'Technical' + ' : ' + token?.ScoreData?.score1}
                        // tooltip="The Entry Point Score indicates the suitability of buying the token based on technical analysis. The score ranges from 0 to 400, where 0 implies that it is not in a good condition for buying, and 400 means it is highly favorable for purchase!"
                        // data={[token?.ScoreData?.score1, 400]}
                        tooltipText="The Onchain Analysis Score gauges the suitability of prior onchain engagement, scrutinizing transaction participants and trading acumen. It ranges from 0 (indicating low quality) to 400 (reflecting the highest quality)."
                        data={[{ name: 'string', value: token?.ScoreData?.score1, color: 'rgba(75, 192, 192, 0.5)' }, { name: 'string', value: 400 - token?.ScoreData?.score1, color: 'transparent' }]}
                        title='Entry Score'
                        score={token?.ScoreData?.score1}
                    />
                )}
                {token?.ScoreData?.score2 !== undefined && (
                    <DoughnutChart
                        // title={'Reliability' + ' : ' + token?.ScoreData?.score2}
                        // tooltip="Reliability Score indicates the risk associated with buying the token. The score ranges from 0 to 400, where 0 implies a high level of risk, and 400 means the token can be considered relatively reliable!"
                        // data={[token?.ScoreData?.score2, 400]}
                        tooltipText="The Onchain Analysis Score gauges the suitability of prior onchain engagement, scrutinizing transaction participants and trading acumen. It ranges from 0 (indicating low quality) to 400 (reflecting the highest quality)."
                        data={[{ name: 'string', value: token?.ScoreData?.score2, color: 'rgba(75, 192, 192, 0.5)' }, { name: 'string', value: 400 - token?.ScoreData?.score2, color: 'transparent' }]}
                        title='Reliability Score'
                        score={token?.ScoreData?.score2}
                    />
                )}
                {token?.ScoreData?.score3 !== undefined && (
                    <DoughnutChart
                        // title={'Security' + ' : ' + token?.ScoreData?.score3}
                        // tooltip="The Token Security Score reflects the safety of the token based on smart contract analysis and age. The score ranges from 0 to 400, where 0 implies it is not safe and can be risky, while 400 indicates a high level of security!"
                        // data={[token?.ScoreData?.score3, 400]}
                        tooltipText="The Onchain Analysis Score gauges the suitability of prior onchain engagement, scrutinizing transaction participants and trading acumen. It ranges from 0 (indicating low quality) to 400 (reflecting the highest quality)."
                        data={[{ name: 'string', value: token?.ScoreData?.score3, color: 'rgba(75, 192, 192, 0.5)' }, { name: 'string', value: 400 - token?.ScoreData?.score3, color: 'transparent' }]}
                        title='Security Score'
                        score={token?.ScoreData?.score3}
                    />
                )}
                {token?.ScoreData?.score4 !== undefined && (
                    <DoughnutChart
                        tooltipText="The Onchain Analysis Score gauges the suitability of prior onchain engagement, scrutinizing transaction participants and trading acumen. It ranges from 0 (indicating low quality) to 400 (reflecting the highest quality)."
                        data={[{ name: 'string', value: token?.ScoreData?.score4, color: 'rgba(75, 192, 192, 0.5)' }, { name: 'string', value: 400 - token?.ScoreData?.score4, color: 'transparent' }]}
                        title='Holders'
                        score={token?.ScoreData?.score4}
                    />
                )}
            </div>
        </div>
    )
}
