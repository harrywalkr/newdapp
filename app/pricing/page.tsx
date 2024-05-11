import React from 'react';
import Head from 'next/head';
import PricingPageContent from '@/components/features/pricinig/PricingPageContent';

//FIXME: config title and description meta tag

const PricingPage = () => {
    return (
        <>
            <Head>
                <title>Pricing - Dextrading</title>
                <meta name="description" content="Explore our flexible pricing options to find the plan that best fits your needs." />
            </Head>
            <PricingPageContent />
        </>
    );
}

export default PricingPage;
