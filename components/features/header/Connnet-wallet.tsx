"use client";

import { Button } from "@/components/ui/button";
import { minifyContract } from "@/utils/truncate";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { LuWallet } from "react-icons/lu";
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { getCampaignStatus } from "@/services/http/campaign.http";
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import { ICampaign } from "@/types/campaign.type";


export default function ConnectWalletButton() {
  const { open } = useWeb3Modal();
  const { isConnected, address } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const { width, height } = useWindowSize();

  const { data: campaignStatus, refetch } = useQuery<ICampaign>({
    queryKey: ['campaignStatus', address],
    queryFn: () => getCampaignStatus({ params: { address: address } }),
    enabled: false,
  });

  useEffect(() => {
    if (isConnected && address) {
      refetch().then((result) => {
        if (result.data?.eligibility.isEligible) {
          setIsOpen(true);
          localStorage.setItem('campaignStatus', JSON.stringify(result.data));
        }
      });
    }
  }, [isConnected, address, refetch]);

  return (
    <>
      <Button
        variant="secondary"
        size="icon"
        className="h-9 w-9 md:h-10 md:w-10 lg:h-11 lg:w-auto flex items-center justify-center gap-3"
        onClick={() => open()}
      >
        <LuWallet className="text-base md:text-lg md:ml-5" />
        <h3 className="hidden lg:block md:mr-5">
          {isConnected && address ? minifyContract(address) : "Connect"}
        </h3>
      </Button>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Congratulations!</AlertDialogTitle>
            <AlertDialogDescription>
              {campaignStatus?.name && (
                <span>You are eligible for {campaignStatus.name}!</span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {isOpen && (
        <Confetti width={width} height={height} />
      )}
    </>
  );
}
