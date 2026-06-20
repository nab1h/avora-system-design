import type { HTMLAttributes } from 'react';
import {
    gridItemVariants,
    type GridItemVariants,
} from '../../styles/gridVariants';

export interface GridItemProps extends HTMLAttributes<HTMLDivElement> {
    span?: GridItemVariants['span'];
    mdSpan?: GridItemVariants['mdSpan'];
    lgSpan?: GridItemVariants['lgSpan'];
    rowSpan?: GridItemVariants['rowSpan'];
}

// Controls how many grid columns or rows one item should use.
export function GridItem({
    span,
    mdSpan,
    lgSpan,
    rowSpan,
    className,
    ...props
}: GridItemProps) {
    return (
        <div
            className={gridItemVariants({
                span,
                mdSpan,
                lgSpan,
                rowSpan,
                className,
            })}
            {...props}
        />
    );
}
