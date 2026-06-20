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
                    "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 focus-visible:ring-emerald-500",

                danger: "bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-500",

                secondary:
                    "bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-400 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",

                outline:
                    "border border-emerald-600 bg-transparent text-emerald-600 hover:bg-emerald-50 focus-visible:ring-emerald-500 dark:hover:bg-emerald-950",

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
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "default",
            rounded: "md",
        },
    },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
