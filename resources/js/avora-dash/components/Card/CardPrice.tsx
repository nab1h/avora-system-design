import type { HTMLAttributes } from 'react';
import { useTheme } from '../../providers/ThemeProvider';

export type CardPriceProps = HTMLAttributes<HTMLSpanElement>;

// Shows a price using the primary color from the current theme.
export function CardPrice({
    className = '',
    style,
    ...props
}: CardPriceProps) {
    const { colors } = useTheme();

    return (
        <span
            className={`text-lg font-bold ${className}`}
            style={{ color: colors.primary, ...style }}
            {...props}
        />
    );
}
