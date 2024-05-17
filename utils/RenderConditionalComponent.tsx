import React, { useEffect, useState } from 'react';

// Define a type for the options parameter
type RenderComponentOptions = {
    zeroValueComponent?: React.ReactNode;
    nullValueComponent?: React.ReactNode;
    falseValueComponent?: React.ReactNode;
    trueValueComponent: React.ReactNode;
};

// General conditional rendering function
function RenderConditionalComponent(value: boolean | 0 | undefined | null | Promise<boolean | 0 | undefined | null>, options: RenderComponentOptions): React.ReactNode {
    const [resolvedValue, setResolvedValue] = useState<boolean | 0 | undefined | null | Promise<boolean | 0 | undefined | null>>(null);
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
        return null; // You can replace this with a loading spinner if needed
    } else if (resolvedValue === 0 && zeroValueComponent !== undefined) {
        return zeroValueComponent;
    } else if (resolvedValue === null && nullValueComponent !== undefined) {
        return nullValueComponent;
    } else if (resolvedValue === false && falseValueComponent !== undefined) {
        return falseValueComponent;
    } else if (resolvedValue) {
        return trueValueComponent;
    }
    return null; // Fallback for undefined, etc.
}

export default RenderConditionalComponent;
