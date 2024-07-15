'use client';

import React from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { GrPowerReset } from 'react-icons/gr';

interface Props {
    priceRange: [number, number];
    setPriceRange: (value: [number, number]) => void;
    volumeRange: [number, number];
    setVolumeRange: (value: [number, number]) => void;
    liquidityRange: [number, number];
    setLiquidityRange: (value: [number, number]) => void;
    ageRange: [number, number];
    setAgeRange: (value: [number, number]) => void;
    priceChange24hRange: [number, number];
    setPriceChange24hRange: (value: [number, number]) => void;
    defaultRanges: {
        priceRange: [number, number];
        volumeRange: [number, number];
        liquidityRange: [number, number];
        ageRange: [number, number];
        priceChange24hRange: [number, number];
    }
}

const TopTokenFilterDialog = ({
    priceRange, setPriceRange,
    volumeRange, setVolumeRange,
    liquidityRange, setLiquidityRange,
    ageRange, setAgeRange,
    priceChange24hRange, setPriceChange24hRange,
    defaultRanges
}: Props) => {
    const handlePriceRangeChange = (newValue: [number, number]) => {
        setPriceRange(newValue);
    };

    const handleVolumeRangeChange = (newValue: [number, number]) => {
        setVolumeRange(newValue);
    };

    const handleLiquidityRangeChange = (newValue: [number, number]) => {
        setLiquidityRange(newValue);
    };

    const handleAgeRangeChange = (newValue: [number, number]) => {
        setAgeRange(newValue);
    };

    const handlePriceChange24hRangeChange = (newValue: [number, number]) => {
        setPriceChange24hRange(newValue);
    };

    const resetFilters = () => {
        setPriceRange(defaultRanges.priceRange);
        setVolumeRange(defaultRanges.volumeRange);
        setLiquidityRange(defaultRanges.liquidityRange);
        setAgeRange(defaultRanges.ageRange);
        setPriceChange24hRange(defaultRanges.priceChange24hRange);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className='w-28'>Open Filters</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Filters</DialogTitle>
                <DialogDescription>Adjust the filters to refine your results.</DialogDescription>
                <Accordion type="single" collapsible defaultValue="item-1">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Price Range</AccordionTrigger>
                        <AccordionContent>
                            <Slider
                                rangeSlider={true}
                                className='mt-2'
                                value={priceRange}
                                onValueChange={handlePriceRangeChange}
                                min={defaultRanges.priceRange[0]}
                                max={defaultRanges.priceRange[1]}
                                step={1}
                                aria-label="Price Slider"
                            />
                            <div className="flex justify-between mt-1">
                                <span>{priceRange[0]}</span>
                                <span>{priceRange[1]}</span>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Volume Range</AccordionTrigger>
                        <AccordionContent>
                            <Slider
                                rangeSlider={true}
                                className='mt-2'
                                value={volumeRange}
                                onValueChange={handleVolumeRangeChange}
                                min={defaultRanges.volumeRange[0]}
                                max={defaultRanges.volumeRange[1]}
                                step={1000}
                                aria-label="Volume Slider"
                            />
                            <div className="flex justify-between mt-1">
                                <span>{volumeRange[0]}</span>
                                <span>{volumeRange[1]}</span>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Liquidity Range</AccordionTrigger>
                        <AccordionContent>
                            <Slider
                                rangeSlider={true}
                                className='mt-2'
                                value={liquidityRange}
                                onValueChange={handleLiquidityRangeChange}
                                min={defaultRanges.liquidityRange[0]}
                                max={defaultRanges.liquidityRange[1]}
                                step={1000}
                                aria-label="Liquidity Slider"
                            />
                            <div className="flex justify-between mt-1">
                                <span>{liquidityRange[0]}</span>
                                <span>{liquidityRange[1]}</span>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger>Age Range</AccordionTrigger>
                        <AccordionContent>
                            <Slider
                                rangeSlider={true}
                                className='mt-2'
                                value={ageRange}
                                onValueChange={handleAgeRangeChange}
                                min={defaultRanges.ageRange[0]}
                                max={defaultRanges.ageRange[1]}
                                step={1}
                                aria-label="Age Slider"
                            />
                            <div className="flex justify-between mt-1">
                                <span>{ageRange[0]}</span>
                                <span>{ageRange[1]}</span>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                        <AccordionTrigger>24h Price Change Range</AccordionTrigger>
                        <AccordionContent>
                            <Slider
                                rangeSlider={true}
                                className='mt-2'
                                value={priceChange24hRange}
                                onValueChange={handlePriceChange24hRangeChange}
                                min={defaultRanges.priceChange24hRange[0]}
                                max={defaultRanges.priceChange24hRange[1]}
                                step={1}
                                aria-label="Price Change 24h Slider"
                            />
                            <div className="flex justify-between mt-1">
                                <span>{priceChange24hRange[0]}</span>
                                <span>{priceChange24hRange[1]}</span>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <div className="mt-4 flex items-center justify-end gap-2">
                    <Button variant="outline" className='flex items-center justify-start gap-1' onClick={resetFilters}>
                        <GrPowerReset />
                        <span>Reset</span>
                    </Button>
                    <DialogClose asChild>
                        <Button variant="default">Ok</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TopTokenFilterDialog;
