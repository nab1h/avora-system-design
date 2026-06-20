import { cva, type VariantProps } from 'class-variance-authority';

export const containerVariants = cva('w-full', {
    variants: {
        width: {
            sm: 'max-w-screen-sm',
            md: 'max-w-screen-md',
            lg: 'max-w-screen-lg',
            xl: 'max-w-screen-xl',
            '2xl': 'max-w-screen-2xl',
            content: 'max-w-5xl',
            wide: 'max-w-7xl',
            full: 'max-w-none',
        },
        centered: {
            true: 'mx-auto',
            false: '',
        },
        gutter: {
            none: 'px-0',
            xs: 'px-2 sm:px-3',
            sm: 'px-3 sm:px-4',
            md: 'px-4 sm:px-6 lg:px-8',
            lg: 'px-6 sm:px-8 lg:px-10',
            xl: 'px-8 sm:px-10 lg:px-12',
        },
        paddingY: {
            none: 'py-0',
            xs: 'py-2',
            sm: 'py-4',
            md: 'py-6 sm:py-8',
            lg: 'py-8 sm:py-10 lg:py-12',
            xl: 'py-12 sm:py-16 lg:py-20',
            section: 'py-16 sm:py-20 lg:py-24',
        },
        marginY: {
            none: 'my-0',
            xs: 'my-2',
            sm: 'my-4',
            md: 'my-8',
            lg: 'my-12',
            xl: 'my-16',
        },
        background: {
            transparent: 'bg-transparent',
            surface: '',
            muted: '',
            primary: '',
            gradient: '',
        },
        rounded: {
            none: 'rounded-none',
            sm: 'rounded-lg',
            md: 'rounded-2xl',
            lg: 'rounded-3xl',
            full: 'rounded-[9999px]',
        },
        shadow: {
            none: 'shadow-none',
            sm: 'shadow-sm',
            md: 'shadow-md',
            lg: 'shadow-xl',
        },
        bordered: {
            true: 'border',
            false: 'border-transparent',
        },
        minHeight: {
            auto: 'min-h-0',
            content: 'min-h-min',
            screen: 'min-h-screen',
            viewport: 'min-h-dvh',
        },
        overflow: {
            visible: 'overflow-visible',
            hidden: 'overflow-hidden',
            clip: 'overflow-clip',
            auto: 'overflow-auto',
        },
    },
    defaultVariants: {
        width: 'wide',
        centered: true,
        gutter: 'md',
        paddingY: 'none',
        marginY: 'none',
        background: 'transparent',
        rounded: 'none',
        shadow: 'none',
        bordered: false,
        minHeight: 'auto',
        overflow: 'visible',
    },
});

export type ContainerVariants = VariantProps<typeof containerVariants>;
