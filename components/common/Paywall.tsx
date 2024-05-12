import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Paywall() {
    return (
        <div className="rounded-lg text-center max-w-md mx-auto flex flex-col gap-5">
            <h2 className="text-2xl font-semibold">Access Premium Content</h2>
            <p className="mb-6">
                You&apos;ve reached a premium area that&apos;s reserved for our subscribers. Unlock this content and enjoy a wealth of resources tailored to meet your needs.
            </p>
            <ul className="mb-6 flex flex-col gap-2 items-start justify-start max-w-md list-disc list-inside ">
                <li>Exclusive insights and tools.</li>
                <li>Advanced analytics and reports.</li>
                <li>Continued access to our expert content.</li>
            </ul>
            <div className="flex items-center justify-center gap-2">
                <Button onClick={() => window.location.href = '/pricing'} variant="default">
                    View Subscription Plans
                </Button>
                <Button onClick={() => window.location.href = '/login'} variant="outline">
                    login
                </Button>
            </div>
            <p className="mt-4 text-sm text-gray-600">
                Learn more about our <Link href="/pricing" className="underline text-blue-600">pricing options</Link> and find the plan that best suits your needs.
            </p>
        </div>
    );
}
