import { SectionTitle } from '@/avora-dash/components/SectionTitle';
import { Slider, type SliderItem } from '@/avora-dash/components/Slider';
import { useLanguage } from '@/avora-dash/providers/LanguageProvider';
import { useTheme } from '@/avora-dash/providers/ThemeProvider';
import { useMemo, type CSSProperties } from 'react';

export type StoreBrand = {
    id: number;
    name_ar: string;
    name_en: string;
    image: string | null;
};

export function BrandsSlider({ brands }: { brands: StoreBrand[] }) {
    const { colors } = useTheme();
    const { direction, translate } = useLanguage();
    const slides = useMemo<SliderItem[]>(
        () =>
            brands.map((brand) => ({
                id: brand.id,
                ariaLabel: direction === 'rtl' ? brand.name_ar : brand.name_en,
                content: (
                    <article className="flex h-28 items-center justify-center px-4">
                        {brand.image ? (
                            <img
                                src={`/storage/${brand.image}`}
                                alt={direction === 'rtl' ? brand.name_ar : brand.name_en}
                                className="h-20 w-full max-w-36 object-contain opacity-30 grayscale transition duration-300 hover:opacity-70"
                            />
                        ) : (
                            <div
                                className="h-16 w-32 opacity-30"
                                style={{ backgroundColor: colors.primary }}
                            />
                        )}
                    </article>
                ),
            })),
        [brands, colors.primary, direction],
    );

    if (!brands.length) return null;

    return (
        <section className="space-y-14">
            <header className="text-center">
                <SectionTitle
                    text={{ ar: 'برانداتنا', en: 'OUR BRANDS' }}
                    lineClassName="!w-[152px]"
                    className="!text-[13px] !font-medium"
                />
            </header>
            <div
                style={{
                    '--slider-control-background': 'transparent',
                    '--slider-control-color': colors.primary,
                    '--slider-pagination-color': colors.primary,
                } as CSSProperties}
            >
                <Slider
                    items={slides}
                    ariaLabel={translate({ ar: 'سلايدر البراندات', en: 'Brands slider' })}
                    slidesPerView={2}
                    spaceBetween={24}
                    breakpoints={{
                        640: { slidesPerView: 4, spaceBetween: 40 },
                        1024: { slidesPerView: 6, spaceBetween: 56 },
                    }}
                    arrows
                    arrowsPosition="inside"
                    arrowClassName="!shadow-none"
                    centeredSlides
                    loop={false}
                    className="px-10"
                />
            </div>
        </section>
    );
}
