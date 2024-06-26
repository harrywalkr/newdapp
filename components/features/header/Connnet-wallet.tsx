"use client";

import { Button } from "@/components/ui/button";
import { minifyContract } from "@/utils/truncate";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { LuWallet } from "react-icons/lu";
import { useAccount, useConnect, useReadContract } from 'wagmi'

export default function ConnectWalletButton() {
  const { open } = useWeb3Modal();
  const { isConnected, address } = useAccount();

  return (
    <>
      <Button
        variant="secondary"
        size="icon"
        className="h-9 w-9 md:h-10 md:w-10 lg:h-11 lg:w-auto flex items-center justify-center gap-3 "
        onClick={() => open()}
      >
        <LuWallet className="text-base md:text-lg md:ml-5" />
        <h3 className="hidden lg:block md:mr-5">
          {
            isConnected && address ? <>
              {minifyContract(address)}
            </> : <>
              Connect
            </>
          }
        </h3>
      </Button>
    </>
  );
}
