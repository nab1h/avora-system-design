import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
    [
        "inline-flex items-center justify-center whitespace-nowrap",
        "text-sm font-medium",
        "transition-colors duration-400 ease-in-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
    ],
    {
        variants: {
            variant: {
                primary:
                    "avora-button-primary text-white shadow-sm focus-visible:ring-[var(--avora-primary)]",

                danger: "border border-rose-700 bg-rose-600 text-white shadow-sm hover:bg-rose-700 focus-visible:ring-rose-500 dark:border-rose-500 dark:bg-rose-600 dark:hover:bg-rose-500",

                secondary:
                    "avora-button-secondary text-white shadow-sm focus-visible:ring-[var(--avora-secondary)]",

                outline:
                    "avora-button-outline border bg-transparent focus-visible:ring-[var(--avora-primary)]",

                ghost: "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white",
            },
            size: {
                xs: "h-6 px-1 text-xs",
                sm: "h-8 px-2 text-xs",
                default: "h-10 px-4 text-base",
                lg: "h-10 px-6 py-2 text-lg",
                icon: "h-10 w-10",
            },
            fullWidth: {
                true: "w-full",
            },
            rounded: {
                lg: "rounded-lg",
                md: "rounded-md",
                full: "rounded-full",
                no: "rounded-none",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "default",
            rounded: "no",
        },
    },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
