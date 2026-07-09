import { cva, type VariantProps } from 'class-variance-authority';

export const gridVariants = cva('grid', {
    variants: {
        layout: {
            one: 'grid-cols-1',
            two: 'grid-cols-1 md:grid-cols-2',
            three: 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3',
            four: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
            cards: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
            dashboard: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4',
            editorial:
                'grid-cols-1 auto-rows-[220px] md:grid-cols-4 md:auto-rows-[180px] lg:grid-cols-6 lg:auto-rows-[190px]',
            sidebarStart:
                'grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)]',
            sidebarEnd:
                'grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px]',
            sidebarLeft:
                'grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)]',
            sidebarRight:
                'grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px]',
        },
        gap: {
            none: 'gap-0',
            xs: 'gap-2',
            sm: 'gap-3',
            md: 'gap-4',
            lg: 'gap-6',
            xl: 'gap-8',
        },
        padding: {
            none: 'p-0',
            sm: 'p-3 sm:p-4',
            md: 'p-4 sm:p-6',
            lg: 'p-6 sm:p-8 lg:p-10',
            xl: 'p-8 sm:p-10 lg:p-12',
        },
        width: {
            full: 'w-full',
            content: 'mx-auto w-full max-w-5xl',
            wide: 'mx-auto w-full max-w-7xl',
        },
        align: {
            start: 'items-start',
            center: 'items-center',
            end: 'items-end',
            stretch: 'items-stretch',
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
        },
    },
    defaultVariants: {
        layout: 'cards',
        gap: 'md',
        padding: 'none',
        width: 'full',
        align: 'stretch',
        background: 'transparent',
        rounded: 'none',
    },
});

export const gridItemVariants = cva('min-w-0', {
    variants: {
        span: {
            auto: 'col-auto',
            one: 'col-span-1',
            two: 'col-span-2',
            three: 'col-span-3',
            four: 'col-span-4',
            five: 'col-span-5',
            six: 'col-span-6',
            full: 'col-span-full',
        },
        mdSpan: {
            one: 'md:col-span-1',
            two: 'md:col-span-2',
            three: 'md:col-span-3',
            four: 'md:col-span-4',
            full: 'md:col-span-full',
        },
        lgSpan: {
            one: 'lg:col-span-1',
            two: 'lg:col-span-2',
            three: 'lg:col-span-3',
            four: 'lg:col-span-4',
            five: 'lg:col-span-5',
            six: 'lg:col-span-6',
            full: 'lg:col-span-full',
        },
        rowSpan: {
            one: 'row-span-1',
            two: 'row-span-2',
            three: 'row-span-3',
            four: 'row-span-4',
            full: 'row-span-full',
        },
    },
    defaultVariants: {
        span: 'one',
        rowSpan: 'one',
    },
});

export type GridVariants = VariantProps<typeof gridVariants>;
export type GridItemVariants = VariantProps<typeof gridItemVariants>;
