import { Container } from "@/avora-dash/components/Container/Container";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";
import { StoreLayout } from "@/Layouts/StoreLayout";
import type { PageProps } from "@/types";
import { Head, Link, usePage } from "@inertiajs/react";
import type { ReactNode } from "react";
import { LuArrowLeft } from "react-icons/lu";

interface ArticleImage {
    id: number;
    image: string;
}

interface Article {
    id: number;
    title_ar: string;
    title_en: string;
    excerpt_ar: string | null;
    excerpt_en: string | null;
    content_ar: string | null;
    content_en: string | null;
    image: string | null;
    published_at: string | null;
    images: ArticleImage[];
}

type ArticlePreview = Pick<
    Article,
    | "id"
    | "title_ar"
    | "title_en"
    | "excerpt_ar"
    | "excerpt_en"
    | "image"
    | "published_at"
> & {
    slug_ar: string;
    slug_en: string;
};

interface ArticleShowPageProps extends PageProps {
    article: Article;
    relatedArticles: ArticlePreview[];
}

export default function ArticleShow() {
    const { translate, direction } = useLanguage();

    const { article, relatedArticles } = usePage<ArticleShowPageProps>().props;

    const title = direction === "rtl" ? article.title_ar : article.title_en;

    const excerpt =
        direction === "rtl" ? article.excerpt_ar : article.excerpt_en;

    const content =
        direction === "rtl" ? article.content_ar : article.content_en;

    const publishedDate = article.published_at
        ? new Intl.DateTimeFormat(direction === "rtl" ? "ar-EG" : "en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
          }).format(new Date(article.published_at))
        : null;

    return (
        <>
            <Head title={title} />

            <main
                className="min-h-screen bg-slate-50 py-8 dark:bg-slate-950 sm:py-12"
                dir={direction}
            >
                <Container width="lg">
                    <Link
                        href={`${route("home")}#blog`}
                        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400"
                    >
                        <LuArrowLeft
                            className={`h-4 w-4 ${
                                direction === "rtl" ? "rotate-180" : ""
                            }`}
                        />

                        {translate({
                            ar: "العودة إلى المقالات",
                            en: "Back to articles",
                        })}
                    </Link>

                    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start">
                        <article className="max-w-3xl">
                            {publishedDate && (
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {publishedDate}
                                </p>
                            )}

                            <h1 className="mt-3 text-3xl font-black leading-tight text-slate-950 dark:text-white sm:text-5xl">
                                {title}
                            </h1>

                            {excerpt && (
                                <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
                                    {excerpt}
                                </p>
                            )}

                            {article.image && (
                                <img
                                    src={`/storage/${article.image}`}
                                    alt={title}
                                    className="mt-8 aspect-[16/9] w-full rounded-3xl object-cover"
                                />
                            )}

                            {content && (
                                <div className="mt-8 whitespace-pre-line text-base leading-9 text-slate-700 dark:text-slate-200">
                                    {content}
                                </div>
                            )}

                            {article.images.length > 0 && (
                                <div className="mt-8 space-y-5">
                                    {article.images.map((image, index) => (
                                        <img
                                            key={image.id}
                                            src={`/storage/${image.image}`}
                                            alt={`${title} ${index + 1}`}
                                            loading="lazy"
                                            className="w-full rounded-3xl object-cover"
                                        />
                                    ))}
                                </div>
                            )}
                        </article>

                        {relatedArticles.length > 0 && (
                            <aside
                                className="avora-surface avora-border order-first border p-5 lg:order-none lg:sticky lg:top-6"
                                aria-label={translate({
                                    ar: "مقالات أخرى",
                                    en: "More articles",
                                })}
                            >
                                <h2
                                    className="border-b pb-3 text-sm font-semibold uppercase tracking-[0.18em]"
                                    style={{
                                        borderColor: "var(--avora-muted)",
                                    }}
                                >
                                    {translate({
                                        ar: "مقالات أخرى",
                                        en: "More articles",
                                    })}
                                </h2>
                                <div className="mt-4 space-y-4">
                                    {relatedArticles.map((relatedArticle) => {
                                        const relatedTitle =
                                            direction === "rtl"
                                                ? relatedArticle.title_ar
                                                : relatedArticle.title_en;
                                        const relatedExcerpt =
                                            direction === "rtl"
                                                ? relatedArticle.excerpt_ar
                                                : relatedArticle.excerpt_en;

                                        return (
                                            <Link
                                                key={relatedArticle.id}
                                                href={route(
                                                    "articles.show",
                                                    direction === "rtl"
                                                        ? relatedArticle.slug_ar
                                                        : relatedArticle.slug_en,
                                                )}
                                                className="group flex gap-3 text-start"
                                            >
                                                {relatedArticle.image ? (
                                                    <img
                                                        src={`/storage/${relatedArticle.image}`}
                                                        alt=""
                                                        className="h-16 w-20 shrink-0 object-cover"
                                                    />
                                                ) : (
                                                    <div className="avora-surface-muted h-16 w-20 shrink-0" />
                                                )}
                                                <div className="min-w-0">
                                                    <h3 className="line-clamp-2 text-sm font-semibold leading-6 transition group-hover:text-[var(--avora-primary)]">
                                                        {relatedTitle}
                                                    </h3>
                                                    {relatedExcerpt && (
                                                        <p className="avora-muted mt-1 line-clamp-1 text-xs">
                                                            {relatedExcerpt}
                                                        </p>
                                                    )}
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </aside>
                        )}
                    </div>
                </Container>
            </main>
        </>
    );
}

ArticleShow.layout = (page: ReactNode) => <StoreLayout>{page}</StoreLayout>;
