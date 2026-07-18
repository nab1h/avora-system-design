import { useEffect, useId, useRef, useState } from 'react';
import { FiCheck, FiChevronDown, FiImage } from 'react-icons/fi';

export type ImageSelectOption<T extends string | number = number> = {
    value: T;
    label: string;
    image?: string | null;
};

type ImageSelectProps<T extends string | number = number> = {
    label: string;
    value: T | null;
    options: ImageSelectOption<T>[];
    onChange: (value: T) => void;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
};

export function ImageSelect<T extends string | number = number>({
    label,
    value,
    options,
    onChange,
    placeholder = 'Select an option',
    error,
    disabled = false,
}: ImageSelectProps<T>) {
    const labelId = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const selected = options.find((option) => option.value === value);

    useEffect(() => {
        const closeOnOutsideClick = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', closeOnOutsideClick);
        return () =>
            document.removeEventListener('mousedown', closeOnOutsideClick);
    }, []);

    const optionContent = (option: ImageSelectOption<T>) => (
        <>
            {option.image ? (
                <img
                    src={option.image}
                    alt=""
                    className="h-10 w-10 shrink-0 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                />
            ) : (
                <span className="avora-surface-muted avora-muted grid h-10 w-10 shrink-0 place-items-center rounded-xl">
                    <FiImage />
                </span>
            )}
            <span className="min-w-0 flex-1 truncate text-start text-sm font-medium">
                {option.label}
            </span>
        </>
    );

    return (
        <div ref={containerRef} className="relative space-y-2">
            <label id={labelId} className="block text-sm font-semibold">
                {label}
            </label>
            <button
                type="button"
                aria-labelledby={labelId}
                aria-haspopup="listbox"
                aria-expanded={open}
                disabled={disabled}
                className={`avora-surface flex min-h-14 w-full items-center gap-3 rounded-xl border px-3 text-start shadow-sm transition focus:outline-none focus:ring-2 focus:ring-[var(--avora-primary)]/30 ${
                    error
                        ? 'border-rose-500'
                        : 'avora-border hover:border-[var(--avora-primary)]'
                }`}
                onClick={() => setOpen((current) => !current)}
            >
                {selected ? (
                    optionContent(selected)
                ) : (
                    <span className="avora-muted flex-1 text-sm">
                        {placeholder}
                    </span>
                )}
                <FiChevronDown
                    className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {open && (
                <div
                    role="listbox"
                    className="avora-surface avora-border absolute z-50 mt-1 max-h-72 w-full overflow-auto rounded-xl border p-1.5 shadow-2xl"
                >
                    {options.map((option) => {
                        const isSelected = option.value === value;
                        return (
                            <button
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                key={option.value}
                                className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 transition ${
                                    isSelected
                                        ? 'bg-[var(--avora-primary)]/10 text-[var(--avora-primary)]'
                                        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                                onClick={() => {
                                    onChange(option.value);
                                    setOpen(false);
                                }}
                            >
                                {optionContent(option)}
                                {isSelected && <FiCheck className="shrink-0" />}
                            </button>
                        );
                    })}
                </div>
            )}

            {error && (
                <p className="text-xs font-medium text-rose-600">{error}</p>
            )}
        </div>
    );
}
