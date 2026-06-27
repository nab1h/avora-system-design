import type { ButtonHTMLAttributes } from 'react';
import { Button } from '../Button';

export function FormButton({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <Button
            rounded="lg"
            className={`h-auto px-5 py-3 font-semibold ${className}`}
            {...props}
        >
            {children}
        </Button>
    );
}
