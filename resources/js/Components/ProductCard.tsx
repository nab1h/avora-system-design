import { useTheme } from '@/avora-dash/providers/ThemeProvider';
import { type CSSProperties, type KeyboardEvent } from 'react';
import { LuHeart, LuSearch, LuShoppingCart, LuStar } from 'react-icons/lu';

interface ProductCardProps {
    title: string;
    price: string;
    img: string;
    hoverImg?: string;
    favoriteCount?: number;
    isFavorite?: boolean;
    badge?: string;
    onAddToCart?: () => void;
    onToggleFavorite?: () => void;
    onView?: () => void;
    className?: string;
    style?: CSSProperties;
}

export function ProductCard({
    title,
    price,
    img,
    hoverImg,
    favoriteCount = 0,
    isFavorite = false,
    badge,
    onAddToCart,
    onToggleFavorite,
    onView,
    className = '',
    style,
}: ProductCardProps) {
    const { colors } = useTheme();
    const actionClass =
        'grid h-10 w-10 place-items-center rounded-full text-white shadow-md transition hover:scale-105';

    return (
        <article
            onClick={onView}
            onKeyDown={(event: KeyboardEvent<HTMLElement>) => {
                if (onView && (event.key === 'Enter' || event.key === ' ')) {
                    event.preventDefault();
                    onView();
                }
            }}
            role={onView ? 'button' : undefined}
            tabIndex={onView ? 0 : undefined}
            className={`group cursor-pointer ${className}`}
            style={{ color: colors.text, ...style }}
        >
            <div
                className="relative flex h-72 items-center justify-center overflow-hidden sm:h-80"
                style={{ backgroundColor: colors.surface }}
            >
                <img
                    src={img}
                    alt={title}
                    className={`h-full w-full object-cover transition-opacity duration-500 ${hoverImg ? 'group-hover:opacity-0' : ''}`}
                />
                {hoverImg && (
                    <img
                        src={hoverImg}
                        alt={title}
                        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    />
                )}

                <button
                    type="button"
                    onClick={(event) => {
                        event.stopPropagation();
                        onToggleFavorite?.();
                    }}
                    className="absolute start-4 top-4 flex items-center gap-1 text-xs"
                    style={{ color: isFavorite ? colors.primary : colors.muted }}
                    aria-label="Toggle favorite"
                >
                    <LuHeart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} /> {favoriteCount}
                </button>
                {badge && (
                    <span
                        className="absolute end-4 top-4 px-3 py-1 text-[11px] font-bold tracking-wide text-white"
                        style={{ backgroundColor: colors.primary }}
                    >
                        {badge}
                    </span>
                )}

                <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <button
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation();
                            onView?.();
                        }}
                        className={actionClass}
                        style={{ backgroundColor: colors.primary }}
                        aria-label="View product"
                    >
                        <LuSearch className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation();
                            onAddToCart?.();
                        }}
                        className={actionClass}
                        style={{ backgroundColor: colors.primary }}
                        aria-label="Add to cart"
                    >
                        <LuShoppingCart className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation();
                            onToggleFavorite?.();
                        }}
                        className={actionClass}
                        style={{ backgroundColor: isFavorite ? colors.primary : colors.muted }}
                        aria-label="Add to favorites"
                    >
                        <LuHeart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                </div>
            </div>

            <div className="space-y-2 pt-4">
                <div className="flex items-start justify-between gap-3">
                    <h2 className="max-w-[70%] text-sm italic leading-5">{title}</h2>
                    <span className="shrink-0 text-sm font-medium">{price}</span>
                </div>
                <div className="flex gap-0.5" style={{ color: colors.muted }} aria-label="Rating: 5 out of 5">
                    {Array.from({ length: 5 }, (_, index) => (
                        <LuStar key={index} className="h-3.5 w-3.5 fill-current" />
                    ))}
                </div>
            </div>
        </article>
    );
}
