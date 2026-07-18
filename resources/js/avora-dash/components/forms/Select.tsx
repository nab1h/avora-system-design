import {
    useEffect,
    useId,
    useRef,
    useState,
    type KeyboardEvent,
    type ReactNode,
} from 'react';
import { FiCheck, FiChevronDown, FiImage, FiX } from 'react-icons/fi';

export type SelectValue = string | number;

export type SelectOption<T extends SelectValue = string> = {
    value: T;
    label: string;
    description?: string;
    image?: string | null;
    disabled?: boolean;
};

export type SelectProps<T extends SelectValue = string> = {
    options: SelectOption<T>[];
    value: T | null;
    onChange: (value: T | null) => void;
    label?: string;
    placeholder?: string;
    error?: string;
    hint?: string;
    emptyMessage?: string;
    disabled?: boolean;
    clearable?: boolean;
    required?: boolean;
    className?: string;
    leadingIcon?: ReactNode;
};

export function Select<T extends SelectValue = string>({
    options,
    value,
    onChange,
    label,
    placeholder = 'Select an option',
    error,
    hint,
    emptyMessage = 'No options available',
    disabled = false,
    clearable = false,
    required = false,
    className = '',
    leadingIcon,
}: SelectProps<T>) {
    const labelId = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const selected = options.find((option) => option.value === value);
    const usesImages = options.some((option) => option.image !== undefined);

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

    useEffect(() => {
        if (open && activeIndex >= 0) {
            optionRefs.current[activeIndex]?.focus();
        }
    }, [activeIndex, open]);

    const openMenu = () => {
        if (disabled) return;
        const selectedIndex = options.findIndex(
            (option) => option.value === value && !option.disabled,
        );
        const firstEnabledIndex = options.findIndex(
            (option) => !option.disabled,
        );
        setActiveIndex(
            selectedIndex >= 0 ? selectedIndex : firstEnabledIndex,
        );
        setOpen(true);
    };

    const moveFocus = (direction: 1 | -1) => {
        const enabledIndexes = options
            .map((option, index) => (!option.disabled ? index : -1))
            .filter((index) => index >= 0);
        if (!enabledIndexes.length) return;

        const currentPosition = enabledIndexes.indexOf(activeIndex);
        const nextPosition =
            (currentPosition + direction + enabledIndexes.length) %
            enabledIndexes.length;
        setActiveIndex(enabledIndexes[nextPosition]);
    };

    const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            if (!open) openMenu();
            else moveFocus(event.key === 'ArrowDown' ? 1 : -1);
        }
    };

    const handleOptionKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            moveFocus(event.key === 'ArrowDown' ? 1 : -1);
        }
        if (event.key === 'Escape') {
            setOpen(false);
        }
    };

    const optionContent = (option: SelectOption<T>) => (
        <>
            {usesImages &&
                (option.image ? (
                    <img
                        src={option.image}
                        alt=""
                        className="h-11 w-11 shrink-0 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                    />
                ) : (
                    <span className="avora-surface-muted avora-muted grid h-11 w-11 shrink-0 place-items-center rounded-xl">
                        <FiImage aria-hidden="true" />
                    </span>
                ))}
            <span className="min-w-0 flex-1 text-start">
                <span className="block truncate text-sm font-semibold">
                    {option.label}
                </span>
                {option.description && (
                    <span className="avora-muted mt-0.5 block truncate text-xs">
                        {option.description}
                    </span>
                )}
            </span>
        </>
    );

    return (
        <div
            ref={containerRef}
            className={`relative space-y-2 ${className}`}
        >
            {label && (
                <label id={labelId} className="block text-sm font-semibold">
                    {label}
                    {required && (
                        <span className="ms-1 text-rose-500" aria-hidden="true">
                            *
                        </span>
                    )}
                </label>
            )}

            <button
                type="button"
                aria-labelledby={label ? labelId : undefined}
                aria-label={label ? undefined : placeholder}
                aria-haspopup="listbox"
                aria-expanded={open}
                disabled={disabled}
                className={`avora-surface flex min-h-14 w-full items-center gap-3 rounded-xl border px-3 text-start shadow-sm transition focus:outline-none focus:ring-2 focus:ring-[var(--avora-primary)]/30 disabled:cursor-not-allowed disabled:opacity-60 ${
                    error
                        ? 'border-rose-500'
                        : 'avora-border hover:border-[var(--avora-primary)]'
                }`}
                onClick={() => (open ? setOpen(false) : openMenu())}
                onKeyDown={handleTriggerKeyDown}
            >
                {leadingIcon && (
                    <span className="avora-muted shrink-0">{leadingIcon}</span>
                )}
                {selected ? (
                    optionContent(selected)
                ) : (
                    <span className="avora-muted flex-1 text-sm">
                        {placeholder}
                    </span>
                )}
                {clearable && selected && !disabled && (
                    <span
                        role="button"
                        tabIndex={-1}
                        aria-label="Clear selection"
                        className="avora-muted grid h-7 w-7 place-items-center rounded-full hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800"
                        onClick={(event) => {
                            event.stopPropagation();
                            onChange(null);
                        }}
                    >
                        <FiX aria-hidden="true" />
                    </span>
                )}
                <FiChevronDown
                    aria-hidden="true"
                    className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {open && (
                <div
                    role="listbox"
                    aria-labelledby={label ? labelId : undefined}
                    className="avora-surface avora-border absolute z-50 mt-1 max-h-72 w-full overflow-auto rounded-xl border p-1.5 shadow-2xl"
                >
                    {options.length === 0 ? (
                        <p className="avora-muted px-3 py-5 text-center text-sm">
                            {emptyMessage}
                        </p>
                    ) : (
                        options.map((option, index) => {
                            const isSelected = option.value === value;
                            return (
                                <button
                                    ref={(element) => {
                                        optionRefs.current[index] = element;
                                    }}
                                    type="button"
                                    role="option"
                                    aria-selected={isSelected}
                                    disabled={option.disabled}
                                    key={option.value}
                                    className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 transition focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--avora-primary)]/30 disabled:cursor-not-allowed disabled:opacity-45 ${
                                        isSelected
                                            ? 'bg-[var(--avora-primary)]/10 text-[var(--avora-primary)]'
                                            : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                    onKeyDown={handleOptionKeyDown}
                                    onFocus={() => setActiveIndex(index)}
                                    onClick={() => {
                                        onChange(option.value);
                                        setOpen(false);
                                    }}
                                >
                                    {optionContent(option)}
                                    {isSelected && (
                                        <FiCheck
                                            aria-hidden="true"
                                            className="shrink-0"
                                        />
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>
            )}

            {(error || hint) && (
                <p
                    className={`text-xs font-medium ${
                        error ? 'text-rose-600' : 'avora-muted'
                    }`}
                >
                    {error ?? hint}
                </p>
            )}
        </div>
    );
}
