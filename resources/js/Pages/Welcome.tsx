import { Button } from "@/avora-dash/components/Button";
import { Alert } from "@/avora-dash/components/Alert";
import {
    Card,
    CardDescription,
    CardMeta,
    CardTitle,
} from "@/avora-dash/components/Card";
import { Container } from "@/avora-dash/components/Container/Container";
import { Grid, GridItem } from "@/avora-dash/components/Grid";
import { LanguageButton } from "@/avora-dash/components/LanguageButton";
import { Slider } from "@/avora-dash/components/Slider";
import {
    Navbar,
    NavbarActions,
    NavbarBrand,
    NavbarContainer,
    NavbarDropdown,
    NavbarLink,
    NavbarLinks,
    NavbarLogo,
    NavbarMobileMenu,
    NavbarToggle,
} from "@/avora-dash/components/Navbar";
import { useAppName } from "@/avora-dash/hooks/useAppName";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";
import ModeButton from "@/avora-dash/providers/ModeButton";
import { useTheme } from "@/avora-dash/providers/ThemeProvider";
import { AddressPage } from "@/Components/AddressPage";
import { BlogCard } from "@/Components/BlogCard";
import { BlogCard2 } from "@/Components/BlogCard2";
import { CustomerAuthModal } from "@/Components/CustomerAuthModal";
import { ProductCard } from "@/Components/ProductCard";
import { ArticlePreview, CartProduct, PageProps, StoreProduct } from "@/types";
import { Head, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import { CgMenuRight } from "react-icons/cg";
import {
    LuHeart,
    LuLogOut,
    LuMinus,
    LuPackage,
    LuPlus,
    LuSearch,
    LuSettings,
    LuShoppingCart,
    LuTrash2,
    LuUserRound,
} from "react-icons/lu";
import { Drawer } from "@/avora-dash/components/Drawer/Drawer";
const publicAsset = (path: string) => `${window.location.origin}${path}`;
type WelcomeProps = PageProps<{
    products: StoreProduct[];
    articles: ArticlePreview[];
    cartProducts: CartProduct[];
    cartCount: number;
}>;

export default function Welcome({
    products: storeProducts,
    articles,
    cartProducts,
    cartCount,
}: WelcomeProps) {
    const { colors } = useTheme();
    const { translate, direction } = useLanguage();
    const appName = useAppName();
    const page = usePage<PageProps & { errors?: Record<string, string> }>();
    const websiteCurrency = page.props.websiteSettings.currency ?? "EGP";
    const enabledPaymentGateways = page.props.paymentGateways.filter(
        (gateway) => gateway.enabled,
    );
    const checkoutGatewayError =
        page.props.errors?.gateway_slug ?? page.props.errors?.product_id;
    const activePaymentGateway = enabledPaymentGateways[0];
    const [customerAuthOpen, setCustomerAuthOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [cartSuccess, setCartSuccess] = useState(false);
    const user = page.props.auth.user;
    const cartTotal = cartProducts.reduce(
        (total, product) => total + Number(product.price) * Number(product.pivot.quantity),
        0,
    );
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

    const navbar = [
        {
            href: "#home",
            name: translate({ ar: "الرئيسية", en: "Home" }),
        },
        {
            href: "#cards",
            name: translate({ ar: "الكروت", en: "Cards" }),
        },
        {
            href: "#buy",
            name: translate({ ar: "شراء", en: "Buy" }),
        },
        {
            href: "#dashboard",
            name: translate({ ar: "الداشبورد", en: "Dashboard" }),
        },
        {
            href: "#backgrounds",
            name: translate({ ar: "الخلفيات", en: "Backgrounds" }),
        },
    ];

    // products

    const products = [
        {
            id: 1,
            name: "Dior Sauvage",
            desc: translate({
                ar: "مكونات مرنة لبناء واجهات سريعة ومتناسقة.",
                en: "Flexible components for fast and consistent interfaces.",
            }),
            price: "$120",
            img: publicAsset("/images/product-colors.png"),
            hoverImg: publicAsset("/images/product-ui-design.png"),
        },
        {
            id: 2,
            name: "Bleu de Chanel",
            desc: translate({
                ar: "مكونات مرنة لبناء واجهات سريعة ومتناسقة.",
                en: "Flexible components for fast and consistent interfaces.",
            }),
            price: "$135",
            img: publicAsset("/images/product-colors.png"),
            hoverImg: publicAsset("/images/product-ui-design.png"),
        },
        {
            id: 3,
            name: "Tom Ford Oud Wood",
            desc: translate({
                ar: "مكونات مرنة لبناء واجهات سريعة ومتناسقة.",
                en: "Flexible components for fast and consistent interfaces.",
            }),
            price: "$210",
            img: publicAsset("/images/product-colors.png"),
            hoverImg: publicAsset("/images/product-ui-design.png"),
        },
        {
            id: 4,
            name: "YSL Libre",
            desc: translate({
                ar: "مكونات مرنة لبناء واجهات سريعة ومتناسقة.",
                en: "Flexible components for fast and consistent interfaces.",
            }),
            price: "$110",
            img: publicAsset("/images/product-colors.png"),
            hoverImg: publicAsset("/images/product-ui-design.png"),
        },
        {
            id: 5,
            name: "Creed Aventus",
            desc: translate({
                ar: "مكونات مرنة لبناء واجهات سريعة ومتناسقة.",
                en: "Flexible components for fast and consistent interfaces.",
            }),
            price: "$320",
            img: publicAsset("/images/product-colors.png"),
            hoverImg: publicAsset("/images/product-ui-design.png"),
        },
    ];

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

            <Navbar position="sticky" background="surface">
                <NavbarContainer
                    width="full"
                    className="min-h-24 my-10  grid grid-cols-[2.5rem_1fr_2.5rem] md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]"
                    dir="ltr"
                >
                    <NavbarActions
                        className={`hidden md:flex ${
                            direction === "ltr"
                                ? "md:col-start-3 md:justify-self-end"
                                : "md:col-start-1 md:justify-self-start"
                        }`}
                        dir={direction}
                    >
                        <Button
                            size="icon"
                            variant="ghost"
                            rounded="full"
                            type="button"
                            aria-label={translate({
                                ar: "الطلبات",
                                en: "Orders",
                            })}
                            title={translate({
                                ar: "الطلبات",
                                en: "Orders",
                            })}
                        >
                            <LuPackage className="h-5 w-5" />
                        </Button>

                        {user ? (
                            <NavbarDropdown
                                label={<LuUserRound className="h-5 w-5" />}
                                align="start"
                                motion="flip"
                                width="md"
                                duration="normal"
                                triggerProps={{
                                    "aria-label": translate({
                                        ar: "الحساب",
                                        en: "Account",
                                    }),
                                    title: translate({
                                        ar: "الحساب",
                                        en: "Account",
                                    }),
                                    className:
                                        "h-10 w-10 justify-center rounded-full p-0",
                                }}
                                menuClassName="space-y-1"
                            >
                                <NavbarLink
                                    href="#settings"
                                    className="flex w-full items-center gap-2 text-start"
                                >
                                    <LuSettings className="h-4 w-4" />
                                    {translate({
                                        ar: "الإعدادات",
                                        en: "Settings",
                                    })}
                                </NavbarLink>

                                <NavbarLink
                                    href="#favorites"
                                    className="flex w-full items-center gap-2 text-start"
                                >
                                    <LuHeart className="h-4 w-4" />
                                    {translate({
                                        ar: "المفضلة",
                                        en: "Favorites",
                                    })}
                                </NavbarLink>

                                <Button
                                    size="sm"
                                    variant="ghost"
                                    fullWidth
                                    type="button"
                                    onClick={() => router.post(route("logout"))}
                                    className="justify-start gap-2 text-red-700 hover:text-red-800 dark:text-red-300 dark:hover:text-red-200"
                                >
                                    <LuLogOut className="h-4 w-4" />
                                    {translate({
                                        ar: "تسجيل الخروج",
                                        en: "Logout",
                                    })}
                                </Button>
                            </NavbarDropdown>
                        ) : (
                            <Button
                                size="icon"
                                variant="ghost"
                                rounded="full"
                                type="button"
                                onClick={() => setCustomerAuthOpen(true)}
                                aria-label={translate({
                                    ar: "تسجيل الدخول",
                                    en: "Login",
                                })}
                                title={translate({
                                    ar: "تسجيل الدخول",
                                    en: "Login",
                                })}
                            >
                                <LuUserRound className="h-5 w-5" />
                            </Button>
                        )}

                        <Button
                            size="icon"
                            variant="ghost"
                            rounded="full"
                            type="button"
                            onClick={() => setIsOpen(true)}
                            aria-label={translate({
                                ar: "عربة التسوق",
                                en: "Cart",
                            })}
                            title={translate({
                                ar: "عربة التسوق",
                                en: "Cart",
                            })}
                        >
                            <LuShoppingCart className="h-5 w-5" />
                        </Button>

                        <ModeButton />
                        <LanguageButton />
                    </NavbarActions>

                    <NavbarLinks
                        className="row-start-2 hidden md:flex col-start-2 justify-self-center"
                        dir={direction}
                    >
                        {navbar.map((nav) => (
                            <NavbarLink key={nav.href} href={nav.href}>
                                {nav.name}
                            </NavbarLink>
                        ))}
                    </NavbarLinks>

                    <NavbarBrand
                        className="col-start-2 row-start-1 justify-self-center md:col-start-2"
                        dir={direction}
                    >
                        <NavbarLogo
                            href="#"
                            alt={translate({
                                ar: `شعار ${appName}`,
                                en: `${appName} logo`,
                            })}
                            imageClassName="h-10"
                        />
                    </NavbarBrand>

                    <form
                        role="search"
                        className={`relative hidden w-full max-w-sm md:block row-start-1 ${
                            direction === "ltr"
                                ? "md:col-start-1 md:justify-self-start"
                                : "md:col-start-3 md:justify-self-end"
                        }`}
                        dir="rtl"
                    >
                        <LuSearch className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="search"
                            className="h-10 w-full rounded-full border border-slate-200 bg-transparent pe-4 ps-10 pr-10 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:focus:border-slate-500 dark:focus:ring-slate-800"
                            placeholder={translate({
                                ar: "ابحث...",
                                en: "Search...",
                            })}
                            aria-label={translate({
                                ar: "البحث",
                                en: "Search",
                            })}
                        />
                    </form>

                    <NavbarToggle
                        className="col-start-1 row-start-1 justify-self-start"
                        menuIcon={<CgMenuRight className="text-xl" />}
                        closeIcon={
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinecap="butt"
                                className="h-6 w-6"
                            >
                                <path d="M7 7l10 10M17 7 7 17" />
                            </svg>
                        }
                    />
                </NavbarContainer>

                <NavbarMobileMenu
                    placement="right"
                    motion="slide"
                    duration="slow"
                >
                    <NavbarLinks className="flex-col items-stretch">
                        {navbar.map((nav) => (
                            <NavbarLink key={nav.href} href={nav.href}>
                                {nav.name}
                            </NavbarLink>
                        ))}
                    </NavbarLinks>

                    <NavbarActions className="mt-4 justify-center border-t border-slate-200 pt-4 dark:border-slate-700">
                        <Button
                            size="icon"
                            variant="ghost"
                            rounded="full"
                            type="button"
                            aria-label={translate({
                                ar: "الطلبات",
                                en: "Orders",
                            })}
                            title={translate({
                                ar: "الطلبات",
                                en: "Orders",
                            })}
                        >
                            <LuPackage className="h-5 w-5" />
                        </Button>

                        <Button
                            size="icon"
                            variant="ghost"
                            rounded="full"
                            type="button"
                            onClick={() =>
                                user
                                    ? router.post(route("logout"))
                                    : setCustomerAuthOpen(true)
                            }
                            aria-label={translate({
                                ar: user ? "تسجيل الخروج" : "تسجيل الدخول",
                                en: user ? "Logout" : "Login",
                            })}
                            title={translate({
                                ar: user ? "تسجيل الخروج" : "تسجيل الدخول",
                                en: user ? "Logout" : "Login",
                            })}
                        >
                            {user ? (
                                <LuLogOut className="h-5 w-5" />
                            ) : (
                                <LuUserRound className="h-5 w-5" />
                            )}
                        </Button>

                        <Button
                            size="icon"
                            variant="ghost"
                            rounded="full"
                            type="button"
                            onClick={() => setIsOpen(true)}
                            aria-label={translate({
                                ar: "عربة التسوق",
                                en: "Cart",
                            })}
                            title={translate({
                                ar: "عربة التسوق",
                                en: "Cart",
                            })}
                        >
                            <LuShoppingCart className="h-5 w-5" />
                        </Button>

                        <ModeButton />
                        <LanguageButton />
                    </NavbarActions>
                </NavbarMobileMenu>
            </Navbar>

            <CustomerAuthModal
                open={!user && customerAuthOpen}
                onClose={() => setCustomerAuthOpen(false)}
            />

            {/* start page content */}

            <main
                className="min-h-screen transition-colors duration-300"
                style={{
                    background: `linear-gradient(${colors.muted}0d, ${colors.muted}0d), ${colors.background}`,
                    color: colors.text,
                }}
            >
                <Container
                    width="wide"
                    gutter="none"
                    paddingY="md"
                    className="space-y-14"
                >
                    <Grid
                        layout="one"
                        gap="sm"
                        padding="none"
                        background="transparent"
                        rounded="none"
                        align="stretch"
                        className="lg:h-[590px] lg:!grid-cols-[2.4fr_1fr_1fr]"
                    >
                        <GridItem dir={direction} className="min-h-[420px]">
                            <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#f3eee9] p-8 text-center text-slate-700">
                                <img
                                    src="/images/avora-campaign/avora-gold.png"
                                    alt="AVORA perfume"
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-white/15" />
                                <div className="relative mt-20 bg-white/65 px-8 py-6 backdrop-blur-[2px]">
                                    <h2 className="font-playfair text-4xl font-light uppercase tracking-wide lg:text-5xl">
                                        {translate({
                                            ar: "عطر يروي حكايتك",
                                            en: "A scent that tells your story",
                                        })}
                                    </h2>
                                    <p className="mt-6 text-xs uppercase tracking-[0.35em] text-slate-400">
                                        {translate({
                                            ar: "مجموعة أفورا الفاخرة",
                                            en: "The AVORA luxury collection",
                                        })}
                                    </p>
                                </div>
                            </div>
                        </GridItem>

                        <GridItem className="grid min-h-[590px] grid-rows-[1fr_1.85fr] gap-3">
                            <div className="relative flex items-center justify-center overflow-hidden bg-[#2f3033] p-6 text-center text-white">
                                <img
                                    src="/images/avora-campaign/avora-noir.png"
                                    alt="AVORA Noir perfume"
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/35" />
                                <div className="relative">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.35em]">
                                        {translate({
                                            ar: "إصدار جديد",
                                            en: "New fragrance",
                                        })}
                                    </p>
                                    <h3 className="mt-6 text-2xl font-medium uppercase leading-tight tracking-[0.12em]">
                                        {translate({
                                            ar: "أفورا نوار",
                                            en: "AVORA Noir",
                                        })}
                                    </h3>
                                </div>
                            </div>

                            <div className="relative flex items-end justify-center overflow-hidden bg-[#f7f4ef] p-6 text-center text-slate-700">
                                <img
                                    src="/images/avora-campaign/avora-gold.png"
                                    alt="AVORA Gold perfume"
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                                <div className="relative mb-0 w-full bg-white/80 px-5 py-5 backdrop-blur-[2px]">
                                    <p className="font-playfair text-sm italic">
                                        {translate({
                                            ar: "أناقة تدوم",
                                            en: "Lasting elegance",
                                        })}
                                    </p>
                                    <p className="mt-4 text-xs font-bold uppercase tracking-[0.3em]">
                                        {translate({
                                            ar: "اكتشف المجموعة",
                                            en: "Discover the collection",
                                        })}
                                    </p>
                                </div>
                            </div>
                        </GridItem>

                        <GridItem className="grid min-h-[590px] grid-rows-[1.08fr_0.92fr] gap-3">
                            <div className="relative flex items-center justify-center overflow-hidden bg-[#e8ddd9] p-5 text-center text-slate-700">
                                <img
                                    src="/images/avora-campaign/avora-rose.png"
                                    alt="AVORA Rose perfume"
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                                <div className="relative w-full bg-white/75 px-5 py-5 backdrop-blur-[2px]">
                                    <p className="font-playfair text-sm italic">
                                        {translate({
                                            ar: "نفحات وردية ناعمة",
                                            en: "Delicate floral notes",
                                        })}
                                    </p>
                                    <p className="mt-4 text-xs font-bold uppercase tracking-[0.3em]">
                                        {translate({
                                            ar: "أفورا روز",
                                            en: "AVORA Rose",
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="relative flex items-center justify-center overflow-hidden bg-[#d8c5bf] p-6 text-center text-white">
                                <img
                                    src="/images/avora-campaign/avora-noir.png"
                                    alt="AVORA perfume delivery"
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/45" />
                                <div className="relative">
                                    <p className="text-4xl font-bold uppercase">
                                        {translate({ ar: "شحن", en: "Free" })}
                                    </p>
                                    <p className="mt-2 text-2xl uppercase tracking-[0.1em]">
                                        {translate({
                                            ar: "مجاني",
                                            en: "Shipping",
                                        })}
                                    </p>
                                </div>
                            </div>
                        </GridItem>
                    </Grid>

                    <section id="buy" className="scroll-mt-24 space-y-6">
                        <AddressPage
                            supAddress={translate({
                                ar: "استمتع بتشكيلة مختارة من العطور الأصلية للرجال والنساء، تجمع بين الجودة والأناقة والثبات. اختر عطرك المفضل من أشهر العلامات التجارية واستمتع بتجربة تسوق سهلة، مع أسعار تنافسية وخدمة موثوقة.",
                                en: "Explore our curated collection of authentic perfumes for men and women, featuring premium quality, elegant scents, and long-lasting performance. Shop from the world's leading brands and enjoy a seamless shopping experience with competitive prices and trusted service.",
                            })}
                            address={translate({
                                ar: "اكتشف عالمًا من العطور الفاخرة",
                                en: "Discover a World of Luxury Fragrances",
                            })}
                        />

                        <Card
                            variant="elevated"
                            padding="lg"
                            className="overflow-hidden"
                        >
                            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                                <div className="space-y-4">
                                    <CardMeta>
                                        {translate({
                                            ar: "طريقة الدفع",
                                            en: "Checkout flow",
                                        })}
                                    </CardMeta>
                                    <CardTitle>
                                        {translate({
                                            ar: "السعر بيتحدد من المنتج نفسه",
                                            en: "Price comes from the selected product",
                                        })}
                                    </CardTitle>
                                    <CardDescription>
                                        {translate({
                                            ar: "العميل يضغط شراء من كارت المنتج. الموقع يبعت رقم المنتج فقط، والباك إند يجيب الاسم والسعر الحقيقيين من الكتالوج قبل ما يرسل العملية للبوابة.",
                                            en: "The customer buys from a product card. The website sends only the product ID, then the backend resolves the real name and price before creating the gateway checkout.",
                                        })}
                                    </CardDescription>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900">
                                        <span className="block font-semibold text-slate-700 dark:text-slate-200">
                                            {translate({
                                                ar: "عملة الموقع",
                                                en: "Website currency",
                                            })}
                                        </span>
                                        <span className="mt-1 block text-slate-500 dark:text-slate-400">
                                            {websiteCurrency}
                                        </span>
                                    </div>

                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900">
                                        <span className="block font-semibold text-slate-700 dark:text-slate-200">
                                            {translate({
                                                ar: "بوابة الدفع المفعلة",
                                                en: "Active payment gateway",
                                            })}
                                        </span>
                                        <span className="mt-1 block text-slate-500 dark:text-slate-400">
                                            {activePaymentGateway
                                                ? activePaymentGateway.name
                                                : translate({
                                                      ar: "لا توجد بوابة مفعلة",
                                                      en: "No enabled gateway",
                                                  })}
                                        </span>
                                        {checkoutGatewayError && (
                                            <span className="mt-1 block text-xs text-red-500">
                                                {checkoutGatewayError}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </section>
                    <section id="prodcts" className="scroll-mt-24 space-y-6">
                        <Grid layout="cards" gap="md" width="full">
                            {storeProducts.map((product) => {
                                const image =
                                    product.images.find(
                                        (item) => item.type === "main",
                                    ) ?? product.images[0];

                                return (
                                    <GridItem key={product.id}>
                                        <ProductCard
                                            desc={
                                                direction === "rtl"
                                                    ? (product.desc_ar ?? "")
                                                    : (product.desc_en ?? "")
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
                                            onAddToCart={() =>
                                                addToCart(product.id)
                                            }
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
                    </section>

                    {/* section blog */}
                    <section id="blog" className="scroll-mt-24 space-y-6">
                        {articles.length > 0 && (
                            <Grid layout="cards" gap="md" width="full">
                                {articles.map((article) => (
                                    <GridItem key={article.id}>
                                        <BlogCard
                                            title={
                                                direction === "rtl"
                                                    ? article.title_ar
                                                    : article.title_en
                                            }
                                            imageSrc={
                                                article.image
                                                    ? `/storage/${article.image}`
                                                    : "/images/article-samples/morning-fragrance-triptych.png"
                                            }
                                            imageAlt={
                                                direction === "rtl"
                                                    ? article.title_ar
                                                    : article.title_en
                                            }
                                            buttonLabel={translate({
                                                ar: "اقرأ المقال",
                                                en: "Read article",
                                            })}
                                            onReadPost={() =>
                                                router.visit(
                                                    route(
                                                        "articles.show",
                                                        direction === "rtl"
                                                            ? article.slug_ar
                                                            : article.slug_en,
                                                    ),
                                                )
                                            }
                                        />
                                    </GridItem>
                                ))}
                            </Grid>
                        )}
                        <Slider
                            ariaLabel={translate({
                                ar: "مقالات أفورا",
                                en: "AVORA articles",
                            })}
                            items={[
                                {
                                    id: "avora-gold",
                                    content: (
                                        <BlogCard
                                            title={translate({
                                                ar: "اكتشف سحر عطر أفورا جولد الفاخر.",
                                                en: "Discover the charm of the luxurious AVORA Gold fragrance.",
                                            })}
                                            imageSrc="/images/avora-campaign/avora-gold.png"
                                            imageAlt={translate({
                                                ar: "عطر أفورا جولد",
                                                en: "AVORA Gold perfume",
                                            })}
                                            buttonLabel={translate({
                                                ar: "اقرأ المقال",
                                                en: "READ POST",
                                            })}
                                        />
                                    ),
                                },
                                {
                                    id: "avora-signature",
                                    content: (
                                        <BlogCard
                                            title={translate({
                                                ar: "اكتشف القصة وراء عطور أفورا المميزة.",
                                                en: "Discover the story behind AVORA's signature fragrances.",
                                            })}
                                            imageSrc="/images/avora-campaign/avora-gold.png"
                                            imageAlt={translate({
                                                ar: "مجموعة عطور أفورا",
                                                en: "AVORA fragrance collection",
                                            })}
                                            buttonLabel={translate({
                                                ar: "اقرأ المقال",
                                                en: "READ POST",
                                            })}
                                        />
                                    ),
                                },
                                {
                                    id: "avora-gold",
                                    content: (
                                        <BlogCard
                                            title={translate({
                                                ar: "اكتشف سحر عطر أفورا جولد الفاخر.",
                                                en: "Discover the charm of the luxurious AVORA Gold fragrance.",
                                            })}
                                            imageSrc="/images/avora-campaign/avora-gold.png"
                                            imageAlt={translate({
                                                ar: "عطر أفورا جولد",
                                                en: "AVORA Gold perfume",
                                            })}
                                            buttonLabel={translate({
                                                ar: "اقرأ المقال",
                                                en: "READ POST",
                                            })}
                                        />
                                    ),
                                },
                                {
                                    id: "avora-signature",
                                    content: (
                                        <BlogCard
                                            title={translate({
                                                ar: "اكتشف القصة وراء عطور أفورا المميزة.",
                                                en: "Discover the story behind AVORA's signature fragrances.",
                                            })}
                                            imageSrc="/images/avora-campaign/avora-gold.png"
                                            imageAlt={translate({
                                                ar: "مجموعة عطور أفورا",
                                                en: "AVORA fragrance collection",
                                            })}
                                            buttonLabel={translate({
                                                ar: "اقرأ المقال",
                                                en: "READ POST",
                                            })}
                                        />
                                    ),
                                },
                                {
                                    id: "avora-gold",
                                    content: (
                                        <BlogCard
                                            title={translate({
                                                ar: "اكتشف سحر عطر أفورا جولد الفاخر.",
                                                en: "Discover the charm of the luxurious AVORA Gold fragrance.",
                                            })}
                                            imageSrc="/images/avora-campaign/avora-gold.png"
                                            imageAlt={translate({
                                                ar: "عطر أفورا جولد",
                                                en: "AVORA Gold perfume",
                                            })}
                                            buttonLabel={translate({
                                                ar: "اقرأ المقال",
                                                en: "READ POST",
                                            })}
                                        />
                                    ),
                                },
                                {
                                    id: "avora-signature",
                                    content: (
                                        <BlogCard
                                            title={translate({
                                                ar: "اكتشف القصة وراء عطور أفورا المميزة.",
                                                en: "Discover the story behind AVORA's signature fragrances.",
                                            })}
                                            imageSrc="/images/avora-campaign/avora-gold.png"
                                            imageAlt={translate({
                                                ar: "مجموعة عطور أفورا",
                                                en: "AVORA fragrance collection",
                                            })}
                                            buttonLabel={translate({
                                                ar: "اقرأ المقال",
                                                en: "READ POST",
                                            })}
                                        />
                                    ),
                                },
                            ]}
                            slidesPerView={1}
                            spaceBetween={24}
                            arrows
                            pagination
                            breakpoints={{
                                768: { slidesPerView: 2 },
                            }}
                        />
                    </section>
                </Container>

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
                            <Button
                                variant="ghost"
                                onClick={() => setIsOpen(false)}
                            >
                                إلغاء
                            </Button>

                            <Button
                                type="button"
                                disabled={!cartProducts.length}
                            >
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
                                                    Number(product.price) *
                                                    quantity
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
                                            onClick={() =>
                                                removeFromCart(product.id)
                                            }
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
            </main>
        </>
    );
}
