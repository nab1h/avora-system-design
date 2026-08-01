import { Container } from '@/avora-dash/components/Container';
import { Select } from '@/avora-dash/components/forms/Select';
import { ProductCard } from '@/Components/ProductCard';
import { CustomerAuthModal } from '@/Components/CustomerAuthModal';
import { StoreFooter } from '@/Components/StoreFooter';
import { StoreDrawer } from '@/Components/StoreDrawer';
import { StoreNavbar } from '@/Components/StoreNavbar';
import { useLanguage } from '@/avora-dash/providers/LanguageProvider';
import { useTheme } from '@/avora-dash/providers/ThemeProvider';
import { Head, router, usePage } from '@inertiajs/react';
import { useMemo, useState, type ReactNode } from 'react';

type Option = { id: number; name_ar: string; name_en: string; hex?: string };
type Product = { id: number; name_ar: string; name_en: string; price: string; category_id: number; sub_category_id: number; category?: Option; sub_category?: Option; offer?: { is_active: boolean }; images: { id: number; image: string; type: string }[]; colors: Option[]; sizes: Option[]; materials: Option[]; favorited_by_users_count: number };

export default function Shopping() {
    const { translate, direction } = useLanguage();
    const { colors: theme } = useTheme();
    const props = usePage().props as any;
    const products = (props.products ?? []) as Product[];
    const initialParams = new URLSearchParams(window.location.search);
    const [category, setCategory] = useState<number | null>(Number(initialParams.get('category')) || null);
    const [subcategory, setSubcategory] = useState<number | null>(Number(initialParams.get('subcategory')) || null);
    const [color, setColor] = useState<number | null>(null);
    const [size, setSize] = useState<number | null>(null);
    const [sort, setSort] = useState('new');
    const [authOpen, setAuthOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const isRtl = direction === 'rtl';
    const text = (item: Option) => isRtl ? item.name_ar : item.name_en;
    const unique = (items: Option[]) => Array.from(new Map(items.map(item => [item.id, item])).values());
    const categories = unique(products.flatMap(product => product.category ? [product.category] : []));
    const colors = unique(products.flatMap(product => product.colors));
    const sizes = unique(products.flatMap(product => product.sizes));
    const visible = useMemo(() => products.filter(product =>
        (!category || product.category_id === category) &&
        (!subcategory || product.sub_category_id === subcategory) &&
        (!color || product.colors.some(item => item.id === color)) &&
        (!size || product.sizes.some(item => item.id === size)),
    ).sort((a, b) => sort === 'low' ? Number(a.price) - Number(b.price) : sort === 'high' ? Number(b.price) - Number(a.price) : b.id - a.id), [products, category, subcategory, color, size, sort]);
    const FilterGroup = ({ title, children }: { title: string; children: ReactNode }) => <section className="border-b pb-5" style={{ borderColor: theme.border }}><h2 className="mb-3 text-sm font-bold" style={{ color: theme.text }}>{title}</h2>{children}</section>;
    const FilterButton = ({ item, active, onClick }: { item: Option; active: boolean; onClick: () => void }) => <button onClick={onClick} className="mb-2 flex w-full items-center gap-2 text-start text-sm" style={{ color: theme.muted }}><span className="grid h-4 w-4 place-items-center border" style={{ borderColor: active ? theme.primary : theme.border, background: active ? theme.primary : 'transparent', color: '#fff' }}>{active ? '✓' : ''}</span>{text(item)}</button>;
    return <>
        <Head title={translate({ ar: 'تسوّق', en: 'Shop' })} />
        <StoreNavbar setIsOpen={setCartOpen} />
        <main className="min-h-screen py-12" style={{ backgroundColor: theme.background, color: theme.text }} dir={direction}>
            <Container width="wide" gutter="lg">
                <header className="mb-10"><p className="text-sm" style={{ color: theme.primary }}>{translate({ ar: 'اكتشف منتجاتنا', en: 'Discover our collection' })}</p><h1 className="mt-2 text-3xl font-black">{translate({ ar: 'تسوّق المنتجات', en: 'Shop products' })}</h1></header>
                <div className="flex flex-col gap-6 md:flex-row-reverse">
                    <aside className="sticky top-6 h-fit shrink-0 self-start rounded-2xl border p-5 md:w-56" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
                        <div className="mb-5 flex items-center justify-between"><strong>{translate({ ar: 'الفلاتر', en: 'Filters' })}</strong><button className="text-xs" style={{ color: theme.primary }} onClick={() => { setCategory(null); setColor(null); setSize(null); }}>{translate({ ar: 'مسح الكل', en: 'Clear all' })}</button></div>
                        {categories.length > 0 && <FilterGroup title={translate({ ar: 'التصنيف', en: 'Category' })}>{categories.map(item => <FilterButton key={item.id} item={item} active={category === item.id} onClick={() => setCategory(category === item.id ? null : item.id)} />)}</FilterGroup>}
                        {colors.length > 0 && <FilterGroup title={translate({ ar: 'اللون', en: 'Color' })}><div className="flex flex-wrap gap-2">{colors.map(item => <button key={item.id} title={text(item)} onClick={() => setColor(color === item.id ? null : item.id)} className="h-8 w-8 rounded-full border-2" style={{ backgroundColor: item.hex, borderColor: color === item.id ? theme.primary : theme.border }} />)}</div></FilterGroup>}
                        {sizes.length > 0 && <FilterGroup title={translate({ ar: 'المقاس', en: 'Size' })}>{sizes.map(item => <FilterButton key={item.id} item={item} active={size === item.id} onClick={() => setSize(size === item.id ? null : item.id)} />)}</FilterGroup>}
                    </aside>
                    <section className="min-w-0 flex-1"><div className="mb-6 flex items-end justify-between gap-4"><p className="text-sm" style={{ color: theme.muted }}>{visible.length} {translate({ ar: 'منتج', en: 'products' })}</p><div className="w-52"><Select label={translate({ ar: 'ترتيب', en: 'Sort' })} value={sort} onChange={value => setSort(String(value))} options={[{ value: 'new', label: translate({ ar: 'الأحدث', en: 'Newest' }) }, { value: 'low', label: translate({ ar: 'السعر: الأقل', en: 'Price: low to high' }) }, { value: 'high', label: translate({ ar: 'السعر: الأعلى', en: 'Price: high to low' }) }]} /></div></div><div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{visible.map(product => { const image = product.images.find(item => item.type === 'main') ?? product.images[0]; return <ProductCard key={product.id} title={isRtl ? product.name_ar : product.name_en} price={`${product.price} ${props.websiteSettings?.currency ?? 'EGP'}`} img={image ? `/storage/${image.image}` : '/images/product-colors.png'} favoriteCount={product.favorited_by_users_count} onView={() => window.location.assign(route('products.show', product.id))} onAddToCart={() => props.auth?.user ? router.post(route('cart.store'), { product_id: product.id }) : setAuthOpen(true)} />; })}</div>{visible.length === 0 && <p className="py-16 text-center" style={{ color: theme.muted }}>{translate({ ar: 'لا توجد منتجات مطابقة.', en: 'No matching products.' })}</p>}</section>
                </div>
            </Container>
        </main>
        <CustomerAuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
        <StoreDrawer isOpen={cartOpen} setIsOpen={setCartOpen} cartProducts={props.cartProducts ?? []} />
        <StoreFooter />
    </>;
}
