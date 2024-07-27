"use client";

import { Button } from "@/components/ui/button";
import { minifyContract } from "@/utils/truncate";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { LuWallet } from "react-icons/lu";
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog";
import { getCampaignStatus } from "@/services/http/campaign.http";
import { ICampaign } from "@/types/campaign.type";

export default function ConnectWalletButton() {
  const { open } = useWeb3Modal();
  const { isConnected, address } = useAccount();
  const [isEligible, setIsEligible] = useState(false);
  const [campaignStatus, setCampaignStatus] = useState<ICampaign>();

  useEffect(() => {
    const fetchCampaignStatus = async () => {
      if (isConnected && address) {
        try {
          const campaign = await getCampaignStatus();
          if (campaign.eligibility.isEligible) {
            setIsEligible(true);
            setCampaignStatus(campaign);
            localStorage.setItem('campaignStatus', JSON.stringify(campaign));
          }
        } catch (error) {
          console.error("Failed to fetch campaign status:", error);
        }
      }
    };

    fetchCampaignStatus();
  }, [isConnected, address]);

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
            isConnected && address ? (
              <>
                {minifyContract(address)}
              </>
            ) : (
              <>
                Connect
              </>
            )
          }
        </h3>
      </Button>

      {isEligible && (
        <AlertDialog>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Congratulations!</AlertDialogTitle>
              <AlertDialogDescription>
                You are eligible for our special campaign offer!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
