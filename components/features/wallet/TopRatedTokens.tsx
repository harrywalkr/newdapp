'use client'
import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { WalletSummaryType } from "@/types/wallet-summary.type";

interface Props {
    walletSummary: WalletSummaryType
}


const COLORS = ["#FF8042", "#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const TopRatedTokens: React.FC<Props> = ({ walletSummary }) => {
    const [showAll, setShowAll] = useState(false);
    const [copied, setCopied] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopied(false);
                setCopiedIndex({}); // Reset copiedIndex
            }, 1000);
        }
    }, [copied]);

    const calculateTotalFee = () => {
        return walletSummary.TotalFee || 0;
    };

    const renderTokenNames = (tokens: any[], isTop20: boolean) => {
        const displayTokens = showAll ? tokens : tokens.slice(0, 2);

        return displayTokens.map((token: any, index: number) => (
            <div className="relative mb-2" key={index}>
                <span
                    className={`rounded-full ${isTop20
                        ? "bg-gradient-to-r from-yellow-200 via-orange-300 to-yellow-300"
                        : "bg-gray-200"
                        } px-3 py-1 text-sm font-semibold text-gray-700 mr-2 cursor-pointer`}
                    onClick={() =>
                        handleCopyAddress(
                            token["Currency Address"],
                            isTop20 ? `top20_${index}` : `hot_${index}`
                        )
                    }
                    onMouseEnter={() => handleMouseEnter(index, isTop20)}
                    onMouseLeave={() => handleMouseLeave(index, isTop20)}
                >
                    {token.tokenName} Holder
                </span>
                {copied &&
                    copiedIndex[isTop20 ? `top20_${index}` : `hot_${index}`] === index && (
                        <div className="tooltip absolute top-[-30px] left-1/2 transform -translate-x-1/2 text-xs text-gray-700 whitespace-nowrap">
                            Address Copied
                        </div>
                    )}
            </div>
        ));
    };

    const handleCopyAddress = (text: string, identifier: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setCopiedIndex({ [identifier]: parseInt(identifier.split("_")[1]) });
    };

    const handleShowAll = () => {
        setShowAll(true);
    };

    const handleMouseEnter = (index: number, isTop20: boolean) => {
        setCopiedIndex({ [isTop20 ? `top20_${index}` : `hot_${index}`]: index });
    };

    const handleMouseLeave = (_index: number, _isTop20: boolean) => {
        setCopiedIndex({});
    };

    const processDataForPieChart = () => {
        const tokens = walletSummary!.Top20HotTokenHolders!.concat(walletSummary.HotTokenHolders);
        return tokens.map((token: any, index: number) => ({
            name: token.tokenName,
            value: 20,
            // value: token.value,
        }));
    };

    return (
        <div>
            <div className="flex flex-wrap">
                {walletSummary.Top20HotTokenHolders && renderTokenNames(walletSummary.Top20HotTokenHolders, true)}
                {walletSummary.Top20HotTokenHolders && walletSummary.Top20HotTokenHolders.length > 2 && !showAll && (
                    <span
                        className="cursor-pointer rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
                        onClick={handleShowAll}
                    >
                        ...
                    </span>
                )}

                {walletSummary.HotTokenHolders && renderTokenNames(walletSummary.HotTokenHolders, false)}
                {walletSummary.HotTokenHolders && walletSummary.HotTokenHolders.length > 2 && !showAll && (
                    <span
                        className="cursor-pointer rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
                        onClick={handleShowAll}
                    >
                        ...
                    </span>
                )}
            </div>
            <div className="mt-4">
                <PieChart width={300} height={300}>

                    <Pie
                        data={processDataForPieChart()}
                        cx={120}
                        cy={120}
                        labelLine={false}
                        label={({ name }) => name}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {processDataForPieChart().map((_, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </div>
        </div>
    );
};

export default TopRatedTokens;
