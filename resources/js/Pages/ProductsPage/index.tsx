import { Grid, GridItem } from "@/avora-dash/components/Grid";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";
import { ProductCard } from "@/Components/ProductCard";
import { CustomerAuthModal } from "@/Components/CustomerAuthModal";
import { PageProps, StoreProduct } from "@/types";
import { router, usePage } from "@inertiajs/react";
import { useState } from "react";

interface IProps {
    products: StoreProduct[];
    favoriteProductIds?: number[];
}
export function ProductsPage({ products: storeProducts, favoriteProductIds = [] }: IProps) {
    const publicAsset = (path: string) => `${window.location.origin}${path}`;
    const page = usePage<PageProps & { errors?: Record<string, string> }>();
    const [customerAuthOpen, setCustomerAuthOpen] = useState(false);
    const [cartSuccess, setCartSuccess] = useState(false);
    const websiteCurrency = page.props.websiteSettings.currency ?? "EGP";
    const { direction } = useLanguage();
    const user = page.props.auth.user;
    const addToCart = (productId: number) => {
        if (!user) {
            setCustomerAuthOpen(true);
            return;
        }

        router.post(
            route("cart.store"),
            { product_id: productId },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setCartSuccess(true);
                    window.setTimeout(() => setCartSuccess(false), 3500);
                },
            },
        );
    };
    const toggleFavorite = (productId: number) => {
        if (!user) {
            setCustomerAuthOpen(true);
            return;
        }

        router.post(route("favorites.toggle", productId), {}, {
            preserveScroll: true,
        });
    };
    return (
        <section id="prodcts" className="scroll-mt-24 space-y-6">
            <Grid layout="cards" gap="md" width="full">
                {storeProducts.map((product) => {
                    const image =
                        product.images.find((item) => item.type === "main") ??
                        product.images[0];

                    return (
                        <GridItem key={product.id}>
                            <ProductCard
                                title={
                                    direction === "rtl"
                                        ? product.name_ar
                                        : product.name_en
                                }
                                price={`${product.price} ${websiteCurrency}`}
                                img={
                                    image
                                        ? `/storage/${image.image}`
                                        : publicAsset(
                                              "/images/product-colors.png",
                                          )
                                }
                                hoverImg={
                                    product.images[1]
                                        ? `/storage/${product.images[1].image}`
                                        : undefined
                                }
                                favoriteCount={product.favorited_by_users_count ?? 0}
                                isFavorite={favoriteProductIds.includes(product.id)}
                                onToggleFavorite={() => toggleFavorite(product.id)}
                                onAddToCart={() => addToCart(product.id)}
                                onView={() =>
                                    router.visit(
                                        route("products.show", product.id),
                                    )
                                }
                            />
                        </GridItem>
                    );
                })}
            </Grid>
            <CustomerAuthModal
                open={!user && customerAuthOpen}
                onClose={() => setCustomerAuthOpen(false)}
            />
        </section>
    );
}
