'use client'
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useBalance, useConnect, useDisconnect } from 'wagmi';
import React from 'react';

export default function Profile() {
  // Connect to the wallet
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  // Get account details
  const { address, isConnected } = useAccount();

  // Get balance for the connected account
  const { data: balanceData } = useBalance({
    address: address,
  });

  return (
    <div>
      {isConnected ? (
        <div>
          <p>Address: {address}</p>
          <p>Balance: {balanceData?.formatted} {balanceData?.symbol}</p>
          <button onClick={() => disconnect()}>Disconnect Wallet</button>
        </div>
      ) : (
        <div>
          {connectors.map((connector) => (
            <button key={connector.id} onClick={() => connect({ connector })}>
              Connect with {connector.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
