import { Container } from '@/avora-dash/components/Container';
import { ShoppingBenefits } from '@/Components/ShoppingBenefits';
import { useLanguage } from '@/avora-dash/providers/LanguageProvider';
import { useTheme } from '@/avora-dash/providers/ThemeProvider';
import { StoreNavbar } from '@/Components/StoreNavbar';
import { StoreFooter } from '@/Components/StoreFooter';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
export default function Shopping() {
    const { colors } = useTheme();
    const { translate } = useLanguage();
    const [, setDrawerOpen] = useState(false);

    return (
        <>
            <Head title={translate({ ar: 'التسوق مع أفورا', en: 'Shopping with Avora' })} />
            <StoreNavbar setIsOpen={setDrawerOpen} />
            <main style={{ backgroundColor: colors.background, color: colors.text }}>
                <Container width="wide" gutter="lg" paddingY="xl" className="space-y-8">
                    <ShoppingBenefits />
                </Container>
            </main>
            <StoreFooter />
        </>
    );
}
