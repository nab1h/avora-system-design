import type { HTMLAttributes } from 'react';

export type NavbarBrandProps = HTMLAttributes<HTMLDivElement>;

// Put NavbarLogo or any custom brand content inside this area.
export function NavbarBrand({ className = '', ...props }: NavbarBrandProps) {
    return (
        <div
            className={`flex shrink-0 items-center font-bold ${className}`}
            {...props}
        />
    );
}
