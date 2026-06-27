import type { HTMLAttributes } from 'react';

export type CardTitleProps = HTMLAttributes<HTMLHeadingElement>;

// The main card title. Change the text size with className when needed.
export function CardTitle({ className = '', ...props }: CardTitleProps) {
    return (
        <h3
            className={`text-lg font-semibold leading-tight ${className}`}
            {...props}
        />
    );
}
