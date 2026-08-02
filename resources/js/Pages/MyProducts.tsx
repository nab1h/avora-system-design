import { Container } from '@/avora-dash/components/Container';
import { ProductCard } from '@/Components/ProductCard';
import { StoreLayout } from '@/Layouts/StoreLayout';
import { useLanguage } from '@/avora-dash/providers/LanguageProvider';
import { Head, router } from '@inertiajs/react';
import type { ReactNode } from 'react';

type MyProductRow = {
    id: number;
    quantity: number;
    purchased_at: string | null;
    product: {
        id: number;
        name_ar: string;
        name_en: string;
        price: string;
        images: { id: number; image: string; type: string }[];
    } | null;
};

export default function MyProducts({ myProducts }: { myProducts: MyProductRow[] }) {
    const { translate, direction } = useLanguage();

    return (
        <>
            <Head title={translate({ ar: 'منتجاتي', en: 'My products' })} />
            <section className="min-h-screen bg-slate-50 py-12 dark:bg-slate-950" dir={direction}>
                <Container width="wide" gutter="lg">
                    <div className="mb-8">
                        <p className="text-sm font-semibold text-[var(--avora-primary)]">
                            {translate({ ar: 'مشترياتي', en: 'My purchases' })}
                        </p>
                        <h1 className="mt-1 text-3xl font-black text-slate-950 dark:text-white">
                            {translate({ ar: 'المنتجات التي اشتريتها', en: 'Products you bought' })}
                        </h1>
                    </div>

                    {myProducts.length ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {myProducts.filter((item) => item.product).map((item) => {
                                const product = item.product!;
                                const image = product.images.find((entry) => entry.type === 'main') ?? product.images[0];

                                return (
                                    <div key={item.id} className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-slate-900">
                                        <ProductCard
                                            title={direction === 'rtl' ? product.name_ar : product.name_en}
                                            price={product.price}
                                            img={image ? `/storage/${image.image}` : '/images/product-colors.png'}
                                            onView={() => router.visit(route('products.show', product.id))}
                                        />
                                        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm dark:border-slate-800">
                                            <span className="font-bold">{translate({ ar: 'الكمية', en: 'Quantity' })}: {item.quantity}</span>
                                            <span className="text-slate-500">{item.purchased_at}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900">
                            {translate({ ar: 'لا توجد منتجات مشتراة حتى الآن.', en: 'You have not bought any products yet.' })}
                        </div>
                    )}
                </Container>
            </section>
        </>
    );
}

MyProducts.layout = (page: ReactNode) => <StoreLayout>{page}</StoreLayout>;
