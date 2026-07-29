import { CustomerAuthModal } from '@/Components/CustomerAuthModal';
import { ProductCard } from '@/Components/ProductCard';
import { Grid, GridItem } from '@/avora-dash/components/Grid';
import { Pagination } from '@/avora-dash/components/Pagination';
import { Tabs, TabsList, TabsPanel, TabsPanels, TabsTrigger } from '@/avora-dash/components/Tabs';
import { useLanguage } from '@/avora-dash/providers/LanguageProvider';
import type { PageProps, StoreProduct } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface ProductsPageProps {
    products: StoreProduct[];
    favoriteProductIds?: number[];
}

export function ProductsPage({ products: storeProducts, favoriteProductIds = [] }: ProductsPageProps) {
    const page = usePage<PageProps & { errors?: Record<string, string> }>();
    const { direction, translate } = useLanguage();
    const [customerAuthOpen, setCustomerAuthOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const websiteCurrency = page.props.websiteSettings.currency ?? 'EGP';
    const user = page.props.auth.user;
    const itemsPerPage = 8;
    const categories = Array.from(
        new Map(
            storeProducts
                .filter((product) => product.category)
                .map((product) => [product.category!.id, product.category!]),
        ).values(),
    );

    const requireCustomer = (action: () => void) => {
        if (!user) {
            setCustomerAuthOpen(true);
            return;
        }
        action();
    };

    const renderProducts = (products: StoreProduct[]) => {
        const totalPages = Math.max(1, Math.ceil(products.length / itemsPerPage));
        const safePage = Math.min(currentPage, totalPages);
        const visibleProducts = products.slice(
            (safePage - 1) * itemsPerPage,
            safePage * itemsPerPage,
        );

        return (
        products.length ? (
            <>
                <Grid layout="cards" gap="md" width="full">
                {visibleProducts.map((product) => {
                    const image = product.images.find((item) => item.type === 'main') ?? product.images[0];
                    const isNew = product.created_at
                        ? Date.now() - new Date(product.created_at).getTime() <= 3 * 24 * 60 * 60 * 1000
                        : false;

                    return (
                        <GridItem key={product.id}>
                            <ProductCard
                                title={direction === 'rtl' ? product.name_ar : product.name_en}
                                price={`${product.price} ${websiteCurrency}`}
                                img={image ? `/storage/${image.image}` : '/images/product-colors.png'}
                                hoverImg={product.images[1] ? `/storage/${product.images[1].image}` : undefined}
                                favoriteCount={product.favorited_by_users_count ?? 0}
                                isFavorite={favoriteProductIds.includes(product.id)}
                                badge={isNew ? translate({ ar: 'جديد', en: 'NEW' }) : undefined}
                                onToggleFavorite={() => requireCustomer(() => router.post(route('favorites.toggle', product.id), {}, { preserveScroll: true }))}
                                onAddToCart={() => requireCustomer(() => router.post(route('cart.store'), { product_id: product.id }, { preserveScroll: true }))}
                                onView={() => router.visit(route('products.show', product.id))}
                            />
                        </GridItem>
                    );
                })}
                </Grid>
                <Pagination
                    currentPage={safePage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    className="mt-10"
                />
            </>
        ) : (
            <p className="avora-muted py-10 text-center text-sm">
                {translate({ ar: 'لا توجد منتجات في هذا القسم حاليًا.', en: 'There are no products in this category yet.' })}
            </p>
        ));
    };

    return (
        <section id="products" className="scroll-mt-24 space-y-6">
            <h2 className="text-center text-sm font-medium uppercase tracking-[0.22em]">
                {translate({ ar: 'وصل حديثًا', en: 'NEW ARRIVALS' })}
            </h2>
            <Tabs
                variant="line"
                size="sm"
                selectedIndex={activeTab}
                onChange={(index) => {
                    setActiveTab(index);
                    setCurrentPage(1);
                }}
            >
                <TabsList
                    label={translate({ ar: 'تصنيفات المنتجات', en: 'Product categories' })}
                    className="!mx-auto !w-auto !max-w-full justify-center !overflow-x-auto !overflow-y-hidden !border-b-0"
                >
                    <TabsTrigger className="!min-h-8 !px-3 !text-sm !font-normal italic data-[selected]:!text-[var(--avora-text)]">
                        {translate({ ar: 'الكل', en: 'All' })}
                    </TabsTrigger>
                    {categories.map((category) => (
                        <TabsTrigger
                            key={category.id}
                            className="!min-h-8 !px-3 !text-sm !font-normal italic data-[selected]:!text-[var(--avora-text)]"
                        >
                            {direction === 'rtl' ? category.name_ar : category.name_en}
                        </TabsTrigger>
                    ))}
                </TabsList>
                <TabsPanels>
                    <TabsPanel>{renderProducts(storeProducts)}</TabsPanel>
                    {categories.map((category) => (
                        <TabsPanel key={category.id}>
                            {renderProducts(storeProducts.filter((product) => product.category_id === category.id))}
                        </TabsPanel>
                    ))}
                </TabsPanels>
            </Tabs>
            <CustomerAuthModal open={!user && customerAuthOpen} onClose={() => setCustomerAuthOpen(false)} />
        </section>
    );
}
