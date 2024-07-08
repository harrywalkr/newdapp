'use client'

import React from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { GrPowerReset } from 'react-icons/gr';
import { BiFilterAlt } from 'react-icons/bi';

interface Props {
    rankRange: [number, number];
    setRankRange: (value: [number, number]) => void;
    winRateRange: [number, number];
    setWinRateRange: (value: [number, number]) => void;
    netProfitRange: [number, number];
    setNetProfitRange: (value: [number, number]) => void;
    ageRange: [number, number];
    setAgeRange: (value: [number, number]) => void;
    label: string;
    setLabel: (value: string) => void;
    dayActiveRange: [number, number];
    setDayActiveRange: (value: [number, number]) => void;
    avgHoldingTimeRange: [number, number];
    setAvgHoldingTimeRange: (value: [number, number]) => void;
    totalScoreRange: [number, number];
    setTotalScoreRange: (value: [number, number]) => void;
    totalFeeRange: [number, number];
    setTotalFeeRange: (value: [number, number]) => void;
}

const FilterDialog = ({
    rankRange, setRankRange,
    winRateRange, setWinRateRange,
    netProfitRange, setNetProfitRange,
    ageRange, setAgeRange,
    label, setLabel,
    dayActiveRange, setDayActiveRange,
    avgHoldingTimeRange, setAvgHoldingTimeRange,
    totalScoreRange, setTotalScoreRange,
    totalFeeRange, setTotalFeeRange
}: Props) => {
    const handleRankChange = (newValue: [number, number]) => {
        setRankRange(newValue);
    };

    const handleWinRateChange = (newValue: [number, number]) => {
        setWinRateRange(newValue);
    };

    const handleNetProfitChange = (newValue: [number, number]) => {
        setNetProfitRange(newValue);
    };

    const handleAgeChange = (newValue: [number, number]) => {
        setAgeRange(newValue);
    };

    const handleLabelChange = (value: string) => {
        setLabel(value);
    };

    const handleDayActiveChange = (newValue: [number, number]) => {
        setDayActiveRange(newValue);
    };

    const handleAvgHoldingTimeChange = (newValue: [number, number]) => {
        setAvgHoldingTimeRange(newValue);
    };

    const handleTotalScoreChange = (newValue: [number, number]) => {
        setTotalScoreRange(newValue);
    };

    const handleTotalFeeChange = (newValue: [number, number]) => {
        setTotalFeeRange(newValue);
    };

    const resetFilters = () => {
        setRankRange([0, 100]);
        setWinRateRange([0, 100]);
        setNetProfitRange([0, 100000]);
        setAgeRange([0, 365]);
        setLabel('');
        setDayActiveRange([0, 365]);
        setAvgHoldingTimeRange([0, 365]);
        setTotalScoreRange([0, 2000]);
        setTotalFeeRange([0, 100]);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className='flex items-center justify-center gap-1'>
                    <BiFilterAlt />
                    <span>
                        Filters
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Filters</DialogTitle>
                <DialogDescription>Adjust the filters to refine your results.</DialogDescription>
                <Accordion type="single" collapsible defaultValue="item-1">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Rank Range</AccordionTrigger>
                        <AccordionContent>
                            <Slider
                                className='mt-2'
                                value={rankRange}
                                onValueChange={handleRankChange}
                                min={0}
                                max={100}
                                step={1}
                                aria-label="Rank Slider"
                            />
                            <div className="flex justify-between mt-1">
                                <span>{rankRange[0]}</span>
                                <span>{rankRange[1]}</span>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Win Rate Range</AccordionTrigger>
                        <AccordionContent>
                            <Slider
                                className='mt-2'
                                value={winRateRange}
                                onValueChange={handleWinRateChange}
                                min={0}
                                max={100}
                                step={1}
                                aria-label="Win Rate Slider"
                            />
                            <div className="flex justify-between mt-1">
                                <span>{winRateRange[0]}</span>
                                <span>{winRateRange[1]}</span>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Net Profit Range</AccordionTrigger>
                        <AccordionContent>
                            <Slider
                                className='mt-2'
                                value={netProfitRange}
                                onValueChange={handleNetProfitChange}
                                min={0}
                                max={100000}
                                step={100}
                                aria-label="Net Profit Slider"
                            />
                            <div className="flex justify-between mt-1">
                                <span>{netProfitRange[0]}</span>
                                <span>{netProfitRange[1]}</span>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger>Age Range</AccordionTrigger>
                        <AccordionContent>
                            <Slider
                                className='mt-2'
                                value={ageRange}
                                onValueChange={handleAgeChange}
                                min={0}
                                max={365}
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
                        <AccordionTrigger>Label</AccordionTrigger>
                        <AccordionContent>
                            <Select value={label} onValueChange={handleLabelChange}>
                                <SelectTrigger className="w-full mt-2">
                                    <SelectValue placeholder="Select Label" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Medium Size">Medium Size</SelectItem>
                                    <SelectItem value="Large Size">Large Size</SelectItem>
                                    <SelectItem value="Small Size">Small Size</SelectItem>
                                </SelectContent>
                            </Select>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-6">
                        <AccordionTrigger>Day Active Range</AccordionTrigger>
                        <AccordionContent>
                            <Slider
                                className='mt-2'
                                value={dayActiveRange}
                                onValueChange={handleDayActiveChange}
                                min={0}
                                max={365}
                                step={1}
                                aria-label="Day Active Slider"
                            />
                            <div className="flex justify-between mt-1">
                                <span>{dayActiveRange[0]}</span>
                                <span>{dayActiveRange[1]}</span>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-7">
                        <AccordionTrigger>Average Holding Time Range</AccordionTrigger>
                        <AccordionContent>
                            <Slider
                                className='mt-2'
                                value={avgHoldingTimeRange}
                                onValueChange={handleAvgHoldingTimeChange}
                                min={0}
                                max={365}
                                step={1}
                                aria-label="Average Holding Time Slider"
                            />
                            <div className="flex justify-between mt-1">
                                <span>{avgHoldingTimeRange[0]}</span>
                                <span>{avgHoldingTimeRange[1]}</span>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-8">
                        <AccordionTrigger>Total Score Range</AccordionTrigger>
                        <AccordionContent>
                            <Slider
                                className='mt-2'
                                value={totalScoreRange}
                                onValueChange={handleTotalScoreChange}
                                min={0}
                                max={2000}
                                step={10}
                                aria-label="Total Score Slider"
                            />
                            <div className="flex justify-between mt-1">
                                <span>{totalScoreRange[0]}</span>
                                <span>{totalScoreRange[1]}</span>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-9">
                        <AccordionTrigger>Total Fee Range</AccordionTrigger>
                        <AccordionContent>
                            <Slider
                                className='mt-2'
                                value={totalFeeRange}
                                onValueChange={handleTotalFeeChange}
                                min={0}
                                max={100}
                                step={1}
                                aria-label="Total Fee Slider"
                            />
                            <div className="flex justify-between mt-1">
                                <span>{totalFeeRange[0]}</span>
                                <span>{totalFeeRange[1]}</span>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <div className="mt-4 flex items-center justify-end gap-2">
                    <Button variant="outline" className='flex items-center justify-start gap-1' onClick={resetFilters}>
                        <GrPowerReset />
                        <span>
                            Reset
                        </span>
                    </Button>
                    <DialogClose asChild>
                        <Button variant="default">Ok</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FilterDialog;