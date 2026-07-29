import { CardMeta } from '@/avora-dash/components/Card';
import { Container } from '@/avora-dash/components/Container';
import { Grid } from '@/avora-dash/components/Grid';
import { SectionTitle } from '@/avora-dash/components/SectionTitle';
import { useLanguage } from '@/avora-dash/providers/LanguageProvider';
import { ProductCardInclude } from './ProductCardInclude';

// Copy this section, then replace the sample product data with API data.
export function ProductGridInclude() {
    const { translate } = useLanguage();

    // Replace this array with products from your backend or API.
    const products = [
        {
            id: 1,
            image: '/images/avora-card-blue.svg',
            category: translate({ ar: 'تصميم', en: 'Design' }),
            title: translate({ ar: 'المنتج الأول', en: 'First product' }),
            description: translate({
                ar: 'وصف مختصر للمنتج الأول.',
                en: 'A short description for the first product.',
            }),
            price: translate({ ar: '٥٠٠ ج.م', en: 'EGP 500' }),
        },
        {
            id: 2,
            image: '/images/avora-card-violet.svg',
            category: translate({ ar: 'تطوير', en: 'Development' }),
            title: translate({ ar: 'المنتج الثاني', en: 'Second product' }),
            description: translate({
                ar: 'وصف مختصر للمنتج الثاني.',
                en: 'A short description for the second product.',
            }),
            price: translate({ ar: '٧٥٠ ج.م', en: 'EGP 750' }),
        },
        {
            id: 3,
            image: '/images/avora-card-emerald.svg',
            category: translate({ ar: 'تسويق', en: 'Marketing' }),
            title: translate({ ar: 'المنتج الثالث', en: 'Third product' }),
            description: translate({
                ar: 'وصف مختصر للمنتج الثالث.',
                en: 'A short description for the third product.',
            }),
            price: translate({ ar: '٩٠٠ ج.م', en: 'EGP 900' }),
        },
    ];

    return (
        <Container
            as="section"
            id="products"
            width="wide"
            gutter="md"
            paddingY="section"
        >
            <div className="mb-8">
                <CardMeta>PRODUCTS</CardMeta>
                {/* Change this section title. */}
                <SectionTitle
                    className="mt-2"
                    text={{ ar: 'منتجاتنا', en: 'Our products' }}
                />
            </div>

            {/* Change minItemWidth to control the minimum card width. */}
            <Grid minItemWidth="260px" gap="lg">
                {products.map((product) => (
                    <ProductCardInclude
                        key={product.id}
                        image={product.image}
                        imageAlt={product.title}
                        category={product.category}
                        title={product.title}
                        description={product.description}
                        price={product.price}
                        buttonLabel={translate({
                            ar: 'التفاصيل',
                            en: 'Details',
                        })}
                    />
                ))}
            </Grid>
        </Container>
    );
}
