import { Button } from "@/avora-dash/components/Button";
import { Card } from "@/avora-dash/components/Card";
import { Container } from "@/avora-dash/components/Container/Container";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";
import { CustomerAuthModal } from "@/components/CustomerAuthModal";
import { StoreLayout } from "@/Layouts/StoreLayout";
import type { PageProps } from "@/types";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState, type ReactNode } from "react";
import {
    LuArrowLeft,
    LuCheck,
    LuMinus,
    LuPlus,
    LuPackageCheck,
    LuShoppingCart,
} from "react-icons/lu";

interface ProductImage {
    id: number;
    image: string;
    type: string;
}

interface ProductCategory {
    name_ar: string;
    name_en: string;
}

interface ProductOffer {
    name_ar: string;
    name_en: string;
    type: "fixed" | "percent";
    value: string;
    end_at: string | null;
}

interface ProductAttribute {
    name_ar: string | null;
    name_en: string | null;
    value: string;
    unit_ar: string | null;
    unit_en: string | null;
}

interface ProductDetails {
    id: number;
    name_ar: string;
    name_en: string;
    desc_ar: string | null;
    desc_en: string | null;
    price: string;
    sale_price: string;
    stock: number;
    images: ProductImage[];
    category: ProductCategory | null;
    product_class: ProductCategory | null;
    offer: ProductOffer | null;
    features: string[];
    attributes: ProductAttribute[];
    colors: { id: number; name_ar: string; name_en: string; hex: string }[];
    sizes: { id: number; name_ar: string; name_en: string }[];
    weights: { id: number; name_ar: string; name_en: string }[];
    materials: { id: number; name_ar: string; name_en: string }[];
}

interface ProductShowPageProps extends PageProps {
    product: ProductDetails;
}

