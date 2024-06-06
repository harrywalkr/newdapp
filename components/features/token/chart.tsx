'use client';
import Head from "next/head";
import dynamic from "next/dynamic";
import Script from "next/script";
import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import {
  ChartingLibraryWidgetOptions,
  ResolutionString,
} from "@/public/static/charting_library";
import { IDatafeed, IOhlcvData } from "@/types/datafeed.type";
import { getDataFeed } from "@/services/http/token.http";
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
  network: string;
  tokenAddress: string;
}

const TVChartContainer = dynamic(() => import("@/components/features/token/TVChartContainer").then(mod => mod.TVChartContainer), {
  ssr: false,
});

export default function Chart({ tokenAddress, network }: Props) {
  const { data: iDatafeed, isSuccess } = useQuery<IDatafeed>(
    {
      queryKey: ['ohlcvData'],
      queryFn: async () => {
        return await getDataFeed({ params: { contractAddress: tokenAddress, network: network } });
      }
    });

  const getOhlcvData = (data: IDatafeed): IOhlcvData[] => {
    if (!data.data) return [];
    return data.data.attributes.ohlcv_list
      .map(item => ({
        time: item[0],
        open: item[1],
        high: item[2],
        low: item[3],
        close: item[4],
        volume: item[5]
      }))
      .sort((a, b) => a.time - b.time)
  }

  const { theme } = useTheme();

  return (
    <>
      <Script
        src="/static/datafeeds/udf/dist/bundle.js"
        strategy="lazyOnload"
        onLoad={() => console.log('chart script loaded')}
      />
      {isSuccess && getOhlcvData(iDatafeed) && getOhlcvData(iDatafeed).length > 0 &&
        <div className='h-80 md:h-96 w-full my-6 md:my-7'>
          <TVChartContainer
            chartOptions={{
              ...defaultWidgetProps,
              symbol: iDatafeed.meta.base.name + '/' + iDatafeed.meta.quote.symbol
            }}
            ohlcvData={getOhlcvData(iDatafeed)}
            theme={theme === 'dark' ? 'dark' : 'light'}
          />
        </div>
      }
    </>
  );
}
