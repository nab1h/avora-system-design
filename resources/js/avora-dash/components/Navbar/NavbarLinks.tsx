import type { HTMLAttributes } from 'react';

export type NavbarLinksProps = HTMLAttributes<HTMLDivElement>;

// Groups navigation links. Use className to change direction or spacing.
export function NavbarLinks({ className = '', ...props }: NavbarLinksProps) {
    return (
        <div
            className={`flex items-center gap-1 ${className}`}
            {...props}
        />
    );
}
