import type { HTMLAttributes } from 'react';

export type CardFooterProps = HTMLAttributes<HTMLDivElement>;

// The bottom area for a price, date, button, or other actions.
export function CardFooter({ className = '', ...props }: CardFooterProps) {
    return (
        <div
            className={`flex items-center justify-between gap-4 px-4 pb-4 ${className}`}
            {...props}
        />
    );
}
