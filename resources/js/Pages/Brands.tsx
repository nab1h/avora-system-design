import { Container } from "@/avora-dash/components/Container";
import { BrandsSlider, type StoreBrand } from "@/components/BrandsSlider";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";
import { useTheme } from "@/avora-dash/providers/ThemeProvider";
import { StoreNavbar } from "@/components/StoreNavbar";
import { StoreFooter } from "@/components/StoreFooter";
import { Head } from "@inertiajs/react";
import { useState } from "react";

export default function Brands({ brands }: { brands: StoreBrand[] }) {
    const { colors } = useTheme();
    const { translate } = useLanguage();
    const [, setDrawerOpen] = useState(false);

    return (
        <>
            <Head title={translate({ ar: "برانداتنا", en: "Our brands" })} />
            <StoreNavbar setIsOpen={setDrawerOpen} />
            <main
                className="min-h-screen py-16"
                style={{
                    backgroundColor: colors.background,
                    color: colors.text,
                }}
            >
                <Container width="wide" gutter="lg">
                    <BrandsSlider brands={brands} />
                </Container>
            </main>
            <StoreFooter />
        </>
    );
}
