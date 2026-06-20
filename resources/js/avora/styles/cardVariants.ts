import { cva, type VariantProps } from 'class-variance-authority';

export const cardVariants = cva(
    'w-full transition-shadow duration-200',
    {
        variants: {
            variant: {
                default: 'border shadow-sm',
                elevated: 'border border-transparent shadow-lg',
                outlined: 'border shadow-none',
                ghost: 'border border-transparent bg-transparent shadow-none',
            },
            padding: {
                none: 'p-0',
                sm: 'p-3',
                md: 'p-4',
                lg: 'p-6',
            },
            rounded: {
                none: 'rounded-none',
                sm: 'rounded-md',
                md: 'rounded-lg',
                lg: 'rounded-2xl',
            },
        },
        defaultVariants: {
            variant: 'default',
            // Card sections add their own spacing by default.
            padding: 'none',
            rounded: 'md',
        },
    },
);

export type CardVariants = VariantProps<typeof cardVariants>;
