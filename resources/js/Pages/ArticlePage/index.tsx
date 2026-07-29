import { ArticlePreview } from "@/types";
import { Slider } from "@/avora-dash/components/Slider/Slider";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";
import { BlogCard } from "@/Components/BlogCard";


interface IProps{
    articles: ArticlePreview[];
}
export function ArticlePage({articles}:IProps) {
const { translate, direction } = useLanguage();
    return (
        <Slider
            ariaLabel={translate({
                ar: "مقالات أفورا",
                en: "AVORA articles",
            })}
            items={articles.map((article) => ({
                id: article.id,
                content: (
                    <BlogCard
                        title={
                            direction === "rtl"
                                ? article.title_ar
                                : article.title_en
                        }
                        imageSrc={
                            article.image
                                ? `/storage/${article.image}`
                                : "/images/article-samples/morning-fragrance-triptych.png"
                        }
                        imageAlt={
                            direction === "rtl"
                                ? article.title_ar
                                : article.title_en
                        }
                        buttonLabel={translate({
                            ar: "اقرأ المقال",
                            en: "READ POST",
                        })}
                    />
                ),
            }))}
            slidesPerView={1}
            spaceBetween={24}
            arrows
            pagination
            breakpoints={{
                768: { slidesPerView: 2 },
            }}
        />
    );
}
