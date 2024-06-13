'use client'
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { FiCopy } from "react-icons/fi";
import Link from 'next/link';
import { stopPropagation } from "@/utils/stopPropagation";

type Props = {
    className?: string;
    href?: string;
    target?: 'blank';
} & (
        { text: string; value?: string } |
        { text?: string; value: string }
    );

export default function Copy({ text, value, className, href, target }: Props) {
    const [copied, setCopied] = useState<boolean>(false);
    const contectRef = useRef<HTMLDivElement>(null);

    const handleCopyAddress = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
    };

    useEffect(() => {
        let timer = setTimeout(() => {
            setCopied(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, [copied]);

    const content = (
        <div className="content flex items-center justify-start gap-2" ref={contectRef}>
            {text &&
                <span className={clsx(className)}>
                    {text}
                </span>
            }
        </div>
    );

    return (
        <div className="relative content flex items-center justify-start gap-2">
            <div ref={contectRef}>
                {href ? (
                    <Link href={href} target={target} passHref>
                        {content}
                    </Link>
                ) : content}
            </div>
            <div
                className="cursor-pointer text-sm"
                onClick={(e) => { stopPropagation(e); handleCopyAddress(value ? value : text!) }}
            >
                <FiCopy
                />
            </div>
            <div
                className="absolute top-2 bg-background rounded-sm shadow-sm p-1 transition-all ease-in-out duration-200"
                style={{ left: `${contectRef.current?.clientWidth! + 15}px`, opacity: `${copied ? '1' : '0'}` }}
            >
                <p>copied</p>
            </div>
        </div>
    );
}
