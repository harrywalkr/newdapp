'use client'
import React, { useEffect, useState } from 'react';

// Define a type for the options parameter
type RenderComponentOptions = {
    zeroValueComponent?: React.ReactNode;
    nullValueComponent?: React.ReactNode;
    falseValueComponent?: React.ReactNode;
    trueValueComponent: React.ReactNode;
};

// FIXME: Can do promises as well but can only be imported into client components
function RenderConditionalComponent(value: any | Promise<any>, options: RenderComponentOptions): React.ReactNode {
    const [resolvedValue, setResolvedValue] = useState<any | Promise<any>>(null);
    const { zeroValueComponent, nullValueComponent, falseValueComponent, trueValueComponent } = options;

    useEffect(() => {
        let isMounted = true;
        const resolveValue = async () => {
            if (value instanceof Promise) {
                const result = await value;
                if (isMounted) {
                    setResolvedValue(result);
                }
            } else {
                setResolvedValue(value);
            }
        };
        resolveValue();
        return () => {
            isMounted = false;
        };
    }, [value]);

    if (resolvedValue === null) {
        return null; // FIXME: replace this with a loading spinner if needed
    } else if (resolvedValue === 0 && zeroValueComponent !== undefined) {
        return zeroValueComponent;
    } else if (resolvedValue === null && nullValueComponent !== undefined) {
        return nullValueComponent;
    } else if (resolvedValue === false && falseValueComponent !== undefined) {
        return falseValueComponent;
    } else if (resolvedValue) {
        return trueValueComponent;
    }
    return null;
}

export default RenderConditionalComponent;
