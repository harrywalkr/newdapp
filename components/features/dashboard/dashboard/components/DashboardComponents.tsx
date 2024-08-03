"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import clsx from 'clsx';

export function ConnectWalletMessage() {
    const { open } = useWeb3Modal();

    return (
        <div className="flex flex-col items-center justify-center gap-2 my-5">
            <Button variant="outline" onClick={() => open()}>
                Connect with wallet to see info
            </Button>
        </div>
    );
}

interface DashboardCardProps {
    title: string;
    iconPath: string;
    children: React.ReactNode;
    classNames?: string;
}

export function DashboardCard({
    title,
    iconPath,
    children,
    classNames,
}: DashboardCardProps) {
    return (
        <Card className={clsx('w-full h-full', classNames)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                >
                    <path d={iconPath} />
                </svg>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}
