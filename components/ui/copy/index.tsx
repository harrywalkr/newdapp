'use client'
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { FiCopy } from "react-icons/fi";
import Link from 'next/link';

type Props = {
    className?: string;
    link?: boolean;
    href?: string;
} & (
        { text: string; value?: string } |
        { text?: string; value: string }
    );

export default function Copy({ text, value, className, link, href }: Props) {
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
                {link && href ? (
                    <Link href={href} passHref>
                        {content}
                    </Link>
                ) : content}
            </div>
            <div
                className="cursor-pointer text-sm"
                onClick={() => handleCopyAddress(value ? value : text!)}
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
