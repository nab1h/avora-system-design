import type { HTMLAttributes } from 'react';
import {
    navbarContainerVariants,
    type NavbarContainerVariants,
} from '../../styles/navbarVariants';

export interface NavbarContainerProps extends HTMLAttributes<HTMLDivElement> {
    width?: NavbarContainerVariants['width'];
    padding?: NavbarContainerVariants['padding'];
    height?: NavbarContainerVariants['height'];
}

// Keeps the navbar content aligned and controls its maximum width.
export function NavbarContainer({
    width,
    padding,
    height,
    className,
    ...props
}: NavbarContainerProps) {
    return (
        <div
            className={navbarContainerVariants({
                width,
                padding,
                height,
                className,
            })}
            {...props}
        />
    );
}
