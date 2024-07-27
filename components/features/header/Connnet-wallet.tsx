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
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCampaignStatus } from "@/services/http/campaign.http";
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import localforage from 'localforage';
import Countdown from 'react-countdown';
import { IoMdTime } from "react-icons/io";


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

  const calculateEndDate = (duration: string) => {
    const durationInDays = parseInt(duration.split(' ')[0]);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationInDays);
    return endDate;
  };

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
                  <div className="offer">
                    <Card className="mt-5">
                      <CardHeader>
                        <CardTitle>Special Offer</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <span className='text-lg line-through decoration-2'>${campaignStatus.specialOffer?.originalPrice}</span>
                        <span className='text-lg ml-2'>${campaignStatus.specialOffer?.discountedPrice}</span> / {campaignStatus.specialOffer?.discountDuration}
                        <div className="flex items-center justify-start gap-1">
                          <IoMdTime />
                          <strong>Time left:</strong>
                          <p>
                            {campaignStatus.duration && <Countdown date={calculateEndDate(campaignStatus.duration)} />}
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <li className="flex items-center justify-start gap-2">
                          <form action="https://www.coinpayments.net/index.php" method="post">
                            <input type="hidden" name="cmd" value="_pay" />
                            <input type="hidden" name="reset" value="1" />
                            <input type="hidden" name="merchant" value="b632cb0b942adad65d424d9382f957d7" />
                            <input type="hidden" name="item_name" value="Dextrading Subscription" />
                            <input type="hidden" name="currency" value="USD" />
                            <input type="hidden" name="amountf" value={campaignStatus.specialOffer?.discountedPrice} />
                            <input type="hidden" name="quantity" value="1" />
                            <input type="hidden" name="allow_quantity" value="0" />
                            <input type="hidden" name="want_shipping" value="0" />
                            <input type="hidden" name="allow_extra" value="0" />
                            <input type="image" src="https://www.coinpayments.net/images/pub/buynow-grey.png" alt="Buy Now with CoinPayments.net" />
                          </form>
                          <p>USDT-TRC20, Solana, TRX</p>
                        </li>
                      </CardFooter>
                    </Card>
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
