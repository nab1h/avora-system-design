import type { HTMLAttributes } from 'react';

export type NavbarActionsProps = HTMLAttributes<HTMLDivElement>;

// Put buttons, language controls, or user actions inside this area.
export function NavbarActions({
    className = '',
    ...props
}: NavbarActionsProps) {
    return (
        <div
            className={`flex items-center gap-2 ${className}`}
            {...props}
        />
    );
}
