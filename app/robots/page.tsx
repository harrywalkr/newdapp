import React from 'react'

export default function Bots() {
    return (
        <div>
            <section className="max-w-4xl mx-auto shadow-md rounded-lg p-6">
                <a href="https://t.me/WatchlistDextradingBot" target="_blank" className="text-2xl font-semibold text-brand">
                    Screener Bot
                </a>
                <p className="mb-2 mt-4">
                    The Watchlist Bot is designed to help traders keep an eye on the market by tracking top tokens. It provides several benefits:
                </p>
                <ul className="list-disc list-inside space-y-4 mb-6">
                    <li className='list-outside'>Real-time notifications about price changes and trading volume spikes.</li>
                    <li className='list-outside'>Customizable watchlists to monitor your favorite cryptocurrencies.</li>
                    <li className='list-outside'>Insights into market trends to inform your trading decisions.</li>
                    <li className='list-outside'>Direct updates delivered to your Telegram, so you never miss out on crucial market movements.</li>
                </ul>
                <a href="https://t.me/Dextradingwalletbot" target="_blank" className="text-2xl font-semibold text-brand mb-4">
                    Tracking Bot
                </a>
                <p className="mb-2 mt-4">
                    Our Wallet Tracking Bot provides comprehensive monitoring of personal and significant public wallets:
                </p>
                <ul className="list-disc list-inside space-y-4">
                    <li className='list-outside'>Track transactions in and out of specified wallets in real-time.</li>
                    <li className='list-outside'>Alerts on large transactions to and from your watched wallets to catch significant market moves early.</li>
                    <li className='list-outside'>Analysis of wallet activity to identify trends and potential market shifts.</li>
                    <li className='list-outside'>Security alerts to monitor any suspicious activities on linked wallets.</li>
                </ul>
            </section>
        </div>
    )
}
