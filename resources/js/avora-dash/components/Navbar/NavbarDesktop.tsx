import type { HTMLAttributes } from 'react';

export type NavbarDesktopProps = HTMLAttributes<HTMLDivElement>;

// This area is hidden on mobile and shown from medium screens.
export function NavbarDesktop({
    className = '',
    ...props
}: NavbarDesktopProps) {
    return (
        <div
            className={`hidden flex-1 items-center justify-between gap-6 md:flex ${className}`}
            {...props}
        />
    );
}
