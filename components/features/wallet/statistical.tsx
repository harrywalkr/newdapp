'use client'
import Paywall from '@/components/common/Paywall';
import { isPaidMember } from '@/services/auth.service';
import React, { useEffect, useState } from 'react'
import WalletStatistical from './WalletStatistical-old-dex/WalletStatistical';
import { WalletSummaryType } from '@/types/wallet-summary.type';

interface Props {
    walletInfo: WalletSummaryType
    walletAddress: string
}

export default function Statistical({ walletInfo, walletAddress }: Props) {
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
                <WalletStatistical walletInfo={walletInfo} walletAddress={walletAddress} />
            ) : (
                <Paywall />
            )}
        </>
    )
}
