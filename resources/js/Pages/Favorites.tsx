import { Container } from '@/avora-dash/components/Container';
import { SectionTitle } from '@/avora-dash/components/SectionTitle';
import { useLanguage } from '@/avora-dash/providers/LanguageProvider';
import { useTheme } from '@/avora-dash/providers/ThemeProvider';
import { StoreNavbar } from '@/Components/StoreNavbar';
import { StoreFooter } from '@/Components/StoreFooter';
import { ProductsPage } from '@/Pages/ProductsPage';
import type { StoreProduct } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Favorites({ products, favoriteProductIds }: { products: StoreProduct[]; favoriteProductIds: number[] }) {
    const { colors } = useTheme();
    const { translate } = useLanguage();
    const [, setDrawerOpen] = useState(false);

    return (
        <>
            <Head title={translate({ ar: 'المفضلة', en: 'Favorites' })} />
            <StoreNavbar setIsOpen={setDrawerOpen} />
            <main className="min-h-screen py-12" style={{ backgroundColor: colors.background, color: colors.text }}>
                <Container width="wide" gutter="lg" className="space-y-10">
                    <SectionTitle text={{ ar: 'المنتجات المفضلة', en: 'FAVORITE PRODUCTS' }} />
                    {products.length ? (
                        <ProductsPage products={products} favoriteProductIds={favoriteProductIds} />
                    ) : (
                        <p className="avora-muted py-16 text-center">{translate({ ar: 'لم تضف أي منتجات إلى المفضلة بعد.', en: 'You have not added any favorite products yet.' })}</p>
                    )}
                </Container>
            </main>
            <StoreFooter />
        </>
    );
}
