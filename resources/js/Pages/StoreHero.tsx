import { Slider, type SliderItem } from "@/avora-dash/components/Slider";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";
import { Link } from "@inertiajs/react";

export function StoreHero() {
    const { translate, direction } = useLanguage();
    const slides: SliderItem[] = [
        {
            id: "gold",
            ariaLabel: "Avora Gold",
            content: (
                <HeroSlide
                    image="/images/avora-campaign/avora-gold.png"
                    title={translate({
                        ar: "أناقة ترى بها العالم",
                        en: "See the world in style",
                    })}
                    label={translate({
                        ar: "مجموعة جديدة",
                        en: "New collection",
                    })}
                />
            ),
        },
        {
            id: "noir",
            ariaLabel: "Avora Noir",
            content: (
                <HeroSlide
                    image="/images/avora-campaign/avora-noir.png"
                    title={translate({
                        ar: "اختَر نظارتك المميزة",
                        en: "Find your signature frame",
                    })}
                    label={translate({ ar: "تسوّق الآن", en: "Shop now" })}
                />
            ),
        },
        {
            id: "rose",
            ariaLabel: "Avora Rose",
            content: (
                <HeroSlide
                    image="/images/avora-campaign/avora-rose.png"
                    title={translate({
                        ar: "تفاصيل صُنعت لتُرى",
                        en: "Details made to be seen",
                    })}
                    label={translate({
                        ar: "اكتشف المجموعة",
                        en: "Discover collection",
                    })}
                />
            ),
        },
    ];
    return (
        <section dir={direction} className="w-full">
            <Slider
                items={slides}
                ariaLabel={translate({
                    ar: "بانرات المتجر",
                    en: "Store banners",
                })}
                loop
                autoplay={5500}
                pauseOnMouseEnter
                arrows
                arrowsPosition="inside"
                pagination
                paginationPosition="inside"
                paginationType="bullets"
                className="[&_.swiper]:h-[62vh] [&_.swiper]:min-h-[440px] [&_.swiper]:max-h-[680px]"
            />
        </section>
    );
}

function HeroSlide({
    image,
    title,
    label,
}: {
    image: string;
    title: string;
    label: string;
}) {
    return (
        <Link
            href={route("shopping.index")}
            className="relative block h-full overflow-hidden"
        >
            <img
                src={image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/20 to-transparent" />
            <div className="relative flex h-full max-w-7xl items-end px-6 pb-16 sm:px-12 lg:px-20">
                <div className="max-w-xl text-white">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[.3em] text-white/75">
                        {label}
                    </p>
                    <h1 className="text-4xl font-black leading-tight sm:text-6xl">
                        {title}
                    </h1>
                    <span className="mt-7 inline-block border-b-2 border-white pb-2 text-sm font-bold">
                        {label}
                    </span>
                </div>
            </div>
        </Link>
    );
}
