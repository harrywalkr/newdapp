'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAccount, useBalance, useConnect, useDisconnect, Connector } from 'wagmi';
import useTokenChainStore from '@/store';
import { minifyContract } from "@/utils/truncate";

interface Transaction {
    hash: string;
    value: string;
}

interface TokenInfo {
    address: string;
    name: string;
}

interface GasPrice {
    ProposeGasPrice: string;
}

export default function ProfileWallet() {
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();
    const { isConnected, address } = useAccount();
    const { availableChains, selectedChain, setSelectedChain } = useTokenChainStore();
    const { data: balanceData } = useBalance({
        address: address,
    });

    // State for additional user data
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [token, setToken] = useState<AddressInfo>();
    const [gasPrice, setGasPrice] = useState<GasPrice | null>(null);

    // Fetch transactions when address changes
    useEffect(() => {
        if (address) {
            axios.get(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`)
                .then(response => setTransactions(response.data.result))
                .catch(console.error);
        }
    }, [address]);

    // Fetch token balances when address changes
    useEffect(() => {
        if (address) {
            axios.get(`https://api.ethplorer.io/getAddressInfo/${address}?apiKey=freekey`)
                .then(response => setToken(response.data.tokens))
                .catch(console.error);
        }
    }, [address]);

    // Fetch current gas prices
    useEffect(() => {
        axios.get(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`)
            .then(response => setGasPrice(response.data.result))
            .catch(console.error);
    }, []);

    return (
        // <div>
        //     

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <Card className="w-full h-60">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Wallets
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        {isConnected ? (
                            <>
                                <div
                                    className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
                                >
                                    <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
                                        <div>
                                            {/* <link.icon className="mr-2 h-4 w-4" /> */}
                                            {/* {link.title}
                                                    {link.label && (
                                                        <span
                                                            className={cn(
                                                                "ml-auto",
                                                                link.variant === "default" &&
                                                                "text-background dark:text-white"
                                                            )}
                                                        >
                                                            {link.label}
                                                        </span>
                                                    )} */}
                                            <p>Address: {minifyContract(address!)}</p>
                                        </div>
                                    </nav>
                                </div>
                            </>

                        ) : (
                            connectors.map((connector) => (
                                <button key={connector.id} onClick={() => connect({ connector })}>
                                    Connect with {connector.name}
                                </button>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
            <Card className="md:col-span-2 lg:col-span-3">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Trades
                    </CardTitle>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                    >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                </CardHeader>
                <CardContent>
                    <div>
                        {isConnected ? (
                            <div>
                                <p>Address: {address}</p>
                                <p>Balance: {balanceData?.formatted} {balanceData?.symbol}</p>
                                <p>Connected Network: {selectedChain?.name}</p>
                                <p>Current Gas Price: {gasPrice?.ProposeGasPrice} Gwei</p>
                                <div>
                                    {/* FIXME: api key for transactions dont work. may take some time ¯\_(ツ)_/¯ */}
                                    <h3>Recent Transactions:</h3>
                                    {/* {transactions.map(tx => (
                                        <div key={tx.hash}>
                                            <p>{tx.hash} - {tx.value} ETH</p>
                                        </div>
                                    ))} */}
                                </div>
                                <div>
                                    <h3>Token Holdings:</h3>
                                    {token && <div>
                                        <p>{token.address}: {token.ETH?.balance}</p>
                                        <p>contract address: {token.contractInfo?.creatorAddress}</p>
                                        <p>contract TX hash: {token.contractInfo?.transactionHash}</p>
                                        <p>contract timestamp: {token.contractInfo?.timestamp}</p>
                                        {/* FIXME: apply typing to http reqs */}
                                        {/* FIXME: move types to their own files and also fix them. they are not accurate */}
                                        {/* FIXME: move reqs to its own file and folder */}
                                    </div>
                                    }
                                </div>
                                <button onClick={() => disconnect()}>Disconnect Wallet</button>
                            </div>
                        ) : (
                            <div>
                                {connectors && connectors.map((connector: Connector) => (
                                    <button key={connector.id} onClick={() => connect({ connector })}>
                                        Connect with {connector.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>


        </div >
    );
}
