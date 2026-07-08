import { useAppName } from '@/avora-dash/hooks/useAppName';
import type { AnchorHTMLAttributes, ImgHTMLAttributes } from 'react';

export interface NavbarLogoProps
    extends AnchorHTMLAttributes<HTMLAnchorElement> {
    src?: string;
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
    const appName = useAppName();

    return (
        <a
            className={`inline-flex shrink-0 items-center ${className}`}
            {...props}
        >
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    className={`h-10 w-auto object-contain ${imageClassName}`}
                    {...imageProps}
                />
            ) : (
                <h1 className="font-playfair text-3xl font-semibold leading-none text-slate-700 sm:text-4xl md:text-5xl dark:text-slate-100">
                    {appName}
                </h1>
            )}
        </a>
    );
}
