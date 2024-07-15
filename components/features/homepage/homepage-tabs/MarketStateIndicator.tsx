import React from 'react';
import { motion } from 'framer-motion';

interface Props {
    percentage: number;
    marketState: string;
    avgMarketStrength: number
}

const Indicator = ({ percentage, marketState, avgMarketStrength }: Props) => {
    const validPercentage = Math.min(100, Math.max(0, percentage));

    return (
        <div>
            <div className="relative flex w-150 h-2 mb-2">
                <div className="flex w-full h-full rounded-full overflow-hidden">
                    <div className="w-[42%] h-full bg-red-400"></div>
                    <div className="w-[16%] h-full bg-[#b4b4b4]"></div>
                    <div className="w-[42%] h-full bg-green-400"></div>
                </div>
                <div
                    className="absolute top-1/2 transform -translate-y-1/2 h-5 rounded-full bg-gray-200 w-3"
                    style={{ left: `${validPercentage}%` }}
                >
                    <span className='whitespace-nowrap absolute bottom-5 -left-20'>
                        Avg Market strength {avgMarketStrength.toFixed(2)}
                    </span>
                </div>
            </div>
            <div className="flex items-center justify-start">
                <motion.div
                    className="w-2.5 h-2.5 bg-green-200 rounded-full mr-2"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                />
                <div>
                    Market state is {marketState}
                </div>
            </div>
        </div>
    );
};

export default Indicator;
