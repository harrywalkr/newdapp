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
  className?: string
  tokenDescription: string
  tokenExchange: string
}

const TVChartContainer = dynamic(() => import("@/components/features/token/TVChartContainer").then(mod => mod.TVChartContainer), {
  ssr: false,
});

export default function Chart({ tokenAddress, network, tokenExchange, tokenDescription, className }: Props) {
  const fetchData = async (timeframe: string, aggregate: number): Promise<IDatafeed> => {
    return await getDataFeed({ params: { contractAddress: tokenAddress, network: network, timeframe, aggregate } });
  }

  const { data: minuteDatafeed, isSuccess: isMinuteDataSuccess } = useQuery<IDatafeed>(
    {
      queryKey: ['ohlcvData', 'minute'],
      queryFn: () => fetchData('minute', 5),
    });

  const { data: hourDatafeed, isSuccess: isHourDataSuccess } = useQuery<IDatafeed>(
    {
      queryKey: ['ohlcvData', 'hour'],
      queryFn: () => fetchData('hour', 1),
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

  const mergeData = (minuteData: IOhlcvData[], hourData: IOhlcvData[]): IOhlcvData[] => {
    // Assuming minuteData and hourData are sorted by time already
    const mergedData: IOhlcvData[] = [];
    let i = 0, j = 0;

    while (i < minuteData.length && j < hourData.length) {
      if (minuteData[i].time < hourData[j].time) {
        mergedData.push(minuteData[i]);
        i++;
      } else if (minuteData[i].time > hourData[j].time) {
        mergedData.push(hourData[j]);
        j++;
      } else {
        // If the timestamps are equal, decide how to merge them
        mergedData.push(hourData[j]); // Prefer hour data over minute data in this case
        i++;
        j++;
      }
    }

    // Add remaining data
    while (i < minuteData.length) {
      mergedData.push(minuteData[i]);
      i++;
    }
    while (j < hourData.length) {
      mergedData.push(hourData[j]);
      j++;
    }

    return mergedData;
  }

  const { theme } = useTheme();

  const isSuccess = isMinuteDataSuccess && isHourDataSuccess;
  const ohlcvData = isSuccess ? mergeData(getOhlcvData(minuteDatafeed!), getOhlcvData(hourDatafeed!)) : [];

  return (
    <>
      <Script
        src="/static/datafeeds/udf/dist/bundle.js"
        strategy="lazyOnload"
        onLoad={() => console.log('chart script loaded')}
      />
      {isSuccess && ohlcvData.length > 0 &&
        <div className='h-full w-full my-6 md:my-7'>
          <TVChartContainer
            className={className}
            chartOptions={{
              ...defaultWidgetProps,
              symbol: minuteDatafeed!.meta.base.name + '/' + minuteDatafeed!.meta.quote.symbol
            }}
            ohlcvData={ohlcvData}
            theme={theme === 'dark' ? 'dark' : 'light'}
            tokenExchange={tokenExchange}
            tokenDescription={tokenDescription}
          />
        </div>
      }
    </>
  );
}
