import { Grid, GridItem } from "@/avora-dash/components/Grid";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";

export function StoreHero() {
        const { translate, direction } = useLanguage();

    return (
        <Grid
            layout="one"
            gap="sm"
            padding="none"
            background="transparent"
            rounded="none"
            align="stretch"
            className="lg:h-[590px] lg:!grid-cols-[2.4fr_1fr_1fr]"
        >
            <GridItem dir={direction} className="min-h-[420px]">
                <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#f3eee9] p-8 text-center text-slate-700">
                    <img
                        src="/images/avora-campaign/avora-gold.png"
                        alt="AVORA perfume"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-white/15" />
                    <div className="relative mt-20 bg-white/65 px-8 py-6 backdrop-blur-[2px]">
                        <h2 className="font-playfair text-4xl font-light uppercase tracking-wide lg:text-5xl">
                            {translate({
                                ar: "عطر يروي حكايتك",
                                en: "A scent that tells your story",
                            })}
                        </h2>
                        <p className="mt-6 text-xs uppercase tracking-[0.35em] text-slate-400">
                            {translate({
                                ar: "مجموعة أفورا الفاخرة",
                                en: "The AVORA luxury collection",
                            })}
                        </p>
                    </div>
                </div>
            </GridItem>

            <GridItem className="grid min-h-[590px] grid-rows-[1fr_1.85fr] gap-3">
                <div className="relative flex items-center justify-center overflow-hidden bg-[#2f3033] p-6 text-center text-white">
                    <img
                        src="/images/avora-campaign/avora-noir.png"
                        alt="AVORA Noir perfume"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/35" />
                    <div className="relative">
                        <p className="text-[10px] font-bold uppercase tracking-[0.35em]">
                            {translate({
                                ar: "إصدار جديد",
                                en: "New fragrance",
                            })}
                        </p>
                        <h3 className="mt-6 text-2xl font-medium uppercase leading-tight tracking-[0.12em]">
                            {translate({
                                ar: "أفورا نوار",
                                en: "AVORA Noir",
                            })}
                        </h3>
                    </div>
                </div>

                <div className="relative flex items-end justify-center overflow-hidden bg-[#f7f4ef] p-6 text-center text-slate-700">
                    <img
                        src="/images/avora-campaign/avora-gold.png"
                        alt="AVORA Gold perfume"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="relative mb-0 w-full bg-white/80 px-5 py-5 backdrop-blur-[2px]">
                        <p className="font-playfair text-sm italic">
                            {translate({
                                ar: "أناقة تدوم",
                                en: "Lasting elegance",
                            })}
                        </p>
                        <p className="mt-4 text-xs font-bold uppercase tracking-[0.3em]">
                            {translate({
                                ar: "اكتشف المجموعة",
                                en: "Discover the collection",
                            })}
                        </p>
                    </div>
                </div>
            </GridItem>

            <GridItem className="grid min-h-[590px] grid-rows-[1.08fr_0.92fr] gap-3">
                <div className="relative flex items-center justify-center overflow-hidden bg-[#e8ddd9] p-5 text-center text-slate-700">
                    <img
                        src="/images/avora-campaign/avora-rose.png"
                        alt="AVORA Rose perfume"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="relative w-full bg-white/75 px-5 py-5 backdrop-blur-[2px]">
                        <p className="font-playfair text-sm italic">
                            {translate({
                                ar: "نفحات وردية ناعمة",
                                en: "Delicate floral notes",
                            })}
                        </p>
                        <p className="mt-4 text-xs font-bold uppercase tracking-[0.3em]">
                            {translate({
                                ar: "أفورا روز",
                                en: "AVORA Rose",
                            })}
                        </p>
                    </div>
                </div>

                <div className="relative flex items-center justify-center overflow-hidden bg-[#d8c5bf] p-6 text-center text-white">
                    <img
                        src="/images/avora-campaign/avora-noir.png"
                        alt="AVORA perfume delivery"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/45" />
                    <div className="relative">
                        <p className="text-4xl font-bold uppercase">
                            {translate({ ar: "شحن", en: "Free" })}
                        </p>
                        <p className="mt-2 text-2xl uppercase tracking-[0.1em]">
                            {translate({
                                ar: "مجاني",
                                en: "Shipping",
                            })}
                        </p>
                    </div>
                </div>
            </GridItem>
        </Grid>
    );
}
