import { Button } from "@/avora-dash/Components/Button";
import { LuMinus, LuPlus, LuTrash2 } from "react-icons/lu";
import { Drawer } from "@/avora-dash/Components/Drawer/Drawer";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";
import { router, usePage } from "@inertiajs/react";
import { CartProduct, PageProps } from "@/types";

interface IProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    cartProducts?: CartProduct[];
}
export function StoreDrawer({ isOpen, setIsOpen, cartProducts = [] }: IProps) {
    const { translate, direction } = useLanguage();
    const page = usePage<PageProps & { errors?: Record<string, string> }>();
    const websiteCurrency = page.props.websiteSettings.currency ?? "EGP";
    const cartTotal = cartProducts.reduce(
        (total, product) =>
            total + Number(product.price) * Number(product.pivot.quantity),
        0,
    );

    const removeFromCart = (productId: number) => {
        router.delete(route("cart.destroy", productId), {
            preserveScroll: true,
        });
    };
    const changeCartQuantity = (productId: number, delta: 1 | -1) => {
        router.patch(
            route("cart.update", productId),
            { delta },
            { preserveScroll: true },
        );
    };

    return (
        <Drawer
            open={isOpen}
            onClose={() => setIsOpen(false)}
            title={translate({
                ar: "عربة التسوق",
                en: "Shopping cart",
            })}
            description={translate({
                ar: "المنتجات التي أضفتها إلى السلة.",
                en: "Products you added to your cart.",
            })}
            side="right"
            size="lg"
            backdrop="blur"
            footer={
                <>
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>
                        إلغاء
                    </Button>

                    <Button type="button" disabled={!cartProducts.length}>
                        {translate({
                            ar: "إتمام الطلب",
                            en: "Checkout",
                        })}
                    </Button>
                </>
            }
        >
            {cartProducts.length ? (
                <div className="space-y-4" dir={direction}>
                    {cartProducts.map((product) => {
                        const image =
                            product.images.find(
                                (item) => item.type === "main",
                            ) ?? product.images[0];
                        const quantity = Number(product.pivot.quantity);

                        return (
                            <article
                                key={product.id}
                                className="flex gap-3 rounded-2xl border border-slate-200 p-3 dark:border-slate-700"
                            >
                                {image ? (
                                    <img
                                        src={`/storage/${image.image}`}
                                        alt={
                                            direction === "rtl"
                                                ? product.name_ar
                                                : product.name_en
                                        }
                                        className="h-20 w-20 rounded-xl object-cover"
                                    />
                                ) : (
                                    <div className="h-20 w-20 rounded-xl bg-slate-100 dark:bg-slate-800" />
                                )}
                                <div className="min-w-0 flex-1">
                                    <h3 className="truncate font-semibold">
                                        {direction === "rtl"
                                            ? product.name_ar
                                            : product.name_en}
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        {translate({
                                            ar: "الكمية",
                                            en: "Quantity",
                                        })}
                                        : {quantity}
                                    </p>
                                    <div className="mt-3 flex items-center gap-2">
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            type="button"
                                            aria-label={translate({
                                                ar: "تقليل الكمية",
                                                en: "Decrease quantity",
                                            })}
                                            onClick={() =>
                                                changeCartQuantity(
                                                    product.id,
                                                    -1,
                                                )
                                            }
                                        >
                                            <LuMinus className="h-4 w-4" />
                                        </Button>
                                        <span className="min-w-8 text-center text-sm font-bold">
                                            {quantity}
                                        </span>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            type="button"
                                            aria-label={translate({
                                                ar: "زيادة الكمية",
                                                en: "Increase quantity",
                                            })}
                                            onClick={() =>
                                                changeCartQuantity(
                                                    product.id,
                                                    1,
                                                )
                                            }
                                        >
                                            <LuPlus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <p className="mt-2 font-medium">
                                        {(
                                            Number(product.price) * quantity
                                        ).toFixed(2)}{" "}
                                        {websiteCurrency}
                                    </p>
                                </div>
                                <Button
                                    size="icon"
                                    variant="danger"
                                    type="button"
                                    aria-label={translate({
                                        ar: "حذف المنتج من السلة",
                                        en: "Remove product from cart",
                                    })}
                                    title={translate({
                                        ar: "حذف",
                                        en: "Remove",
                                    })}
                                    onClick={() => removeFromCart(product.id)}
                                >
                                    <LuTrash2 className="h-4 w-4" />
                                </Button>
                            </article>
                        );
                    })}
                    <div className="flex items-center justify-between border-t border-slate-200 pt-4 font-bold dark:border-slate-700">
                        <span>
                            {translate({ ar: "الإجمالي", en: "Total" })}
                        </span>
                        <span>
                            {cartTotal.toFixed(2)} {websiteCurrency}
                        </span>
                    </div>
                </div>
            ) : (
                <p className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                    {translate({
                        ar: "عربة التسوق فارغة حالياً.",
                        en: "Your shopping cart is empty.",
                    })}
                </p>
            )}
        </Drawer>
    );
}
