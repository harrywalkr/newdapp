"use client";
import PriceFormatter from "@/utils/PriceFormatter";
import { separate3digits } from "@/utils/numbers";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Copy from "@/components/ui/copy";
import { minifyContract } from "@/utils/truncate";
import { ImageType } from "@/types/Image.type";
import { Balance } from "@/types/swap.type";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, UpdateIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


interface WalletPortfolioHistoryProps {
    images: ImageType[];
    walletSwaps: Balance[];
}

interface RecordProps {
    data: any;
    images: { imageUrl: string }[];
    id: number;
}

export default function WalletPortfolioHistory({ images, walletSwaps }: WalletPortfolioHistoryProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(10);

    const totalPages = Math.ceil(walletSwaps.length / recordsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const currentRecords = walletSwaps.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
    );

    return (
        <div className="mt-8 flex flex-col items-end justify-center">
            <Table>
                <TableHeader>
                    <TableRow>
                        {["Rank", "Symbol", 'Token Name', "Type", "Balance", "Price", "Buy Amount (USD)", "Entry Price", "Sell Amount (USD)", "Current Value", "Live P&L"].map((header) => (
                            <TableHead key={header} className="text-center">{header}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentRecords?.map((item, idx) => (
                        <Record key={idx} id={idx + (currentPage - 1) * recordsPerPage} data={item} images={images} />
                    ))}
                </TableBody>
            </Table>
            <div className="flex justify-center gap-2 mt-4">
                <Button variant='outline' size='icon'
                    disabled={currentPage === 1}
                    onClick={handlePrevPage}
                >
                    <ChevronLeftIcon />
                </Button>
                <Button variant='outline' size='icon'
                    disabled={currentPage === totalPages}
                    onClick={handleNextPage}
                >
                    <ChevronRightIcon />
                </Button>
            </div>
        </div>
    );
}

const Record = ({ data, images, id }: RecordProps) => {
    const [image, setImage] = useState<string>("");

    const type = useMemo(() => {
        switch (data.balanceType) {
            case "notClosedPositions":
                return "Open";
            case "partiallyClosedPositions":
                return "Partially Closed";
            default:
                return "Closed";
        }
    }, [data.balanceType]);

    useEffect(() => {
        if (image) return;
        const matchedImage = images.find((img) => img.imageUrl.includes(data["Currency Address"]));
        if (matchedImage) {
            setImage(matchedImage.imageUrl);
        }
    }, [images, data["Currency Address"], image]);

    const watchInit = useMemo(() => {
        const watches = JSON.parse(localStorage.getItem("WATCH") || "[]");
        return watches.some((watchItem: any) => watchItem.name === data.tokenName);
    }, [data.tokenName]);

    const [watch, setWatch] = useState(watchInit);

    useEffect(() => {
        const id = setInterval(() => {
            const watches = JSON.parse(localStorage.getItem("WATCH") || "[]");
            setWatch(watches.some((w: any) => w.name === data.tokenName));
        }, 1000);

        return () => {
            clearInterval(id);
        };
    }, [data.tokenName]);

    const handleSaveToken = () => {
        const watches = JSON.parse(localStorage.getItem("WATCH") || "[]");
        const index = watches.findIndex((watchItem: any) => watchItem.name === data.tokenName);

        if (index === -1) {
            watches.push({ name: data.tokenName });
        } else {
            watches.splice(index, 1);
        }

        localStorage.setItem("WATCH", JSON.stringify(watches));
        setWatch(index === -1);
    };

    const baseContentClass = "text-center";

    return (
        <TableRow>
            <TableCell className={baseContentClass}>
                <div className="flex justify-center items-center gap-2">
                    <span>{id}</span>
                    {!watch ? (
                        <AiOutlineStar className="cursor-pointer" size={20} onClick={handleSaveToken} />
                    ) : (
                        <AiFillStar className="cursor-pointer" size={20} onClick={handleSaveToken} />
                    )}
                </div>
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-2">
                    <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                            <Avatar >
                                <AvatarImage
                                    src={image}
                                    alt={data.tokenName}
                                />
                                <AvatarFallback>
                                    {data.tokenName.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                    <div className="flex space-x-2 items-center">
                        <Copy text={minifyContract(data["Currency Address"])} value={data["Currency Address"]} />
                    </div>
                </div>
            </TableCell>
            <TableCell className={baseContentClass}>
                {data.tokenName}
            </TableCell>
            <TableCell className={`${baseContentClass} p-2 rounded-lg ${type === "Open" || type === "Closed" ? "bg-success/80" : "bg-success/60"} text-base-100 max-w-[150px] whitespace-nowrap`}>
                {type}
            </TableCell>
            <TableCell className={baseContentClass}>{separate3digits(data.Balance.toFixed(2))}</TableCell>
            <TableCell className={baseContentClass}><PriceFormatter value={data.tokenPrice || 0} /></TableCell>
            <TableCell className={baseContentClass}>${separate3digits(data["Buy Amount (USD)"].toFixed(2))}</TableCell>
            <TableCell className={baseContentClass}><PriceFormatter value={data["Entry Price"] || 0} /></TableCell>
            <TableCell className={baseContentClass}>${separate3digits(data["Sell Amount (USD)"].toFixed(2))}</TableCell>
            <TableCell className={baseContentClass}><PriceFormatter value={data.currentValue || 0} /></TableCell>
            <TableCell className={`${baseContentClass} ${data.Profit > 0 ? "text-success" : "text-error"}`}>${separate3digits(data.Profit.toFixed(2))}</TableCell>
        </TableRow>
    );
};
