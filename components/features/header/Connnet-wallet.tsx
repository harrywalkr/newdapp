"use client";

import { Button } from "@/components/ui/button";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { LuWallet } from "react-icons/lu";

export default function ConnectButton() {
  const { open } = useWeb3Modal();

  return (
    <>
      <Button variant="secondary" size="icon" onClick={() => open()}>
        <LuWallet />
      </Button>
    </>
  );
}
