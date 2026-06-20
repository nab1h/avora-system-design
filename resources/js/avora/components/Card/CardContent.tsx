import type { HTMLAttributes } from 'react';

export type CardContentProps = HTMLAttributes<HTMLDivElement>;

// Put any extra card content inside this section.
export function CardContent({ className = '', ...props }: CardContentProps) {
    return <div className={`px-4 pb-4 ${className}`} {...props} />;
}
