'use client'
import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import BenefitsTable from './Benefits-table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
    DialogTrigger
} from '@/components/ui/dialog';

export default function PricingPageContent() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [billingPeriod, setBillingPeriod] = useState('Monthly');

    const prices = {
        Monthly: 38,
        Quarterly: 88,
        Yearly: 280
    };

    const handlePurchase = (billingPeriod: keyof typeof prices) => {
        const checkoutUrl = {
            Monthly: "https://commerce.coinbase.com/checkout/8113abe2-6c19-4017-93f6-f0118a49bc00",
            Quarterly: "https://commerce.coinbase.com/checkout/036c6266-458d-4ec2-be42-5299731b5433",
            Yearly: "https://commerce.coinbase.com/checkout/0b786f10-a63c-4523-a79a-b31f96828b08"
        }[billingPeriod];

        window.location.href = checkoutUrl;
    };

    const handleDialogOpen = (period: keyof typeof prices) => {
        setBillingPeriod(period);
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    return (
        <div>
            <div className='flex flex-col items-center justify-center gap-5'>
                <h1 className='font-semibold text-2xl text-center'>Stand one step ahead of the market</h1>
                <p className='text-center max-w-xl'>Stay ahead with our cutting-edge tools and insights. Gain access to comprehensive token lists, detailed wallet data, and extensive statistical charts. Optimize your strategies with the best data available.</p>
            </div>
            <div className='flex flex-col md:flex-row items-center justify-center gap-5 md:gap-10 mt-10'>
                <Card className="w-full md:max-w-[300px]">
                    <CardHeader>
                        <CardTitle>Monthly</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span className='font-bold text-lg'>$38</span> / 1 Month
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button className='bg-brand2' onClick={() => handleDialogOpen('Monthly')}>Get Access</Button>
                    </CardFooter>
                </Card>
                <Card className="w-full md:max-w-[300px]">
                    <CardHeader>
                        <CardTitle>Quarterly</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span className='font-bold text-lg'>$88</span> / 3 Month
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button className='bg-brand2' onClick={() => handleDialogOpen('Quarterly')}>Get Access</Button>
                    </CardFooter>
                </Card>
                <Card className="w-full md:max-w-[300px]">
                    <CardHeader>
                        <CardTitle>Yearly</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span className='font-bold text-lg'>$280</span> / 12 Month
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button className='bg-brand2' onClick={() => handleDialogOpen('Yearly')}>Get Access</Button>
                    </CardFooter>
                </Card>
            </div>
            <div className='mt-5 flex items-center justify-center'>
                <BenefitsTable className='max-w-5xl w-full' />
            </div>

            {isDialogOpen && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Purchase Plan</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            You&apos;re about to pay ${prices[billingPeriod as keyof typeof prices].toFixed(2)} for {billingPeriod.toLowerCase()} of premium features.
                            <ul className="flex flex-col items-start justify-center gap-4 my-5">
                                <li className="flex items-center justify-start gap-2 ">
                                    <Button onClick={() => handlePurchase(billingPeriod as keyof typeof prices)}>
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
                                        <input type="hidden" name="amountf" value={prices[billingPeriod as keyof typeof prices].toFixed(2)} />
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
            )}
        </div>
    );
}
