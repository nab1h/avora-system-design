import {
    FiAlertCircle,
    FiAlertTriangle,
    FiCheckCircle,
    FiInfo,
    FiX,
} from 'react-icons/fi';
import type { HTMLAttributes, ReactNode } from 'react';

export type AlertVariant =
    | 'info'
    | 'success'
    | 'warning'
    | 'danger'
    | 'neutral';

export type AlertProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
    variant?: AlertVariant;
    title?: ReactNode;
    children: ReactNode;
    icon?: ReactNode | false;
    onDismiss?: () => void;
    dismissLabel?: string;
    floating?: boolean;
    placement?: 'top-start' | 'top-center' | 'top-end' | 'bottom-center';
};

const variants: Record<AlertVariant, string> = {
    info: 'border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-100',
    success:
        'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-100',
    warning:
        'border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-100',
    danger: 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-100',
    neutral:
        'border-slate-200 bg-slate-50 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100',
};

const icons: Record<AlertVariant, ReactNode> = {
    info: <FiInfo />,
    success: <FiCheckCircle />,
    warning: <FiAlertTriangle />,
    danger: <FiAlertCircle />,
    neutral: <FiInfo />,
};

const placements = {
    'top-start': 'fixed start-4 top-4 z-[100] w-[calc(100%-2rem)] sm:w-96',
    'top-center':
        'fixed start-1/2 top-4 z-[100] w-[calc(100%-2rem)] -translate-x-1/2 sm:w-96',
    'top-end': 'fixed end-4 top-4 z-[100] w-[calc(100%-2rem)] sm:w-96',
    'bottom-center':
        'fixed bottom-4 start-1/2 z-[100] w-[calc(100%-2rem)] -translate-x-1/2 sm:w-96',
};

export function Alert({
    variant = 'info',
    title,
    children,
    icon,
    onDismiss,
    dismissLabel = 'Dismiss',
    floating = false,
    placement = 'top-end',
    className = '',
    ...props
}: AlertProps) {
    const displayedIcon = icon === false ? null : (icon ?? icons[variant]);

    return (
        <div
            role={variant === 'danger' ? 'alert' : 'status'}
            className={`flex gap-3 rounded-2xl border p-4 ${
                floating
                    ? `${placements[placement]} shadow-2xl motion-safe:animate-[alert-in_.25s_ease-out]`
                    : 'shadow-sm'
            } ${variants[variant]} ${className}`}
            {...props}
        >
            {displayedIcon && (
                <span className="mt-0.5 shrink-0 text-xl" aria-hidden="true">
                    {displayedIcon}
                </span>
            )}
            <div className="min-w-0 flex-1">
                {title && (
                    <div className="mb-1 font-bold leading-6">{title}</div>
                )}
                <div className="text-sm leading-6 opacity-90">{children}</div>
            </div>
            {onDismiss && (
                <button
                    type="button"
                    aria-label={dismissLabel}
                    className="-m-1 grid h-8 w-8 shrink-0 place-items-center rounded-full opacity-70 transition hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10"
                    onClick={onDismiss}
                >
                    <FiX aria-hidden="true" />
                </button>
            )}
        </div>
    );
}
