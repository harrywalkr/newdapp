import clsx from 'clsx'
import React, { forwardRef, HtmlHTMLAttributes } from 'react'
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from '@/lib/utils';

const KeyValueVariants = cva(
    "flex items-center justify-start gap-1",
    {
        variants: {
            variant: {
                default: "text-muted-foreground",
                good: "text-green-400",
                bad: "text-red-500",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface KeyValueProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof KeyValueVariants> {
    title: string,
    description?: string | number,
    titleIcon?: React.ReactNode,
    valueIcon?: React.ReactNode,
    value?: string | number,
    stretch?: boolean,
    symbol?: 'dollar' | 'percentage'
}

const KeyValue = forwardRef<HTMLDivElement, KeyValueProps>(
    ({ className, variant, ...props }, ref) => {

        return (
            <div className={clsx('text-sm flex items-start gap-1', props.stretch ? 'justify-between' : 'justify-start')} ref={ref}>
                <div className='font-bold flex items-center justify-start gap-1'>
                    {props.titleIcon}
                    <div className='flex flex-col items-start justify-center'>
                        <h2>
                            {props.title}
                            {props.stretch && <>
                                {' : '}
                            </>}
                        </h2>
                        {props.description &&
                            <h3 className='font-normal text-xs text-muted-foreground'>
                                {props.description}
                            </h3>
                        }
                    </div>
                </div>
                {
                    !props.stretch &&
                    <span>:</span>
                }
                <div
                    className={cn('whitespace-nowrap', KeyValueVariants({ variant, className }))}
                    {...props}
                >
                    {
                        props.children ? props.children : <>
                            {props.symbol == 'dollar' && <>
                                {'$ '}
                            </>}
                            {props.value && props.value}
                            {props.valueIcon}
                            {props.symbol == 'percentage' && <>
                                {' %'}
                            </>}
                        </>
                    }
                </div>
            </div>
        )
    }
);
KeyValue.displayName = 'KeyValue';

export { KeyValue, KeyValueVariants };