export default function ProductShow() {
    const { translate, direction } = useLanguage();

    const { product, auth, websiteSettings } =
        usePage<ProductShowPageProps>().props;

    const [activeImage, setActiveImage] = useState(0);
    const [authOpen, setAuthOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState<number | null>(
        product.colors[0]?.id ?? null,
    );
    const [selectedSize, setSelectedSize] = useState<number | null>(
        product.sizes[0]?.id ?? null,
    );

    const currency = websiteSettings.currency ?? "EGP";

    const activeProductImage = product.images[activeImage] ?? product.images[0];

    const productName = direction === "rtl" ? product.name_ar : product.name_en;

    const productDescription =
        direction === "rtl" ? product.desc_ar : product.desc_en;

    const categoryName = product.category
        ? direction === "rtl"
            ? product.category.name_ar
            : product.category.name_en
        : null;

    const productClassName = product.product_class
        ? direction === "rtl"
            ? product.product_class.name_ar
            : product.product_class.name_en
        : null;

    const offerName = product.offer
        ? direction === "rtl"
            ? product.offer.name_ar
            : product.offer.name_en
        : null;

    const formatPrice = (value: string | number) => {
        const amount = Number(value);

        if (!Number.isFinite(amount)) {
            return `${value} ${currency}`;
        }

        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const addToCart = () => {
        if (!auth.user) {
            setAuthOpen(true);
            return;
        }

        router.post(
            route("cart.store"),
            {
                product_id: product.id,
                quantity,
            },
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <>
            <Head title={productName} />

            <CustomerAuthModal
                open={!auth.user && authOpen}
                onClose={() => setAuthOpen(false)}
            />

            <main
                className="min-h-screen bg-white dark:bg-slate-950"
                dir={direction}
            >
                <Container width="xl" className="py-8 sm:py-12">
                    <Link
                        href={route("home")}
                        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400"
                    >
                        <LuArrowLeft
                            className={`h-4 w-4 ${
                                direction === "rtl" ? "rotate-180" : ""
                            }`}
                        />

                        {translate({
                            ar: "العودة إلى المتجر",
                            en: "Back to store",
                        })}
                    </Link>

                    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(380px,0.88fr)] xl:gap-16">
                        <section>
                            <Card
                                padding="none"
                                className="overflow-hidden rounded-none border-0 shadow-none"
                            >
                                {activeProductImage ? (
                                    <img
                                        src={`/storage/${activeProductImage.image}`}
                                        alt={productName}
                                        className="aspect-square w-full object-contain"
                                    />
                                ) : (
                                    <div className="aspect-square bg-slate-200 dark:bg-slate-800" />
                                )}
                            </Card>

                            {product.images.length > 1 && (
                                <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                                    {product.images.map((item, index) => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() =>
                                                setActiveImage(index)
                                            }
                                            aria-pressed={index === activeImage}
                                            aria-label={translate({
                                                ar: `عرض صورة المنتج ${
                                                    index + 1
                                                }`,
                                                en: `View product image ${
                                                    index + 1
                                                }`,
                                            })}
                                            className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                                                index === activeImage
                                                    ? "border-emerald-500"
                                                    : "border-transparent hover:border-slate-300 dark:hover:border-slate-600"
                                            }`}
                                        >
                                            <img
                                                src={`/storage/${item.image}`}
                                                alt=""
                                                className="h-full w-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </section>

                        <section className="max-w-xl space-y-5 pt-2">
                            {(categoryName || productClassName) && (
                                <div className="flex flex-wrap gap-2 text-xs font-bold">
                                    {categoryName && (
                                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                                            {categoryName}
                                        </span>
                                    )}

                                    {productClassName && (
                                        <span className="rounded-full bg-slate-200 px-3 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                            {productClassName}
                                        </span>
                                    )}
                                </div>
                            )}

                            <h1 className="text-2xl font-bold uppercase tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                                {productName}
                            </h1>

                            {product.offer && (
                                <div className="rounded-2xl bg-rose-600 p-4 text-white">
                                    <p className="font-black">{offerName}</p>

                                    <p className="mt-1 text-sm">
                                        {product.offer.type === "percent"
                                            ? translate({
                                                  ar: `${product.offer.value}% خصم`,
                                                  en: `${product.offer.value}% off`,
                                              })
                                            : translate({
                                                  ar: `خصم ${formatPrice(
                                                      product.offer.value,
                                                  )}`,
                                                  en: `${formatPrice(
                                                      product.offer.value,
                                                  )} off`,
                                              })}
                                    </p>
                                </div>
                            )}

                            <div className="flex flex-wrap items-end gap-3">
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {formatPrice(product.sale_price)}
                                </p>

                                {product.offer && (
                                    <del className="pb-1 text-slate-400">
                                        {formatPrice(product.price)}
                                    </del>
                                )}
                            </div>

                            {productDescription && (
                                <p className="leading-8 text-slate-600 dark:text-slate-300">
                                    {productDescription}
                                </p>
                            )}

                            <div className="space-y-4 border-y border-slate-200 py-5 dark:border-slate-800">
                                {product.sizes.length > 0 && (
                                    <div>
                                        <p className="mb-2 text-sm font-medium">
                                            {translate({
                                                ar: "المقاس",
                                                en: "Size",
                                            })}
                                        </p>
                                        <div className="flex gap-2">
                                            {product.sizes.map((size) => (
                                                <button
                                                    key={size.id}
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedSize(size.id)
                                                    }
                                                    className={`min-w-10 border px-3 py-2 text-sm ${selectedSize === size.id ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-950" : "border-slate-300"}`}
                                                >
                                                    {direction === "rtl"
                                                        ? size.name_ar
                                                        : size.name_en}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {product.colors.length > 0 && (
                                    <div>
                                        <p className="mb-2 text-sm font-medium">
                                            {translate({
                                                ar: "اللون",
                                                en: "Color",
                                            })}
                                        </p>
                                        <div className="flex gap-3">
                                            {product.colors.map((color) => (
                                                <button
                                                    key={color.id}
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedColor(
                                                            color.id,
                                                        )
                                                    }
                                                    aria-label={color.name_en}
                                                    className={`h-8 w-8 border-2 ${selectedColor === color.id ? "border-slate-900 ring-2 ring-slate-300" : "border-slate-300"}`}
                                                    style={{
                                                        backgroundColor:
                                                            color.hex,
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {product.materials.length > 0 && (
                                    <p className="text-sm text-slate-600 dark:text-slate-300">
                                        {translate({
                                            ar: "الخامة: ",
                                            en: "Material: ",
                                        })}
                                        {product.materials
                                            .map((item) =>
                                                direction === "rtl"
                                                    ? item.name_ar
                                                    : item.name_en,
                                            )
                                            .join("، ")}
                                    </p>
                                )}
                                <p className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100">
                                    <LuPackageCheck className="h-5 w-5 shrink-0 text-emerald-600" />

                                    {product.stock > 0
                                        ? translate({
                                              ar: `${product.stock} قطعة متوفرة`,
                                              en: `${product.stock} items available`,
                                          })
                                        : translate({
                                              ar: "غير متوفر حاليًا",
                                              en: "Out of stock",
                                          })}
                                </p>

                                <div className="flex gap-3">
                                    <div className="flex border border-slate-300">
                                        <button
                                            type="button"
                                            className="px-3"
                                            onClick={() =>
                                                setQuantity(
                                                    Math.max(1, quantity - 1),
                                                )
                                            }
                                        >
                                            <LuMinus />
                                        </button>
                                        <span className="grid min-w-10 place-items-center">
                                            {quantity}
                                        </span>
                                        <button
                                            type="button"
                                            className="px-3"
                                            onClick={() =>
                                                setQuantity(
                                                    Math.min(
                                                        product.stock,
                                                        quantity + 1,
                                                    ),
                                                )
                                            }
                                        >
                                            <LuPlus />
                                        </button>
                                    </div>
                                    <Button
                                        size="lg"
                                        type="button"
                                        disabled={product.stock <= 0}
                                        onClick={addToCart}
                                        className="flex-1 gap-2 rounded-none bg-slate-900 hover:bg-slate-700"
                                    >
                                        <LuShoppingCart className="h-5 w-5" />

                                        {translate({
                                            ar: "إضافة إلى عربة التسوق",
                                            en: "Add to cart",
                                        })}
                                    </Button>
                                </div>
                            </div>

                            {product.features.length > 0 && (
                                <Card padding="md">
                                    <h2 className="font-black text-slate-950 dark:text-white">
                                        {translate({
                                            ar: "المميزات",
                                            en: "Features",
                                        })}
                                    </h2>

                                    <ul className="mt-4 space-y-2">
                                        {product.features.map(
                                            (feature, index) => (
                                                <li
                                                    key={`${feature}-${index}`}
                                                    className="flex gap-2 text-sm text-slate-600 dark:text-slate-300"
                                                >
                                                    <LuCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                                                    <span>{feature}</span>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </Card>
                            )}
                        </section>
                    </div>

                    {product.attributes.length > 0 && (
                        <Card padding="lg" className="mt-8">
                            <h2 className="text-xl font-black text-slate-950 dark:text-white">
                                {translate({
                                    ar: "الخصائص والمواصفات",
                                    en: "Specifications",
                                })}
                            </h2>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {product.attributes.map((attribute, index) => {
                                    const attributeName =
                                        direction === "rtl"
                                            ? attribute.name_ar
                                            : attribute.name_en;

                                    const attributeUnit =
                                        direction === "rtl"
                                            ? attribute.unit_ar
                                            : attribute.unit_en;

                                    return (
                                        <div
                                            key={`${attributeName}-${index}`}
                                            className="rounded-xl bg-slate-100 p-4 dark:bg-slate-800"
                                        >
                                            {attributeName && (
                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                    {attributeName}
                                                </p>
                                            )}

                                            <p className="mt-1 font-bold text-slate-900 dark:text-white">
                                                {attribute.value}

                                                {attributeUnit &&
                                                    ` ${attributeUnit}`}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    )}
                </Container>
            </main>
        </>
    );
}

ProductShow.layout = (page: ReactNode) => <StoreLayout>{page}</StoreLayout>;
