'use client';

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { FiCopy } from "react-icons/fi";


type Props = {
    className?: string;
} & (
        { text: string; value?: string } |
        { text?: string; value: string }
    );


export default function Copy({ text, value, className }: Props) {
    const [copied, setCopied] = useState<boolean>(false);
    const contectRef = useRef<HTMLDivElement>(null)

    const handleCopyAddress = (text: string) => () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
    };

    useEffect(() => {
        setTimeout(() => {
            setCopied(false);
        }, 1000);
    }, [copied]);

    return (
        <div className="relative">
            <div className="content flex items-center justify-start gap-2" ref={contectRef}>
                {
                    text &&
                    <span className={clsx(className)}>
                        {text}
                    </span>
                }
                <FiCopy
                    onClick={handleCopyAddress(value ? value! : text!)}
                    className="cursor-pointer text-sm"
                />
            </div>
            <div
                className="absolute top-2 bg-background rounded-sm shadow-sm p-1 transition-all ease-in-out duration-200"
                style={{ left: `${contectRef.current?.clientWidth! + 10}px`, opacity: `${copied ? '1' : '0'}` }}
            >
                <p>copied</p>
            </div>
        </div>
    )
}
