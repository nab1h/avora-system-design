import { Alert } from "@/avora-dash/components/Alert";
import { useAppName } from "@/avora-dash/hooks/useAppName";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";
import { useTheme } from "@/avora-dash/providers/ThemeProvider";
import { ArticlePreview, CartProduct, PageProps, StoreProduct } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import { useState } from "react";
import { StoreNavbar } from "@/components/StoreNavbar";
import { StoreDrawer } from "@/components/StoreDrawer";
import { ProductsPage } from "./ProductsPage";
import { ArticlePage } from "./ArticlePage";
import { StoreHero } from "./StoreHero";
import { BrandsSlider, type StoreBrand } from "@/components/BrandsSlider";
import { ShoppingBenefits } from "@/components/ShoppingBenefits";
import { StoreFooter } from "@/components/StoreFooter";
import { MainCategoriesSection } from "@/components/MainCategoriesSection";
import { ClassesSection } from "@/components/ClassesSection";
import DepthGallery from "@/components/DepthGallery/DepthGallery";
import { Container } from "@/avora-dash/components/Container/Container";
import { SectionTitle } from "@/avora-dash/components/SectionTitle/SectionTitle";

type WelcomeProps = PageProps<{
    products: StoreProduct[];
    articles: ArticlePreview[];
    cartProducts: CartProduct[];
    cartCount: number;
    brands: StoreBrand[];
    favoriteProductIds: number[];
}>;

export default function Welcome({
    products: storeProducts,
    articles,
    cartProducts,
    brands,
    favoriteProductIds,
}: WelcomeProps) {
    const { colors } = useTheme();
    const { translate } = useLanguage();
    const appName = useAppName();
    const page = usePage<PageProps & { errors?: Record<string, string> }>();
    const [isOpen, setIsOpen] = useState(false);
    const [cartSuccess, setCartSuccess] = useState(false);

    return (
        <>
            <Head
                title={translate({
                    ar: `معرض ${appName}`,
                    en: `${appName} Showcase`,
                })}
            />

            {cartSuccess && (
                <Alert
                    variant="success"
                    title="تمت الإضافة"
                    floating
                    placement="bottom-center"
                    onDismiss={() => setCartSuccess(false)}
                    dismissLabel="إغلاق"
                >
                    تم إضافة المنتج إلى عربة التسوق.
                </Alert>
            )}

            <StoreNavbar setIsOpen={setIsOpen} />

            <main
                className="min-h-screen transition-colors duration-300"
                style={{
                    background: `linear-gradient(${colors.muted}0d, ${colors.muted}0d), ${colors.background}`,
                    color: colors.text,
                }}
            >
                <DepthGallery />
                <StoreHero />
                <Container
                    width="wide"
                    gutter="lg"
                    paddingY="md"
                    className="space-y-14"
                >
                    <MainCategoriesSection />
                    <BrandsSlider brands={brands} />
                    <ProductsPage
                        products={storeProducts}
                        favoriteProductIds={favoriteProductIds}
                    />
                    <ShoppingBenefits />
                    {/* section blog */}
                    <SectionTitle className="mt-2">
                        {translate({ ar: "المنتجات", en: "Products" })}
                    </SectionTitle>
                    <ArticlePage articles={articles} />
                    <ClassesSection />
                </Container>
                <StoreDrawer
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    cartProducts={cartProducts}
                />
            </main>
            <StoreFooter />
        </>
    );
}
