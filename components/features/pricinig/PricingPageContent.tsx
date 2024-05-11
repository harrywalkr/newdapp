'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/card'; // Assume these are available
import Tab from '../blog/tab';

const PricingPageContent = () => {
    const [billingPeriod, setBillingPeriod] = useState('Monthly');
    const tabItems = ['Monthly', 'Quarterly', 'Yearly'];

    const prices = {
        Monthly: 29.99,
        Quarterly: 79.99,
        Yearly: 299.99
    };

    const handleTabClick = (tab: string) => {
        setBillingPeriod(tab);
    };

    return (
        <div className="container mx-auto p-4">
            <Tab tabItems={tabItems} onClick={handleTabClick} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Free Tier Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Free Tier</CardTitle>
                        <CardDescription>Access to basic features</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Basic support</p>
                        <p>5 projects</p>
                    </CardContent>
                    <CardFooter>
                        <p>$0/month</p>
                    </CardFooter>
                </Card>

                {/* Paid Tier Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Premium Tier</CardTitle>
                        <CardDescription>All premium features included</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Priority support</p>
                        <p>Unlimited projects</p>
                        <p>Advanced analytics</p>
                    </CardContent>
                    <CardFooter>
                        <p>${prices[billingPeriod].toFixed(2)} {billingPeriod}</p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default PricingPageContent;
