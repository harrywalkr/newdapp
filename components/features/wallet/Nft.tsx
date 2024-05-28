'use client'
import Paywall from '@/components/common/Paywall';
import { isPaidMember } from '@/services/auth.service';
import React, { useEffect, useState } from 'react'

export default function Nft() {
    const [paidMember, setPaidMember] = useState(false);
    const [loadingPaidMember, setLoadingPaidMember] = useState(true);

    useEffect(() => {
        isPaidMember().then((result) => {
            setPaidMember(result);
            setLoadingPaidMember(false);
        });
    }, []);

    if (loadingPaidMember) return <div>Checking membership status...</div>;


    return (
        <>
            {paidMember ? (
                <>
                    NFT Holdings
                    <br />
                    <span className="text-sm text-muted-foreground">
                        No Activity in NFT
                    </span>
                    <br />
                    <br />
                    NFT Trades
                    <br />
                    <span className="text-sm text-muted-foreground">
                        No Activity in NFT
                    </span>
                </>
            ) : (
                <Paywall />
            )}
        </>
    )
}
