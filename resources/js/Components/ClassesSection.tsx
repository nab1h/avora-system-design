import { useTheme } from "@/avora-dash/providers/ThemeProvider";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";
import { Link, usePage } from "@inertiajs/react";
import { LuArrowUpLeft } from "react-icons/lu";

type ProductClass = {
    id: number;
    name_ar: string;
    name_en: string;
    img: string | null;
};
export function ClassesSection() {
    const { colors } = useTheme();
    const { direction, translate } = useLanguage();
    const classes = ((usePage().props as any).storeClasses ??
        []) as ProductClass[];
    const genderClasses = classes.filter((item) =>
        /رجال|نساء|men|women/i.test(`${item.name_ar} ${item.name_en}`),
    );
    if (!genderClasses.length) return null;
    return (
        <section className="py-4 sm:py-8">
            <div className="grid gap-5 md:grid-cols-2">
                {genderClasses.slice(0, 2).map((item) => (
                    <Link
                        key={item.id}
                        href={`${route("shopping.index")}?class=${item.id}`}
                        className="group relative aspect-[1/.9] overflow-hidden"
                        style={{ backgroundColor: colors.muted }}
                    >
                        {item.img ? (
                            <img
                                src={`/storage/${item.img}`}
                                alt={
                                    direction === "rtl"
                                        ? item.name_ar
                                        : item.name_en
                                }
                                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                            />
                        ) : (
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.muted})`,
                                }}
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                            <h3 className="text-2xl font-black sm:text-3xl">
                                {direction === "rtl"
                                    ? item.name_ar
                                    : item.name_en}
                            </h3>
                            <span className="mt-3 inline-flex items-center gap-2 border-b border-white pb-1 text-sm font-bold">
                                {translate({
                                    ar: "تسوّق الآن",
                                    en: "Shop now",
                                })}
                                <LuArrowUpLeft />
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
