import React from 'react';
import clsx from 'clsx'; // Import clsx for handling dynamic classNames

type PriceFormatterProps = {
  value: number | string;
  dollarSign?: boolean;
  className?: string; // Optional className prop for custom styling
};

export default function PriceFormatter({ value, dollarSign, className }: PriceFormatterProps) {
  // Parse the value to ensure it's a number
  const parsedValue = Number(value);

  // Define a function to format the value
  const formatValue = (num: number) => {
    if (num === 0) return "0";

    if (num > 0.0001) {
      // For values greater than 0.0001, format as a fixed decimal string
      return num.toFixed(4).replace(/\.?0+$/, "");
    }

    // For very small numbers, use exponential notation and format it
    const [leading, exponential] = num.toExponential(2).split("e");
    const formattedExponential = `${leading}e${parseInt(exponential)}`;
    return `0.0${formattedExponential}`;
  };

  // Extract parts for very small numbers
  const getFormattedParts = (num: number) => {
    const [leading, exponential] = num.toExponential(2).split("e");
    const formattedExponential = `${leading}e${parseInt(exponential)}`;
    return {
      leadingPart: `0.0`,
      subPart: parseInt(exponential).toString().substring(1),
      trailingPart: formattedExponential.replace(".", "").split("e")[0]
    };
  };

  const formattedValue = formatValue(parsedValue);
  const isSmallNumber = parsedValue !== 0 && parsedValue <= 0.0001;
  const { leadingPart, subPart, trailingPart } = isSmallNumber ? getFormattedParts(parsedValue) : { leadingPart: '', subPart: '', trailingPart: '' };

  return (
    <div className={clsx("flex items-center gap-[2.75rem]", className)}>
      {dollarSign && <span>$</span>}
      {!isSmallNumber && formattedValue}
      {isSmallNumber && (
        <>
          <span>{leadingPart}</span>
          <sub>{subPart}</sub>
          <span>{trailingPart}</span>
        </>
      )}
    </div>
  );
}
