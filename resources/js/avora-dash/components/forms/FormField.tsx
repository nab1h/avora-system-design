import { forwardRef, type InputHTMLAttributes } from 'react';

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
};

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
    function FormField({ label, error, className = '', ...props }, ref) {
        return (
            <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {label}
                </span>
                <input
                    ref={ref}
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 dark:bg-slate-900 dark:text-white ${error ? 'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10' : 'avora-form-field border-slate-200 dark:border-slate-700'} ${className}`}
                    {...props}
                />
                {error && (
                    <span className="mt-1.5 block text-xs font-medium text-rose-600">
                        {error}
                    </span>
                )}
            </label>
        );
    },
);
