import type { ElementType, HTMLAttributes } from 'react';
import { useTheme } from '../../providers/ThemeProvider';
import {
    containerVariants,
    type ContainerVariants,
} from '../../styles/containerVariants';

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
    as?: ElementType;
    width?: ContainerVariants['width'];
    centered?: ContainerVariants['centered'];
    gutter?: ContainerVariants['gutter'];
    paddingY?: ContainerVariants['paddingY'];
    marginY?: ContainerVariants['marginY'];
    background?: ContainerVariants['background'];
    rounded?: ContainerVariants['rounded'];
    shadow?: ContainerVariants['shadow'];
    bordered?: ContainerVariants['bordered'];
    minHeight?: ContainerVariants['minHeight'];
    overflow?: ContainerVariants['overflow'];
}

// Page container. Change width, spacing, and appearance using its props.
export function Container({
    as: Component = 'div',
    width,
    centered,
    gutter,
    paddingY,
    marginY,
    background,
    rounded,
    shadow,
    bordered,
    minHeight,
    overflow,
    className,
    style,
    ...props
}: ContainerProps) {
    const { colors } = useTheme();

    const backgroundStyle = (() => {
        switch (background) {
            case 'surface':
                return { backgroundColor: colors.background };
            case 'muted':
                return { backgroundColor: `${colors.muted}14` };
            case 'primary':
                return { backgroundColor: colors.primary, color: '#ffffff' };
            case 'gradient':
                return {
                    background: `linear-gradient(135deg, ${colors.primary}1f, ${colors.background} 60%, ${colors.secondary}1f)`,
                };
            default:
                return {};
        }
    })();

    return (
        <Component
            className={containerVariants({
                width,
                centered,
                gutter,
                paddingY,
                marginY,
                background,
                rounded,
                shadow,
                bordered,
                minHeight,
                overflow,
                className,
            })}
            style={{
                ...backgroundStyle,
                borderColor: `${colors.muted}2b`,
                ...style,
            }}
            {...props}
        />
    );
}
