import React, { useEffect, useRef } from 'react';
import { widget as TradingViewWidget, ChartingLibraryWidgetOptions, ResolutionString, LanguageCode, IBasicDataFeed, IDatafeedQuotesApi } from "@/public/static/charting_library";
import { IDatafeed, IOhlcvData } from '@/types/datafeed.type';

const dataFeed = (ohlcvData: IOhlcvData[]): IBasicDataFeed | (IBasicDataFeed & IDatafeedQuotesApi) => {
    return {
        onReady: (callback: any) => {
            setTimeout(() => callback({
                supported_resolutions: ["1D", "1W", "1M"],
                supports_search: false,
                supports_group_request: false,
                supports_marks: false,
                supports_timescale_marks: false,
                supports_time: true
            }), 0);
        },
        resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
            setTimeout(() => {
                onSymbolResolvedCallback({
                    name: symbolName,
                    timezone: 'Etc/UTC',
                    minmov: 1,
                    session: '24x7',
                    has_intraday: true,
                    has_daily: true,
                    has_weekly_and_monthly: true,
                    type: 'crypto',
                    supported_resolutions: ["1D", "1W", "1M"] as ResolutionString[],
                    pricescale: 100000000,
                    ticker: symbolName,
                    description: 'Description of the symbol',
                    exchange: 'Exchange name',
                    listed_exchange: 'Listed exchange name',
                    format: 'price'
                });
            }, 0);
        },
        getBars: (symbolInfo, resolution, periodParams, onResult, onError) => {
            setTimeout(() => {
                const bars = ohlcvData.filter(bar => {
                    return bar.time >= periodParams.from && bar.time < periodParams.to;
                }).map(bar => ({
                    time: bar.time,
                    open: bar.open,
                    high: bar.high,
                    low: bar.low,
                    close: bar.close,
                    volume: bar.volume
                }));
                if (bars.length) {
                    onResult(bars, { noData: false });
                } else {
                    onResult([], { noData: true });
                }
            }, 0);
        },
        searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
            // Implement search logic here, or provide a mock implementation if not applicable
        },
        subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {
            // Implement subscription logic here, or provide a mock implementation if not applicable
        },
        unsubscribeBars: (subscriberUID) => {
            // Implement unsubscription logic here, or provide a mock implementation if not applicable
        },
        getQuotes: (symbols, onDataCallback, onErrorCallback) => {
            onDataCallback(symbols.map(symbol => ({
                s: "ok",
                n: symbol,
                v: {
                    price: 123.45,
                }
            })));
        },
        subscribeQuotes: (symbols, fastSymbols, onRealtimeCallback, listenerGUID) => {
            // Mock implementation, possibly use setInterval to simulate real-time data
        },
        unsubscribeQuotes: (listenerGUID) => {
            // Mock implementation
        }
    }
};


interface Props {
    chartOptions: Partial<ChartingLibraryWidgetOptions>,
    ohlcvData: IOhlcvData[]
}

export const TVChartContainer = ({ chartOptions, ohlcvData }: Props) => {
    const chartContainerRef =
        useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;

    useEffect(() => {
        if (chartContainerRef.current) {
            const widgetOptions: ChartingLibraryWidgetOptions = {
                symbol: chartOptions.symbol || 'DefaultSymbol',
                datafeed: dataFeed(ohlcvData),
                interval: chartOptions.interval as ResolutionString || 'D' as ResolutionString,
                container: chartContainerRef.current,
                library_path: chartOptions.library_path,
                locale: 'en',
                disabled_features: ["use_localstorage_for_settings"],
                enabled_features: ["study_templates"],
                charts_storage_url: chartOptions.charts_storage_url,
                charts_storage_api_version: chartOptions.charts_storage_api_version,
                client_id: chartOptions.client_id,
                user_id: chartOptions.user_id,
                fullscreen: chartOptions.fullscreen,
                autosize: chartOptions.autosize,
                theme: 'dark',
                timezone: 'Etc/UTC',
            };

            const tvWidget = new TradingViewWidget(widgetOptions);

            tvWidget.onChartReady(() => {
                console.log("Chart is ready");
            });

            return () => {
                tvWidget.remove();
            };
        }
    }, [chartOptions, ohlcvData]);

    return <div ref={chartContainerRef} className='h-80 md:h-96' />;
};
