import type { AnchorHTMLAttributes, ImgHTMLAttributes } from 'react';

export interface NavbarLogoProps
    extends AnchorHTMLAttributes<HTMLAnchorElement> {
    src: string;
    alt: string;
    imageClassName?: string;
    imageProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>;
}

// An image-only logo. Change src, alt, and imageClassName for each project.
export function NavbarLogo({
    src,
    alt,
    imageClassName = '',
    imageProps,
    className = '',
    ...props
}: NavbarLogoProps) {
    return (
        <a
            className={`inline-flex shrink-0 items-center ${className}`}
            {...props}
        >
            <img
                src={src}
                alt={alt}
                className={`h-10 w-auto object-contain ${imageClassName}`}
                {...imageProps}
            />
        </a>
    );
}
