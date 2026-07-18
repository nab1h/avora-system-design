import {
    Select,
    type SelectOption,
} from '@/avora-dash/components/forms/Select';

/**
 * @deprecated Prefer the more flexible `Select` component.
 * This wrapper remains available for existing screens.
 */
export type ImageSelectOption<T extends string | number = number> =
    SelectOption<T>;

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
    onChange,
    ...props
}: ImageSelectProps<T>) {
    return (
        <Select
            {...props}
            onChange={(value) => {
                if (value !== null) onChange(value);
            }}
        />
    );
}
