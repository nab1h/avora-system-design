import {
    CardDescription,
    CardFooter,
    CardImage,
    CardPrice,
    CardProps,
} from "@/avora-dash/components/Card";
import { useTheme } from "@/avora-dash/providers/ThemeProvider";
import { cardVariants } from "@/avora-dash/styles/cardVariants";
import { CSSProperties } from "react";
import { LuHeart, LuSearch, LuShoppingCart } from "react-icons/lu";

interface IProps extends CardProps {
    desc: string;
    price: string;
    img: string;
    hoverImg?: string;
    className?: string;
    style?: CSSProperties;
}
export function ProductCard({
    desc,
    price,
    img,
    variant,
    padding,
    rounded,
    className,
    hoverImg,
    ...style
}: IProps) {
    const { colors } = useTheme();
    return (
        <>
            <article
                className={cardVariants({
                    variant,
                    padding,
                    rounded,
                    className: `group ${className ?? ""}`,
                })}
                style={{
                    backgroundColor:
                        variant === "ghost" ? "transparent" : colors.surface,
                    borderColor: colors.border,
                    color: colors.text,
                    ...style,
                }}
            >
                <div className="relative">
                    <CardImage src={img} hoverSrc={hoverImg} />

                    <div className="absolute inset-x-0 bottom-5 z-10 flex translate-y-3 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <button
                            type="button"
                            aria-label="بحث عن المنتج"
                            title="بحث"
                            className="grid h-10 w-10 place-items-center rounded-full bg-white text-slate-800 shadow-md transition hover:bg-slate-900 hover:text-white"
                        >
                            <LuSearch className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            aria-label="إضافة إلى عربة التسوق"
                            title="إضافة إلى السلة"
                            className="grid h-10 w-10 place-items-center rounded-full bg-white text-slate-800 shadow-md transition hover:bg-slate-900 hover:text-white"
                        >
                            <LuShoppingCart className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            aria-label="حفظ المنتج لوقت لاحق"
                            title="حفظ لاحقًا"
                            className="grid h-10 w-10 place-items-center rounded-full bg-white text-slate-800 shadow-md transition hover:bg-slate-900 hover:text-white"
                        >
                            <LuHeart className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                <CardFooter>
                    <CardDescription>{desc}</CardDescription>
                    <CardPrice>{price}</CardPrice>
                </CardFooter>
            </article>
        </>
    );
}
