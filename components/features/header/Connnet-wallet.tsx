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
import localforage from 'localforage';

interface CampaignStatus {
  name?: string;
  description?: string;
  duration?: string;
  specialOffer?: {
    originalPrice: number;
    discountedPrice: number;
    discountDuration: string;
  };
  eligibility: {
    isEligible: boolean;
  };
}

export default function ConnectWalletButton() {
  const { open } = useWeb3Modal();
  const { isConnected, address } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const { width, height } = useWindowSize();

  const { data: campaignStatus, refetch } = useQuery<CampaignStatus>({
    queryKey: ['campaignStatus', address],
    queryFn: () => getCampaignStatus({ params: { address: address } }),
    enabled: false
  });

  useEffect(() => {
    const checkCampaignStatus = async () => {
      if (isConnected && address) {
        const storedCampaignStatus = await localforage.getItem('campaignStatus');
        if (!storedCampaignStatus) {
          refetch().then((result) => {
            if (result.data?.eligibility.isEligible) {
              setIsOpen(true);
              localforage.setItem('campaignStatus', result.data);
            }
          });
        }
      }
    };

    checkCampaignStatus();
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
                <>
                  <h2>{campaignStatus.name}</h2>
                  <p>{campaignStatus.description}</p>
                  <p><strong>Duration:</strong> {campaignStatus.duration}</p>
                  <div className="offer">
                    <h3>Special Offer</h3>
                    <p><strong>Original Price:</strong> {campaignStatus.specialOffer?.originalPrice}</p>
                    <p><strong>Discounted Price:</strong> {campaignStatus.specialOffer?.discountedPrice}</p>
                  </div>
                </>
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
