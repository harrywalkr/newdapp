'use client';

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { FiCopy } from "react-icons/fi";
import { Button } from "../button";

interface Props {
    text: string, value?: string, className?: string
}

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
                <span className={clsx(className)}>
                    {text}
                </span>
                <Button variant={'ghost'} size={'icon'}>

                    <FiCopy
                        onClick={handleCopyAddress(value ? value : text)}
                        className="cursor-pointer text-base"
                    />
                </Button>
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
