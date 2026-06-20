import type { ButtonHTMLAttributes } from 'react';
import {
    buttonVariants,
    type ButtonVariants,
} from '../styles/buttonVariants';


export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariants['variant'];
    size?: ButtonVariants['size'];
    fullWidth?: ButtonVariants['fullWidth'];
    rounded?: ButtonVariants['rounded'];
}

export const Button = ({
    variant,
    size,
    className,
    rounded,
    fullWidth,
    children,
    ...props
}: ButtonProps) => {
    return (
        <button
            className={buttonVariants({
                variant,
                fullWidth,
                size,
                rounded,
                className,
            })}
            {...props}
        >
            {children}
        </button>
    );
};
