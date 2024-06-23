import React from 'react';
import { AiOutlineSafety } from "react-icons/ai";
import { GiDeathSkull } from "react-icons/gi";
import { IoWarningOutline } from "react-icons/io5";
import clsx from 'clsx';

interface RenounceProps {
    active: boolean;
    text: string;
    status: string;
}

const Renounce: React.FC<RenounceProps> = ({ active, text, status }) => (
    <div className="flex items-center justify-start gap-5">
        <div>
            {status && (
                <div className="flex items-center gap-4">
                    <div className='flex items-center justify-start gap-2'>
                        <div className='flex items-center justify-start gap-1'>
                            <div>
                                {status === "Safe" ? (
                                    <Success />
                                ) : status === "Currently Safe" ? (
                                    <Warning />
                                ) : (
                                    <Error />
                                )}
                            </div>
                            <div
                                className={clsx(
                                    "px-2 py-1 text-sm rounded-md whitespace-nowrap flex justify-center items-center",
                                    {
                                        "text-green-700 bg-green-200": status === "Safe",
                                        "text-orange-500 bg-orange-200": status === "Currently Safe",
                                        "text-red-700 bg-red-200": status !== "Safe" && status !== "Currently Safe"
                                    }
                                )}
                            >
                                {status}
                            </div>
                        </div>
                        <h1
                            className={clsx(
                                "text-base",
                                {
                                    "text-success": status === "Safe",
                                    "text-orange-500": status === "Currently Safe",
                                    "text-red-700": status !== "Safe" && status !== "Currently Safe"
                                }
                            )}
                        >Audit by Dextrading.com</h1>
                    </div>
                </div>
            )}
            <div className="flex items-center justify-start gap-2">
                <div
                    className={clsx(
                        "animate-ping w-[8px] h-[8px] rounded-full mr-1",
                        { "bg-success": active, "bg-error": !active }
                    )}
                ></div>
                <span className="font-medium text-sm">{text}</span>
            </div>
        </div>
    </div>
);

const Success = () => <AiOutlineSafety className='w-7 h-7 bg-[#69F0AE] text-gray-700 rounded-full p-[4px]' />

const Warning = () => <IoWarningOutline className='w-7 h-7 bg-orange-400 text-gray-700 rounded-full p-[4px]' />

const Error = () => <GiDeathSkull className='w-7 h-7 bg-red-500 rounded-full text-gray-700 p-[4px]' />

export default Renounce;
