'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAccount, useBalance, useConnect, useDisconnect, Connector } from 'wagmi';
import useTokenChainStore from '@/store';

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
    );
}
