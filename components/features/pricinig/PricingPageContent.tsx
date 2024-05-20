'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import Tab from '@/components/ui/tab';

const PricingPageContent = () => {
    const [billingPeriod, setBillingPeriod] = useState('Monthly');
    const tabItems = ['Monthly', 'Quarterly', 'Yearly'];

    const prices = {
        Monthly: 23,
        Quarterly: 19,
        Yearly: 16
    };

    const handleTabClick = (tab: string) => {
        setBillingPeriod(tab);
    };
    const handlePurchase = (price: number) => {
        const checkoutUrl = {
            Monthly: "https://commerce.coinbase.com/checkout/8113abe2-6c19-4017-93f6-f0118a49bc00",
            Quarterly: "https://commerce.coinbase.com/checkout/036c6266-458d-4ec2-be42-5299731b5433",
            Yearly: "https://commerce.coinbase.com/checkout/0b786f10-a63c-4523-a79a-b31f96828b08"
        }[billingPeriod as keyof typeof prices];

        window.location.href = checkoutUrl;
    };

    const totalPayment = (price: number) => {
        switch (billingPeriod) {
            case "Quarterly":
                return price * 3;
            case "Yearly":
                return price * 12;
            default:
                return price;
        }
    };

    return (
        <div className='flex flex-col items-center justify-center'>
            <Tab tabItems={tabItems} onClick={handleTabClick} className='w-full md:w-auto' />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 max-w-xl w-full">
                {/* Free Tier Card */}
                <div className='flex items-start justify-end w-full'>
                    <Card className='w-full max-w-96 min-h-72 md:min-h-80 flex flex-col items-start justify-between'>
                        <CardHeader>
                            <p>$0/month</p>
                            <CardTitle>Free Tier</CardTitle>
                            <CardDescription>Access to basic features</CardDescription>
                        </CardHeader>
                        <CardContent className='flex flex-col gap-3'>
                            <p>Basic support</p>
                            <p>5 projects</p>
                            <Button variant='outline' disabled className='mt-6'>Current Plan</Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Paid Tier Card */}
                <div className='flex items-start justify-start'>
                    <Card className='w-full max-w-96 min-h-72 md:min-h-80 flex flex-col items-start justify-between'>
                        <CardHeader>
                            <p>${totalPayment(prices[billingPeriod as keyof typeof prices]) + ' / ' + billingPeriod}</p>
                            <CardTitle>Premium Tier</CardTitle>
                            <CardDescription>All premium features included</CardDescription>
                        </CardHeader>
                        <CardContent className='flex flex-col gap-3'>
                            <p>Priority support</p>
                            <p>Unlimited projects</p>
                            <p>Advanced analytics</p>
                            <Dialog>
                                <DialogTrigger className='bg-primary text-primary-foreground rounded-sm p-2  mt-6'>
                                    Purchase Plan
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Purchase Plan</DialogTitle>
                                    </DialogHeader>
                                    <DialogDescription>
                                        You&apos;re about to pay ${prices[billingPeriod as keyof typeof prices].toFixed(2)} for {billingPeriod.toLowerCase()} of premium features.
                                        <ul className="flex flex-col items-start justify-center gap-4 my-5">
                                            <li className="flex items-center justify-start gap-2 ">
                                                <Button onClick={() => handlePurchase(prices[billingPeriod as keyof typeof prices])}>
                                                    Pay with Coinbase
                                                </Button>
                                                <p>BTC, ETH, Matic, ...</p>
                                            </li>
                                            <li className="flex items-center justify-start gap-2">
                                                <form action="https://www.coinpayments.net/index.php" method="post">
                                                    <input type="hidden" name="cmd" value="_pay" />
                                                    <input type="hidden" name="reset" value="1" />
                                                    <input type="hidden" name="merchant" value="b632cb0b942adad65d424d9382f957d7" />
                                                    <input type="hidden" name="item_name" value="Dextrading Subscription" />
                                                    <input type="hidden" name="currency" value="USD" />
                                                    <input type="hidden" name="amountf" value={totalPayment(prices[billingPeriod as keyof typeof prices])} />
                                                    <input type="hidden" name="quantity" value="1" />
                                                    <input type="hidden" name="allow_quantity" value="0" />
                                                    <input type="hidden" name="want_shipping" value="0" />
                                                    <input type="hidden" name="allow_extra" value="0" />
                                                    <input type="image" src="https://www.coinpayments.net/images/pub/buynow-grey.png" alt="Buy Now with CoinPayments.net" />
                                                </form>
                                                <p>USDT-TRC20, Solana, TRX</p>
                                            </li>
                                        </ul>
                                    </DialogDescription>
                                    <DialogFooter className="sm:justify-start flex flex-row gap-2 items-center">
                                        <DialogClose asChild>
                                            <Button type="button" variant="secondary">
                                                Close
                                            </Button>
                                        </DialogClose>
                                        <a href="mailto:support@dextrading.com" className="text-sm" target="_blank">
                                            Contact support for help
                                        </a>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                </div>
            </div>

        </div>
    );
};

export default PricingPageContent;
