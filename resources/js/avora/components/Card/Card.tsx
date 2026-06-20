import type { HTMLAttributes } from 'react';
import { useTheme } from '../../providers/ThemeProvider';
import { cardVariants, type CardVariants } from '../../styles/cardVariants';

export interface CardProps extends HTMLAttributes<HTMLElement> {
    variant?: CardVariants['variant'];
    padding?: CardVariants['padding'];
    rounded?: CardVariants['rounded'];
}

// The main card container. Change its variants in styles/cardVariants.ts.
export function Card({
    variant,
    padding,
    rounded,
    className,
    style,
    children,
    ...props
}: CardProps) {
    const { colors } = useTheme();

    return (
        <article
            className={cardVariants({
                variant,
                padding,
                rounded,
                className,
            })}
            style={{
                backgroundColor:
                    variant === 'ghost' ? 'transparent' : colors.background,
                borderColor: `${colors.muted}33`,
                color: colors.text,
                ...style,
            }}
            {...props}
        >
            {children}
        </article>
    );
}
