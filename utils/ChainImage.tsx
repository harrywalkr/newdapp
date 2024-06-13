import Image from 'next/image';
import React from 'react';

interface ChainImageProps {
    chainName: string;
}

const ChainImage: React.FC<ChainImageProps> = ({ chainName }) => {
    return (
        <Image
            src={`/networks/${chainName.toLowerCase()}.png`}
            alt={`${chainName} logo`}
            width={40}
            height={40}
            onError={(e) => (e.currentTarget.src = '/chains/default.png')} // Fallback to default image if not found
        />
    );
};

export default ChainImage;
