import clsx from 'clsx';
import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const KeyValueVariants = cva(
    'flex items-center justify-start gap-1',
    {
        variants: {
            variant: {
                default: 'text-muted-foreground',
                good: 'text-green-400',
                bad: 'text-red-500',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

export interface KeyValueProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof KeyValueVariants> {
    title: string;
    description?: string | number;
    titleIcon?: React.ReactNode;
    valueIcon?: React.ReactNode;
    value?: string | number;
    stretch?: boolean;
    symbol?: 'dollar' | 'percentage';
}

const KeyValue = forwardRef<HTMLDivElement, KeyValueProps>(({
    className,
    variant,
    title,
    description,
    titleIcon,
    valueIcon,
    value,
    stretch,
    symbol,
    children,
    ...props
}, ref) => {
    return (
        <div
            className={clsx('flex items-start gap-1 text-base', stretch ? 'justify-between' : 'justify-start', className)}
            ref={ref}
            {...props}
        >
            <div className='font-bold flex items-center gap-1'>
                {titleIcon}
                <div className='flex flex-col'>
                    <h2>
                        {title}
                        {stretch && ' : '}
                    </h2>
                    {description && (
                        <h3 className='font-normal text-xs text-muted-foreground'>
                            {description}
                        </h3>
                    )}
                </div>
            </div>
            {!stretch && <span>:</span>}
            <div className={cn('whitespace-nowrap', KeyValueVariants({ variant }))}>
                {children || (
                    <>
                        {symbol === 'dollar' && '$ '}
                        {value}
                        {valueIcon}
                        {symbol === 'percentage' && ' %'}
                    </>
                )}
            </div>
        </div>
    );
});

KeyValue.displayName = 'KeyValue';

export { KeyValue, KeyValueVariants };
