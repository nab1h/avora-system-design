import type { ElementType, HTMLAttributes } from 'react';
import { useLanguage } from '../../providers/LanguageProvider';
import { useTheme } from '../../providers/ThemeProvider';

export type SectionTitleText = Record<'ar' | 'en', string>;

export interface SectionTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    /** The semantic heading level to render. */
    as?: ElementType;
    /** Arabic and English copies. The active language is selected automatically. */
    text?: SectionTitleText;
    /** Additional classes for the decorative line beneath the title. */
    lineClassName?: string;
}

// Reusable title for page sections. Use `as` to match the page heading outline.
export function SectionTitle({
    as: Component = 'h2',
    className = '',
    children,
    style,
    text,
    lineClassName = '',
    ...props
}: SectionTitleProps) {
    const { colors } = useTheme();
    const { translate } = useLanguage();

    return (
        <Component
            className={`flex w-full flex-col items-center gap-2 text-center font-sans text-sm font-medium uppercase leading-none tracking-[0.22em] ${className}`}
            style={{ color: colors.text, ...style }}
            {...props}
        >
            <span>{text ? translate(text) : children}</span>
            <span
                aria-hidden="true"
                className={`h-px w-48 bg-current opacity-80 ${lineClassName}`}
            />
        </Component>
    );
}
