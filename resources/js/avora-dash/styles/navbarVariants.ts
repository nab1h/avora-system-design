import { cva, type VariantProps } from 'class-variance-authority';

export const navbarVariants = cva(
    'w-full transition-colors duration-300',
    {
        variants: {
            position: {
                static: 'relative z-50',
                sticky: 'sticky top-0 z-50',
                fixed: 'fixed inset-x-0 top-0 z-50',
            },
            background: {
                transparent: 'bg-transparent',
                surface: '',
                muted: '',
                primary: '',
                glass: 'backdrop-blur-xl',
            },
            shadow: {
                none: 'shadow-none',
                sm: 'shadow-sm',
                md: 'shadow-md',
            },
            bordered: {
                true: 'border-b',
                false: 'border-transparent',
            },
            rounded: {
                none: 'rounded-none',
                md: 'rounded-xl',
                lg: 'rounded-2xl',
                full: 'rounded-full',
            },
        },
        defaultVariants: {
            position: 'static',
            background: 'surface',
            shadow: 'none',
            bordered: true,
            rounded: 'none',
        },
    },
);

export const navbarContainerVariants = cva(
    'relative z-50 mx-auto flex w-full items-center justify-between gap-4',
    {
        variants: {
            width: {
                full: 'max-w-none',
                content: 'max-w-5xl',
                wide: 'max-w-7xl',
            },
            padding: {
                none: 'px-0',
                sm: 'px-3 sm:px-4',
                md: 'px-4 sm:px-6 lg:px-8',
                lg: 'px-6 sm:px-8 lg:px-10',
            },
            height: {
                sm: 'min-h-14',
                md: 'min-h-16',
                lg: 'min-h-40',
            },
        },
        defaultVariants: {
            width: 'wide',
            padding: 'md',
            height: 'md',
        },
    },
);

export type NavbarVariants = VariantProps<typeof navbarVariants>;
export type NavbarContainerVariants = VariantProps<
    typeof navbarContainerVariants
>;
