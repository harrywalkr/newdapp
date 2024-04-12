'use client';

import { useEffect, useRef, useState } from "react";
import { FiCopy } from "react-icons/fi";

export default function Copy({ text }: { text?: string }) {
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
            {text &&
                <div className="content flex items-center justify-start gap-2" ref={contectRef}>
                    <span>
                        {text}
                    </span>
                    <FiCopy
                        onClick={handleCopyAddress(text)}
                        className="cursor-pointer text-lg"
                    />
                </div>
            }
            {/* {copied && */}
            <div
                className="absolute top-0 bg-background rounded-sm shadow-sm p-1 transition-all ease-in-out duration-200"
                style={{ left: `${contectRef.current?.clientWidth! + 10}px`, opacity: `${copied ? '1' : '0'}` }}
            >
                <p>copied</p>
            </div>
            {/* } */}
        </div>
    )
}
