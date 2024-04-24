import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FaRankingStar } from 'react-icons/fa6'
import { MdChecklist } from 'react-icons/md'
import { RiExchangeDollarFill } from 'react-icons/ri'

export default function TokenDetail() {
  return (
    <Card className="w-full">
      <CardContent className="mt-5">
        <Tabs defaultValue="summary" >
          <TabsList className='bg-transparent p-0 m-0'>
            <TabsTrigger value="summary">
              <MdChecklist />
              <span className='ml-1'>
                Summary
              </span>
            </TabsTrigger>
            <TabsTrigger value="markets">
              <RiExchangeDollarFill />

              <span className='ml-1'>Markets</span></TabsTrigger>
            <TabsTrigger value="scoring">
              <FaRankingStar />
              <span className='ml-1'>Scoring</span></TabsTrigger>
          </TabsList>
          <TabsContent value="summary" className='mt-5'>Token summary is here</TabsContent>
          <TabsContent value="markets" className='mt-5'>Find out more about token markets</TabsContent>
          <TabsContent value="scoring" className='mt-5'>Token scoring and vuln</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
