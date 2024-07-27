import React from 'react';
import { Metadata } from 'next';
import PricingPageContent from '@/components/features/pricinig/PricingPageContent';

export const metadata: Metadata = {
    title: "Pricing Page - Dextrading",
    description: "Explore our pricing plans and find the perfect solution for your needs. Affordable and flexible pricing options for businesses of all sizes.",
};

const PricingPage = () => {
    return (
        <PricingPageContent />
    );
}

export default PricingPage;
