'use client'
import Head from "next/head";
import dynamic from "next/dynamic";
import Script from "next/script";

import {
  ChartingLibraryWidgetOptions,
  ResolutionString,
} from "@/public/static/charting_library";
import { IDatafeed, IOhlcvData } from "@/types/datafeed.type";
import { getDataFeed } from "@/services/http/token.http";
import { cex } from "@/types/token.type";
import { useQuery } from "@tanstack/react-query";

const defaultWidgetProps: Partial<ChartingLibraryWidgetOptions> = {
  interval: "D" as ResolutionString,
  library_path: "/static/charting_library/",
  locale: "en",
  charts_storage_url: "https://saveload.tradingview.com",
  charts_storage_api_version: "1.1",
  client_id: "tradingview.com",
  user_id: "public_user_id",
  fullscreen: false,
  autosize: true,
};

interface Props {
  network: string
  tokenAddress: string
}

const TVChartContainer = dynamic(() => import("@/components/features/token/TVChartContainer").then(mod => mod.TVChartContainer), {
  ssr: false,
});

export default function Chart({ tokenAddress, network }: Props) {
  const { data: ohlcvData, isSuccess } = useQuery<IOhlcvData[]>(
    {
      queryKey: ['ohlcvData'],
      queryFn: async () => {
        const data = await getDataFeed({ params: { contractAddress: tokenAddress, network: network } });
        if (!data.data) return [];
        return data.data.attributes.ohlcv_list
          .map(item => ({
            time: item[0],
            // time: new Date(item[0] * 1000).setUTCHours(0, 0, 0, 0) / 1000, // Set time to 00:00 GMT
            open: item[1],
            high: item[2],
            low: item[3],
            close: item[4],
            volume: item[5]
          }))
          .sort((a, b) => a.time - b.time) // Sorting by time
          .splice(0, 30); // Limiting to first 5 items
      }
    });

  return (
    <>
      <Script
        src="/static/datafeeds/udf/dist/bundle.js"
        strategy="lazyOnload"
        onLoad={() => {/* Handle Script Load */ }}
      />
      {isSuccess && ohlcvData && ohlcvData.length > 0 &&
        <div className='h-80 md:h-96 w-full my-6 md:my-7'>
          <TVChartContainer chartOptions={{ ...defaultWidgetProps, symbol: 'cex![0].base' }} ohlcvData={ohlcvData} />
        </div>
      }
    </>
  );
}
