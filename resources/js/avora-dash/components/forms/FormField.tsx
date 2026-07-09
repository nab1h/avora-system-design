import { forwardRef, type InputHTMLAttributes } from 'react';

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
};

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
    function FormField(
        { label, error, className = '', placeholder, ...props },
        ref,
    ) {
        return (
            <div className="avora-floating-field">
                <input
                    ref={ref}
                    className={`${error ? 'avora-floating-field-error' : 'avora-form-field'} ${className}`}
                    placeholder={placeholder ?? ' '}
                    {...props}
                />
                <label>
                    {[...label].map((character, index) => (
                        <span
                            key={`${character}-${index}`}
                            style={{ transitionDelay: `${index * 50}ms` }}
                        >
                            {character === ' ' ? '\u00a0' : character}
                        </span>
                    ))}
                </label>
                {error && (
                    <span className="mt-1.5 block text-xs font-medium text-rose-600">
                        {error}
                    </span>
                )}
            </div>
        );
    },
);
