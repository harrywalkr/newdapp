import styles from "./index.module.css";
import { useEffect, useRef } from "react";
import { ChartingLibraryWidgetOptions, LanguageCode, ResolutionString, widget } from "@/public/static/charting_library";

export const TVChartContainer = (props: Partial<ChartingLibraryWidgetOptions>) => {
    const chartContainerRef =
        useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;

    useEffect(() => {
        const widgetOptions: ChartingLibraryWidgetOptions = {
            symbol: props.symbol,
            // BEWARE: no trailing slash is expected in feed URL
            datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(
                "https://demo_feed.tradingview.com",
                undefined,
                {
                    maxResponseLength: 1000,
                    expectedOrder: "latestFirst",
                }
            ),
            interval: props.interval as ResolutionString,
            container: chartContainerRef.current,
            library_path: props.library_path,
            locale: props.locale as LanguageCode,
            disabled_features: ["use_localstorage_for_settings", 'header_resolutions', 'header_widget', "header_symbol_search", "header_settings", "left_toolbar", "control_bar", "timeframes_toolbar", "legend_widget", "context_menus", 'widget_logo'],
            enabled_features: [],
            charts_storage_url: props.charts_storage_url,
            charts_storage_api_version: props.charts_storage_api_version,
            client_id: props.client_id,
            user_id: props.user_id,
            fullscreen: props.fullscreen,
            autosize: props.autosize,
            theme: 'dark',
            timezone: 'Asia/Bangkok',
            

            // debug: true,
        };

        const tvWidget = new widget(widgetOptions);
        // tvWidget.setSymbol('Binance:GALAUSDT', 2222, () => {

        // })

        tvWidget.onChartReady(() => {
            tvWidget.headerReady().then(() => {
                const button = tvWidget.createButton();
                button.setAttribute("title", "Click to show a notification popup");
                button.classList.add("apply-common-tooltip");
                button.addEventListener("click", () =>
                    tvWidget.showNoticeDialog({
                        title: "Notification",
                        body: "TradingView Charting Library API works correctly",
                        callback: () => {
                            console.log("Noticed!");
                        },
                    })
                );
                button.innerHTML = "Check API";
            }).catch(err => console.log('err hello err hello  err hello  err hello  err hello  '))
        });

        return () => {
            tvWidget.remove();
        };
    }, [props]);

    return (
        <div ref={chartContainerRef} className='h-80' />
    );
};