'use client'
import React, { useEffect, useState } from 'react';

type RenderComponentOptions = {
    zeroValueComponent?: React.ReactNode;
    nullValueComponent?: React.ReactNode;
    falseValueComponent?: React.ReactNode;
    trueValueComponent: React.ReactNode;
};

type RenderConditionalComponentProps = {
    value: any | Promise<any>;
    options: RenderComponentOptions;
};

const RenderConditionalComponent: React.FC<RenderConditionalComponentProps> = ({ value, options }) => {
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
        return null; // Replace this with a loading spinner if needed
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
};

export default RenderConditionalComponent;
