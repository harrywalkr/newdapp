import React from 'react';
import { motion } from 'framer-motion';

interface Props {
    percentage: number;
    marketState: string;
}

const Indicator = ({ percentage, marketState }: Props) => {
    const validPercentage = Math.min(100, Math.max(0, percentage));

    return (
        <div>
            <div className="relative flex w-150 h-3 mb-2">
                <div className="flex w-full h-full rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-red-400"></div>
                    <div className="w-1/3 h-full bg-yellow-300"></div>
                    <div className="w-1/3 h-full bg-green-400"></div>
                </div>
                <div
                    className="absolute top-1/2 transform -translate-y-1/2 h-5 rounded-full bg-gray-200 w-3"
                    style={{ left: `${validPercentage}%` }}
                ></div>
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
