import React from 'react';

// Define a type for the options parameter
type RenderComponentOptions = {
    zeroValueComponent?: React.ReactNode;
    nullValueComponent?: React.ReactNode;
    falseValueComponent?: React.ReactNode;
    trueValueComponent: React.ReactNode;
};

// General conditional rendering function
function RenderConditionalComponent(value: any, options: RenderComponentOptions): React.ReactNode {
    const { zeroValueComponent, nullValueComponent, falseValueComponent, trueValueComponent } = options;

    if (value === 0 && zeroValueComponent !== undefined) {
        return zeroValueComponent;
    } else if (value === null && nullValueComponent !== undefined) {
        return nullValueComponent;
    } else if (value === false && falseValueComponent !== undefined) {
        return falseValueComponent;
    } else if (value) {
        return trueValueComponent;
    }
    return null; // Fallback for undefined, etc.
}

export default RenderConditionalComponent;
