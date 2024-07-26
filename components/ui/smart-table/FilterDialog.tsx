import React, { useState } from 'react';
import Link from 'next/link';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { GrPowerReset } from 'react-icons/gr';
import { BiFilterAlt } from 'react-icons/bi';
import { DatePicker } from '../date-picker';
import { ScrollArea } from '../scroll-area';

type FilterBase = {
    name: string;
    type: 'range' | 'dropdown' | 'date' | 'date-range';
    premium?: boolean;
};

type RangeFilter = FilterBase & {
    state: [number, number];
    setState: (value: [number, number]) => void;
    defaultRange: [number, number];
    type: 'range';
};

type DropdownFilter = FilterBase & {
    state: string;
    setState: (value: string) => void;
    defaultRange: string[];
    type: 'dropdown';
};

type DateFilter = FilterBase & {
    state: Date | undefined;
    setState: (value: Date | undefined) => void;
    type: 'date';
};

type DateRangeFilter = FilterBase & {
    state: { from: Date | undefined; to: Date | undefined };
    setState: (value: { from: Date | undefined; to: Date | undefined }) => void;
    type: 'date-range';
};

export type Filter = RangeFilter | DropdownFilter | DateFilter | DateRangeFilter;

interface Props {
    filters: Filter[];
}

const FilterDialog = ({ filters }: Props) => {
    const [tempFilters, setTempFilters] = useState(filters.map(filter => ({
        ...filter,
        state: filter.state,
    })));

    const handleRangeChange = (index: number, newValue: [number, number]) => {
        const updatedFilters = [...tempFilters];
        (updatedFilters[index] as RangeFilter).state = newValue;
        setTempFilters(updatedFilters);
    };

    const handleDropdownChange = (index: number, newValue: string) => {
        const updatedFilters = [...tempFilters];
        (updatedFilters[index] as DropdownFilter).state = newValue;
        setTempFilters(updatedFilters);
    };

    const handleDateChange = (index: number, newValue: Date | undefined) => {
        const updatedFilters = [...tempFilters];
        (updatedFilters[index] as DateFilter).state = newValue;
        setTempFilters(updatedFilters);
    };

    const handleDateRangeChange = (index: number, newValue: { from: Date | undefined; to: Date | undefined }) => {
        const updatedFilters = [...tempFilters];
        (updatedFilters[index] as DateRangeFilter).state = newValue;
        setTempFilters(updatedFilters);
    };

    const applyFilters = () => {
        tempFilters.forEach((filter, index) => {
            filters[index].setState(filter.state as any);
        });
    };

    const resetFilters = () => {
        const resetTempFilters = tempFilters.map(filter => {
            if (filter.type === 'range' || filter.type === 'dropdown') {
                return {
                    ...filter,
                    state: filter.defaultRange,
                };
            } else if (filter.type === 'date') {
                return {
                    ...filter,
                    state: undefined,
                };
            } else if (filter.type === 'date-range') {
                return {
                    ...filter,
                    state: { from: undefined, to: undefined },
                };
            }
            return filter;
        });
        setTempFilters(resetTempFilters as any);

        filters.forEach(filter => {
            if (filter.type === 'range' || filter.type === 'dropdown') {
                filter.setState(filter.defaultRange as any);
            } else if (filter.type === 'date') {
                filter.setState(undefined);
            } else if (filter.type === 'date-range') {
                filter.setState({ from: undefined, to: undefined });
            }
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className='flex items-center justify-center gap-1'>
                    <BiFilterAlt />
                    <span>Filters</span>
                </Button>
            </DialogTrigger>
            <DialogContent className='max-h-[90vh]'>
                <DialogTitle>Filters</DialogTitle>
                <DialogDescription>Adjust the filters to refine your results.</DialogDescription>
                <ScrollArea className="h-full">
                    <Accordion type="single" collapsible defaultValue="item-1">
                        {tempFilters.map((filter, index) => (
                            <AccordionItem key={index} value={`item-${index + 1}`}>
                                <AccordionTrigger>{filter.name}</AccordionTrigger>
                                <AccordionContent>
                                    {filter.premium ? (
                                        <div className="text-red-500">
                                            This filter is available for premium users only. <Link href="/pricing" target='_blank' className="text-blue-500 underline">Check our pricing plans</Link>
                                        </div>
                                    ) : filter.type === 'range' ? (
                                        <>
                                            <Slider
                                                rangeSlider={true}
                                                className='mt-2'
                                                value={filter.state as [number, number]}
                                                min={(filter.defaultRange as [number, number])[0]}
                                                max={(filter.defaultRange as [number, number])[1]}
                                                onValueChange={(newValue) => handleRangeChange(index, [newValue[0], newValue[1]])}
                                                step={1}
                                                aria-label={`${filter.name} Slider`}
                                            />
                                            <div className="flex justify-between mt-1">
                                                <span>{(filter.state as [number, number])[0]}</span>
                                                <span>{(filter.state as [number, number])[1]}</span>
                                            </div>
                                        </>
                                    ) : filter.type === 'dropdown' ? (
                                        <Select value={filter.state as string} onValueChange={(value) => handleDropdownChange(index, value)}>
                                            <SelectTrigger className="w-full mt-2">
                                                <SelectValue placeholder={`Select ${filter.name}`} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(filter.defaultRange as string[]).map((option, idx) => (
                                                    <SelectItem key={idx} value={option}>{option}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : filter.type === 'date' ? (
                                        <DatePicker
                                            label={filter.name}
                                            selectedDate={filter.state as Date | undefined}
                                            onSelect={(newValue) => handleDateChange(index, newValue)}
                                        />
                                    ) : (
                                        <div className="flex flex-wrap gap-3">
                                            <div className="w-auto">
                                                <DatePicker
                                                    label={`${filter.name} From`}
                                                    selectedDate={(filter.state as { from: Date | undefined; to: Date | undefined }).from}
                                                    onSelect={(date) => handleDateRangeChange(index, { ...filter.state as { from: Date | undefined; to: Date | undefined }, from: date })}
                                                />
                                            </div>
                                            <div className="w-auto">
                                                <DatePicker
                                                    label={`${filter.name} To`}
                                                    selectedDate={(filter.state as { from: Date | undefined; to: Date | undefined }).to}
                                                    onSelect={(date) => handleDateRangeChange(index, { ...filter.state as { from: Date | undefined; to: Date | undefined }, to: date })}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </ScrollArea>
                <div className="mt-4 flex items-center justify-end gap-2">
                    <Button variant="outline" className='flex items-center justify-start gap-1' onClick={resetFilters}>
                        <GrPowerReset />
                        <span>Reset</span>
                    </Button>
                    <DialogClose asChild>
                        <Button variant="default" onClick={applyFilters}>Ok</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FilterDialog;
