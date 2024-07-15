'use client'

import React from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { GrPowerReset } from 'react-icons/gr';
import { BiFilterAlt } from 'react-icons/bi';

type FilterBase = {
    name: string;
    type: 'range' | 'dropdown';
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

export type Filter = RangeFilter | DropdownFilter;

interface Props {
    filters: Filter[];
}

const FilterDialog = ({ filters }: Props) => {
    const resetFilters = () => {
        filters.forEach(filter => {
            if (filter.type === 'range') {
                filter.setState(filter.defaultRange);
            } else {
                filter.setState('');
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
            <DialogContent>
                <DialogTitle>Filters</DialogTitle>
                <DialogDescription>Adjust the filters to refine your results.</DialogDescription>
                <Accordion type="single" collapsible defaultValue="item-1">
                    {filters.map((filter, index) => (
                        <AccordionItem key={index} value={`item-${index + 1}`}>
                            <AccordionTrigger>{filter.name}</AccordionTrigger>
                            <AccordionContent>
                                {filter.premium ? (
                                    <div className="text-red-500">This filter is available for premium users only.</div>
                                ) : filter.type === 'range' ? (
                                    <>
                                        <Slider
                                            rangeSlider={true}
                                            className='mt-2'
                                            value={filter.state}
                                            min={filter.defaultRange[0]}
                                            max={filter.defaultRange[1]}
                                            onValueChange={(newValue) => filter.setState([newValue[0], newValue[1]])}
                                            step={1}
                                            aria-label={`${filter.name} Slider`}
                                        />
                                        <div className="flex justify-between mt-1">
                                            <span>{filter.state[0]}</span>
                                            <span>{filter.state[1]}</span>
                                        </div>
                                    </>
                                ) : (
                                    <Select value={filter.state} onValueChange={(value) => filter.setState(value)}>
                                        <SelectTrigger className="w-full mt-2">
                                            <SelectValue placeholder={`Select ${filter.name}`} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {filter.defaultRange.map((option, idx) => (
                                                <SelectItem key={idx} value={option}>{option}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
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

export default FilterDialog;
