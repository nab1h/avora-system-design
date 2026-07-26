import { Container } from "@/avora-dash/components/Container/Container";
import { StoreLayout } from "@/Layouts/StoreLayout";
import { PageProps } from "@/types";
import { Head, Link, usePage } from "@inertiajs/react";
import type { ReactNode } from "react";
import { LuArrowLeft } from "react-icons/lu";

type Article = { title_ar:string; title_en:string; excerpt_ar:string|null; excerpt_en:string|null; content_ar:string|null; content_en:string|null; image:string|null; published_at:string|null; images:{id:number;image:string}[] };

export default function ArticleShow() {
    const { article } = usePage<PageProps<{article:Article}>>().props;
    const rtl = document.documentElement.dir === "rtl";
    const title = rtl ? article.title_ar : article.title_en;
    const content = rtl ? article.content_ar : article.content_en;
    const excerpt = rtl ? article.excerpt_ar : article.excerpt_en;
    return <><Head title={title}/><main className="min-h-screen bg-slate-50 py-8 dark:bg-slate-950" dir={rtl?"rtl":"ltr"}><Container width="lg"><Link href={`${route("home")}#blog`} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 dark:text-slate-300"><LuArrowLeft className="h-4 w-4"/>{rtl?"العودة للمقالات":"Back to articles"}</Link><article className="mx-auto max-w-3xl"><p className="text-sm text-slate-500">{article.published_at?.slice(0,10)}</p><h1 className="mt-3 text-3xl font-black leading-tight text-slate-950 sm:text-5xl dark:text-white">{title}</h1>{excerpt&&<p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">{excerpt}</p>}{article.image&&<img src={`/storage/${article.image}`} alt={title} className="mt-8 aspect-[16/9] w-full rounded-3xl object-cover"/>}<div className="mt-8 whitespace-pre-line text-base leading-9 text-slate-700 dark:text-slate-200">{content}</div>{article.images.length>0&&<div className="mt-8 space-y-5">{article.images.map(image=><img key={image.id} src={`/storage/${image.image}`} alt="" className="w-full rounded-3xl object-cover"/>)}</div>}</article></Container></main></>;
}

(ArticleShow as typeof ArticleShow & { layout?: (page: ReactNode) => ReactNode }).layout =
    (page) => <StoreLayout>{page}</StoreLayout>;
