import { Button } from "@/avora-dash/components/Button";
import { Card } from "@/avora-dash/components/Card";
import { Container } from "@/avora-dash/components/Container/Container";
import { CustomerAuthModal } from "@/Components/CustomerAuthModal";
import { StoreLayout } from "@/Layouts/StoreLayout";
import { PageProps } from "@/types";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState, type ReactNode } from "react";
import { LuArrowLeft, LuCheck, LuPackageCheck, LuShoppingCart } from "react-icons/lu";

type ProductDetails = { id:number; name_ar:string; name_en:string; desc_ar:string|null; desc_en:string|null; price:string; sale_price:string; stock:number; images:{id:number;image:string;type:string}[]; category:{name_ar:string;name_en:string}|null; product_class:{name_ar:string;name_en:string}|null; offer:{name_ar:string;name_en:string;type:"fixed"|"percent";value:string;end_at:string|null}|null; features:string[]; attributes:{name_ar:string|null;name_en:string|null;value:string;unit_ar:string|null;unit_en:string|null}[] };

export default function ProductShow() {
    const { product, auth, websiteSettings } = usePage<PageProps<{product: ProductDetails}>>().props;
    const [activeImage, setActiveImage] = useState(0);
    const [authOpen, setAuthOpen] = useState(false);
    const rtl = document.documentElement.dir === "rtl";
    const currency = websiteSettings.currency ?? "EGP";
    const image = product.images[activeImage] ?? product.images[0];
    const name = rtl ? product.name_ar : product.name_en;
    const addToCart = () => auth.user ? router.post(route("cart.store"), { product_id: product.id }) : setAuthOpen(true);

    return <><Head title={name} /><CustomerAuthModal open={!auth.user && authOpen} onClose={() => setAuthOpen(false)} />
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950" dir={rtl ? "rtl" : "ltr"}>
            <Container width="xl" className="py-8">
            <Link href={route("home")} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 dark:text-slate-300"><LuArrowLeft className="h-4 w-4" />{rtl ? "العودة إلى المتجر" : "Back to store"}</Link>
            <div className="grid gap-8 lg:grid-cols-2"><section><Card padding="none" className="overflow-hidden">{image ? <img src={`/storage/${image.image}`} alt={name} className="aspect-square w-full object-cover" /> : <div className="aspect-square bg-slate-200 dark:bg-slate-800" />}</Card>{product.images.length > 1 && <div className="mt-4 flex gap-3 overflow-x-auto">{product.images.map((item,index) => <button key={item.id} type="button" onClick={() => setActiveImage(index)} className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 ${index===activeImage ? "border-emerald-500" : "border-transparent"}`}><img src={`/storage/${item.image}`} alt="" className="h-full w-full object-cover" /></button>)}</div>}</section>
                <section className="space-y-5"><div className="flex flex-wrap gap-2 text-xs font-bold">{product.category && <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">{rtl?product.category.name_ar:product.category.name_en}</span>}{product.product_class && <span className="rounded-full bg-slate-200 px-3 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-200">{rtl?product.product_class.name_ar:product.product_class.name_en}</span>}</div><h1 className="text-3xl font-black text-slate-950 sm:text-4xl dark:text-white">{name}</h1>
                    {product.offer && <div className="rounded-2xl bg-rose-600 p-4 text-white"><p className="font-black">{rtl?product.offer.name_ar:product.offer.name_en}</p><p className="mt-1 text-sm">{product.offer.type === "percent" ? `${product.offer.value}% ${rtl?"خصم":"off"}` : `${product.offer.value} ${currency} ${rtl?"خصم":"off"}`}</p></div>}
                    <div className="flex items-end gap-3"><p className="text-3xl font-black text-emerald-600">{product.sale_price} {currency}</p>{product.offer && <del className="pb-1 text-slate-400">{product.price} {currency}</del>}</div><p className="leading-8 text-slate-600 dark:text-slate-300">{rtl?product.desc_ar:product.desc_en}</p>
                    <Card padding="md" className="space-y-3"><p className="flex items-center gap-2 font-bold"><LuPackageCheck className="h-5 w-5 text-emerald-600" />{product.stock ? `${product.stock} ${rtl?"قطعة متوفرة":"items available"}` : (rtl?"غير متوفر حالياً":"Out of stock")}</p><Button fullWidth size="lg" disabled={!product.stock} onClick={addToCart}><LuShoppingCart className="h-5 w-5" />{rtl?"إضافة إلى عربة التسوق":"Add to cart"}</Button></Card>
                    {product.features.length > 0 && <Card padding="md"><h2 className="font-black">{rtl?"المميزات":"Features"}</h2><ul className="mt-4 space-y-2">{product.features.map(feature=><li key={feature} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300"><LuCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />{feature}</li>)}</ul></Card>}</section></div>
            {product.attributes.length > 0 && <Card padding="lg" className="mt-8"><h2 className="text-xl font-black">{rtl?"الخصائص والمواصفات":"Specifications"}</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{product.attributes.map((attribute,index)=><div key={index} className="rounded-xl bg-slate-100 p-4 dark:bg-slate-800"><p className="text-sm text-slate-500">{rtl?attribute.name_ar:attribute.name_en}</p><p className="mt-1 font-bold">{attribute.value} {rtl?attribute.unit_ar:attribute.unit_en}</p></div>)}</div></Card>}
        </Container></main></>;
}

(ProductShow as typeof ProductShow & { layout?: (page: ReactNode) => ReactNode }).layout =
    (page) => <StoreLayout>{page}</StoreLayout>;
