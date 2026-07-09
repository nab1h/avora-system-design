import type { ImgHTMLAttributes } from 'react';

export interface CardImageProps extends Omit<
    ImgHTMLAttributes<HTMLImageElement>,
    "src"
> {
    src: string;
    hoverSrc?: string;
}

// The card image. Use className to change its height or shape.
export function CardImage({
    className = "",
    alt,
    src,
    hoverSrc,
    ...props
}: CardImageProps) {
    return (
        <div className={`relative overflow-hidden ${className}`}>
            <img
                src={src}
                alt={alt}
                className="h-96 w-full object-cover transition-opacity duration-700 group-hover:opacity-0"
                {...props}
            />

            {hoverSrc && (
                <img
                    src={hoverSrc}
                    alt={alt}
                    className="absolute inset-0 h-96 w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                />
            )}
        </div>
    );
}
