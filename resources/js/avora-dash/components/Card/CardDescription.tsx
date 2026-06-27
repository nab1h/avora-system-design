import type { HTMLAttributes } from 'react';
import { useTheme } from '../../providers/ThemeProvider';

export type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

// A short description shown under the card title.
export function CardDescription({
    className = '',
    style,
    ...props
}: CardDescriptionProps) {
    const { colors } = useTheme();

    return (
        <p
            className={`text-sm leading-6 ${className}`}
            style={{ color: colors.muted, ...style }}
            {...props}
        />
    );
}
