import type { HTMLAttributes } from 'react';
import { useTheme } from '../../providers/ThemeProvider';

export type CardMetaProps = HTMLAttributes<HTMLSpanElement>;

// Small information such as a category, label, or date.
export function CardMeta({
    className = '',
    style,
    ...props
}: CardMetaProps) {
    const { colors } = useTheme();

    return (
        <span
            className={`mt-5 block w-full text-center text-sm item-center ${className}`}
            style={{ color: colors.muted, ...style }}
            {...props}
        />
    );
}
