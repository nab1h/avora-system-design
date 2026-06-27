import type { HTMLAttributes } from 'react';

export type CardHeaderProps = HTMLAttributes<HTMLDivElement>;

// Use the header for the title, description, and small information.
export function CardHeader({ className = '', ...props }: CardHeaderProps) {
    return <div className={`space-y-2 p-4 ${className}`} {...props} />;
}
