import type { ImgHTMLAttributes } from 'react';

export type CardImageProps = ImgHTMLAttributes<HTMLImageElement>;

// The card image. Use className to change its height or shape.
export function CardImage({ className = '', alt, ...props }: CardImageProps) {
    return (
        <img
            className={`h-48 w-full object-cover ${className}`}
            alt={alt}
            {...props}
        />
    );
}
