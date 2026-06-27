import type { CSSProperties, HTMLAttributes } from 'react';
import { useTheme } from '../../providers/ThemeProvider';
import {
    gridVariants,
    type GridVariants,
} from '../../styles/gridVariants';

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
    layout?: GridVariants['layout'];
    gap?: GridVariants['gap'];
    padding?: GridVariants['padding'];
    width?: GridVariants['width'];
    align?: GridVariants['align'];
    background?: GridVariants['background'];
    rounded?: GridVariants['rounded'];
    minItemWidth?: string;
    backgroundImage?: string;
    backgroundImageOpacity?: number;
    backgroundImageSize?: CSSProperties['backgroundSize'];
    backgroundImagePosition?: CSSProperties['backgroundPosition'];
    backgroundImageRepeat?: CSSProperties['backgroundRepeat'];
    backgroundImageAttachment?: CSSProperties['backgroundAttachment'];
}

// A responsive grid for cards, dashboards, and page sections.
export function Grid({
    layout,
    gap,
    padding,
    width,
    align,
    background,
    rounded,
    minItemWidth,
    backgroundImage,
    backgroundImageOpacity = 1,
    backgroundImageSize = 'cover',
    backgroundImagePosition = 'center',
    backgroundImageRepeat = 'no-repeat',
    backgroundImageAttachment = 'scroll',
    className,
    style,
    children,
    ...props
}: GridProps) {
    const { colors } = useTheme();

    // Use minItemWidth to create automatic columns without breakpoints.
    const automaticColumns: CSSProperties | undefined = minItemWidth
        ? {
              gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${minItemWidth}), 1fr))`,
          }
        : undefined;

    const backgroundStyle: CSSProperties = (() => {
        switch (background) {
            case 'surface':
                return { backgroundColor: colors.background };
            case 'muted':
                return { backgroundColor: `${colors.muted}14` };
            case 'primary':
                return { backgroundColor: `${colors.primary}14` };
            case 'gradient':
                return {
                    background: `linear-gradient(135deg, ${colors.primary}1f, ${colors.background} 60%, ${colors.secondary}1f)`,
                };
            default:
                return {};
        }
    })();

    // Keep the image opacity between fully transparent and fully visible.
    const safeImageOpacity = Math.min(
        1,
        Math.max(0, backgroundImageOpacity),
    );

    return (
        <div
            className={gridVariants({
                // The inline template replaces this layout when auto-fit is used.
                layout,
                gap,
                padding,
                width,
                align,
                background,
                rounded,
                className: `relative isolate ${className ?? ''}`,
            })}
            style={{ ...backgroundStyle, ...automaticColumns, ...style }}
            {...props}
        >
            {backgroundImage && (
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit]"
                    style={{
                        backgroundImage: `url("${backgroundImage}")`,
                        backgroundSize: backgroundImageSize,
                        backgroundPosition: backgroundImagePosition,
                        backgroundRepeat: backgroundImageRepeat,
                        backgroundAttachment: backgroundImageAttachment,
                        opacity: safeImageOpacity,
                    }}
                />
            )}

            {children}
        </div>
    );
}
