import { Button } from "@/avora-dash/components/Button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardImage,
    CardMeta,
    CardPrice,
    CardTitle,
} from "@/avora-dash/components/Card";
import { Container } from "@/avora-dash/components/Container";
import { Grid, GridItem } from "@/avora-dash/components/Grid";
import { LanguageButton } from "@/avora-dash/components/LanguageButton";
import {
    Navbar,
    NavbarActions,
    NavbarBrand,
    NavbarContainer,
    NavbarDesktop,
    NavbarLink,
    NavbarLinks,
    NavbarLogo,
    NavbarMobileMenu,
    NavbarOverlay,
    NavbarToggle,
} from "@/avora-dash/components/Navbar";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";
import ModeButton from "@/avora-dash/providers/ModeButton";
import { useTheme } from "@/avora-dash/providers/ThemeProvider";
import { PageProps } from "@/types";
import { Head, router, usePage } from "@inertiajs/react";
import { useAppName } from "@/avora-dash/hooks/useAppName";
import { AddressPage } from "@/components/AddressPage";
import { CustomerAuthModal } from "@/components/CustomerAuthModal";
import { useState } from "react";
import { FaRightFromBracket, FaUserCheck } from "react-icons/fa6";

const publicAsset = (path: string) => `${window.location.origin}${path}`;

export default function Welcome({}: PageProps) {
    const { colors } = useTheme();
    const { translate } = useLanguage();
    const appName = useAppName();
    const [customerAuthOpen, setCustomerAuthOpen] = useState(false);
    const [purchasingProductId, setPurchasingProductId] = useState<
        string | null
    >(null);
    const page = usePage<PageProps & { errors?: Record<string, string> }>();
    const user = page.props.auth.user;
    const websiteCurrency = page.props.websiteSettings.currency ?? "EGP";
    const enabledPaymentGateways = page.props.paymentGateways.filter(
        (gateway) => gateway.enabled,
    );
    const activePaymentGateway = enabledPaymentGateways[0];

    const buyProduct = (productId: string) => {
        router.post(
            route("checkout.store"),
            {
                product_id: productId,
            },
            {
                preserveScroll: true,
                onStart: () => setPurchasingProductId(productId),
                onFinish: () => setPurchasingProductId(null),
            },
        );
    };

    const checkoutGatewayError =
        page.props.errors?.gateway_slug ?? page.props.errors?.product_id;

    const customerAction = (fullWidth = false) =>
        user ? (
            <Button
                size="sm"
                variant="danger"
                fullWidth={fullWidth}
                type="button"
                onClick={() => router.post(route("logout"))}
                className="gap-2"
            >
                <FaRightFromBracket className="h-4 w-4" />
                {translate({ ar: "تسجيل الخروج", en: "Logout" })}
            </Button>
        ) : (
            <Button
                size="sm"
                variant="outline"
                fullWidth={fullWidth}
                type="button"
                onClick={() => setCustomerAuthOpen(true)}
                className="gap-2"
            >
                {user ? (
                    <FaRightFromBracket className="h-4 w-4" />
                ) : (
                    <FaUserCheck className="h-4 w-4" />
                )}
                {user
                    ? translate({ ar: "تسجيل الخروج", en: "Logout" })
                    : translate({ ar: "دخول العملاء", en: "Client login" })}
            </Button>
        );

    const navbar = [
        {
            href: "#home",
            name: translate({ ar: "الرئسية", en: "Home" }),
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

    const products = [
        {
            id: "avora-system",
            image: publicAsset("/images/product-ui-design.png"),
            category: translate({ ar: "تصميم واجهات", en: "UI Design" }),
            title: translate({
                ar: `نظام ${appName}`,
                en: `${appName} System`,
            }),
            description: translate({
                ar: "مكونات مرنة لبناء واجهات سريعة ومتناسقة.",
                en: "Flexible Components for fast and consistent interfaces.",
            }),
            amount: 1200,
            price: translate({
                ar: `١٢٠٠ ${websiteCurrency}`,
                en: `${websiteCurrency} 1,200`,
            }),
        },
        {
            id: "color-collection",
            image: publicAsset("/images/product-colors.png"),
            category: translate({ ar: "هوية بصرية", en: "Brand Identity" }),
            title: translate({ ar: "حزمة الألوان", en: "Color Collection" }),
            description: translate({
                ar: "ألوان جاهزة للوضع الفاتح والداكن.",
                en: "Ready colors for both light and dark modes.",
            }),
            amount: 850,
            price: translate({
                ar: `٨٥٠ ${websiteCurrency}`,
                en: `${websiteCurrency} 850`,
            }),
        },
        {
            id: "grid-collection",
            image: publicAsset("/images/product-grid.png"),
            category: translate({
                ar: "تخطيط متجاوب",
                en: "Responsive Layout",
            }),
            title: translate({ ar: "مجموعة الجريد", en: "Grid Collection" }),
            description: translate({
                ar: "تقسيمات ذكية تتأقلم مع جميع الشاشات.",
                en: "Smart layouts that adapt to every screen size.",
            }),
            amount: 950,
            price: translate({
                ar: `٩٥٠ ${websiteCurrency}`,
                en: `${websiteCurrency} 950`,
            }),
        },
    ];

    return (
        <>
            <Head
                title={translate({
                    ar: `معرض نظام ${appName}`,
                    en: `${appName} System Showcase`,
                })}
            />

            <Navbar position="sticky" background="surface" shadow="sm" bordered>
                <NavbarContainer width="full" height="lg">
                    <NavbarBrand>
                        <NavbarLogo
                            href="#"
                            src={publicAsset("/images/avora-logo.svg")}
                            alt={translate({
                                ar: `شعار ${appName}`,
                                en: `${appName} logo`,
                            })}
                            imageClassName="h-10"
                        />
                    </NavbarBrand>

                    <NavbarDesktop>
                        <NavbarLinks>
                            {navbar.map((nav) => (
                                <NavbarLink href={nav.href}>
                                    {nav.name}
                                </NavbarLink>
                            ))}
                        </NavbarLinks>

                        <NavbarActions>
                            <ModeButton />
                            <LanguageButton />
                            <Button
                                size="sm"
                                variant={user ? "danger" : "outline"}
                                type="button"
                                onClick={() =>
                                    user
                                        ? router.post(route("logout"))
                                        : setCustomerAuthOpen(true)
                                }
                                className="gap-2"
                            >
                                {user ? (
                                    <FaRightFromBracket className="h-4 w-4" />
                                ) : (
                                    <FaUserCheck className="h-4 w-4" />
                                )}
                                {user
                                    ? translate({
                                          ar: "تسجيل الخروج",
                                          en: "Logout",
                                      })
                                    : translate({
                                          ar: "دخول العملاء",
                                          en: "Client login",
                                      })}
                            </Button>
                            <Button
                                size="sm"
                                type="button"
                                onClick={() => setCustomerAuthOpen(true)}
                            >
                                {translate({
                                    ar: "ابدأ الآن",
                                    en: "Get started",
                                })}
                            </Button>
                        </NavbarActions>
                    </NavbarDesktop>

                    <NavbarToggle
                        menuIcon={
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                className="h-6 w-6"
                            >
                                <path d="M5 8h14M9 16h10" />
                            </svg>
                        }
                        closeIcon={
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
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
                    duration="normal"
                >
                    <NavbarLinks className="flex-col items-stretch">
                        {navbar.map((nav) => (
                            <NavbarLink href={nav.href}>{nav.name}</NavbarLink>
                        ))}
                    </NavbarLinks>

                    <NavbarActions className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
                        <ModeButton />
                        <LanguageButton />
                        <Button
                            size="sm"
                            variant={user ? "danger" : "outline"}
                            fullWidth
                            type="button"
                            onClick={() =>
                                user
                                    ? router.post(route("logout"))
                                    : setCustomerAuthOpen(true)
                            }
                            className="gap-2"
                        >
                            {user ? (
                                <FaRightFromBracket className="h-4 w-4" />
                            ) : (
                                <FaUserCheck className="h-4 w-4" />
                            )}
                            {user
                                ? translate({
                                      ar: "تسجيل الخروج",
                                      en: "Logout",
                                  })
                                : translate({
                                      ar: "دخول العملاء",
                                      en: "Client login",
                                  })}
                        </Button>
                        <Button
                            size="sm"
                            fullWidth
                            type="button"
                            onClick={() => setCustomerAuthOpen(true)}
                        >
                            {translate({ ar: "ابدأ الآن", en: "Get started" })}
                        </Button>
                    </NavbarActions>
                </NavbarMobileMenu>

                <NavbarOverlay opacity="medium" />
            </Navbar>

            <main
                className="min-h-screen transition-colors duration-300"
                style={{
                    background: `linear-gradient(${colors.muted}0d, ${colors.muted}0d), ${colors.background}`,
                    color: colors.text,
                }}
            >
                <Container
                    width="wide"
                    gutter="md"
                    paddingY="lg"
                    className="space-y-14"
                >
                    <Grid
                        layout="two"
                        gap="lg"
                        padding="lg"
                        background="gradient"
                        rounded="none"
                        align="center"
                    >
                        <div className="space-y-5">
                            <CardMeta>
                                {translate({
                                    ar: "متجاوب • عربي وإنجليزي",
                                    en: "Responsive • Arabic & English",
                                })}
                            </CardMeta>
                            <h2 className="max-w-2xl text-3xl font-bold leading-tight sm:text-5xl">
                                {translate({
                                    ar: "ابنِ صفحات أنيقة بجريد واحد مرن.",
                                    en: "Build polished pages with one flexible grid.",
                                })}
                            </h2>
                            <p
                                className="max-w-xl leading-7"
                                style={{ color: colors.muted }}
                            >
                                {translate({
                                    ar: "غيّر حجم الشاشة لتشاهد الكروت والتقسيمات وهي تتجاوب تلقائيًا.",
                                    en: "Resize the screen to see cards and layouts adapt automatically.",
                                })}
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Button
                                    type="button"
                                    variant={user ? "danger" : "outline"}
                                    onClick={() =>
                                        user
                                            ? router.post(route("logout"))
                                            : setCustomerAuthOpen(true)
                                    }
                                    className="gap-2"
                                >
                                    {user ? (
                                        <FaRightFromBracket className="h-4 w-4" />
                                    ) : (
                                        <FaUserCheck className="h-4 w-4" />
                                    )}
                                    {user
                                        ? translate({
                                              ar: "تسجيل الخروج",
                                              en: "Logout",
                                          })
                                        : translate({
                                              ar: "دخول العملاء",
                                              en: "Client login",
                                          })}
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => setCustomerAuthOpen(true)}
                                >
                                    {translate({
                                        ar: "ابدأ الآن",
                                        en: "Get started",
                                    })}
                                </Button>
                                <Button variant="outline">
                                    {translate({
                                        ar: "عرض الخيارات",
                                        en: "View options",
                                    })}
                                </Button>
                            </div>
                        </div>

                        <Card variant="elevated" padding="lg">
                            <CardMeta>
                                {translate({
                                    ar: "معاينة مباشرة",
                                    en: "Live preview",
                                })}
                            </CardMeta>
                            <div className="mt-5 grid grid-cols-2 gap-3">
                                {["01", "02", "03", "04"].map((number) => (
                                    <div
                                        key={number}
                                        className="rounded-xl p-5 text-center text-lg font-bold"
                                        style={{
                                            backgroundColor: `${colors.primary}14`,
                                            color: colors.primary,
                                        }}
                                    >
                                        {number}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </Grid>

                    <section id="buy" className="scroll-mt-24 space-y-6">
                        <AddressPage
                            supAddress="CHECKOUT"
                            address={translate({
                                ar: "جرب شراء منتج وتحويله لبوابة الدفع",
                                en: "Try buying a product and redirecting to payment",
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

                    <section id="cards" className="scroll-mt-24 space-y-6">
                        <AddressPage
                            supAddress="AUTO-FIT GRID"
                            address={translate({
                                ar: "كروت متجاوبة تلقائيًا",
                                en: "Automatically responsive cards",
                            })}
                        />

                        <Grid minItemWidth="260px" gap="lg">
                            {checkoutGatewayError && (
                                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
                                    {checkoutGatewayError}
                                </div>
                            )}
                            {products.map((product) => (
                                <Card
                                    key={product.title}
                                    variant="elevated"
                                    className="overflow-hidden"
                                >
                                    <CardImage
                                        src={product.image}
                                        alt={product.title}
                                    />
                                    <CardHeader>
                                        <CardMeta>{product.category}</CardMeta>
                                        <CardTitle>{product.title}</CardTitle>
                                        <CardDescription>
                                            {product.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardFooter>
                                        <CardPrice>{product.price}</CardPrice>
                                        <Button
                                            size="sm"
                                            type="button"
                                            disabled={
                                                purchasingProductId !== null
                                            }
                                            onClick={() =>
                                                buyProduct(product.id)
                                            }
                                        >
                                            {purchasingProductId === product.id
                                                ? translate({
                                                      ar: "جاري الدفع...",
                                                      en: "Paying...",
                                                  })
                                                : translate({
                                                      ar: "اشتري الآن",
                                                      en: "Buy now",
                                                  })}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </Grid>
                    </section>

                    <section id="dashboard" className="scroll-mt-24 space-y-6">
                        <AddressPage
                            supAddress="AUTO-FIT GRID"
                            address={translate({
                                ar: "تقسيم داشبورد بأحجام مختلفة",
                                en: "Dashboard with different item sizes",
                            })}
                        />
                        <Grid layout="dashboard" gap="md">
                            <GridItem mdSpan="two">
                                <Card variant="elevated" padding="lg">
                                    <CardMeta>
                                        {translate({
                                            ar: "إجمالي المبيعات",
                                            en: "Total sales",
                                        })}
                                    </CardMeta>
                                    <p className="mt-3 text-3xl font-bold">
                                        {translate({
                                            ar: "٤٨٬٢٠٠ ج.م",
                                            en: "EGP 48,200",
                                        })}
                                    </p>
                                    <p
                                        className="mt-2 text-sm"
                                        style={{ color: colors.success }}
                                    >
                                        +18.4%
                                    </p>
                                </Card>
                            </GridItem>

                            {[
                                translate({ ar: "١٢٤ طلب", en: "124 orders" }),
                                translate({ ar: "٨٩ عميل", en: "89 clients" }),
                            ].map((value) => (
                                <GridItem key={value}>
                                    <Card padding="lg" className="h-full">
                                        <CardMeta>
                                            {translate({
                                                ar: "هذا الشهر",
                                                en: "This month",
                                            })}
                                        </CardMeta>
                                        <p className="mt-3 text-2xl font-bold">
                                            {value}
                                        </p>
                                    </Card>
                                </GridItem>
                            ))}
                        </Grid>
                    </section>

                    <section className="space-y-6">
                        <AddressPage
                            supAddress="AUTO-FIT GRID"
                            address={translate({
                                ar: "تقسيم صفحة مع قائمة جانبية",
                                en: "Page layout with a sidebar",
                            })}
                        />
                        <Grid
                            layout="sidebarStart"
                            gap="lg"
                            padding="lg"
                            background="muted"
                            backgroundImage={publicAsset(
                                "/images/avora-card-blue.svg",
                            )}
                            backgroundImageOpacity={0.08}
                            backgroundImageAttachment="fixed"
                            backgroundImageSize="cover"
                            rounded="none"
                            align="start"
                        >
                            <Card padding="md">
                                <CardTitle>
                                    {translate({
                                        ar: "الفلاتر",
                                        en: "Filters",
                                    })}
                                </CardTitle>
                                <div className="mt-4 space-y-2">
                                    {[
                                        translate({ ar: "الكل", en: "All" }),
                                        translate({
                                            ar: "تصميم",
                                            en: "Design",
                                        }),
                                        translate({
                                            ar: "تطوير",
                                            en: "Development",
                                        }),
                                    ].map((item, index) => (
                                        <button
                                            key={item}
                                            type="button"
                                            className="w-full rounded-lg px-3 py-2 text-start text-sm"
                                            style={{
                                                backgroundColor:
                                                    index === 0
                                                        ? `${colors.primary}18`
                                                        : "transparent",
                                                color:
                                                    index === 0
                                                        ? colors.primary
                                                        : colors.text,
                                            }}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </Card>

                            <Grid minItemWidth="180px" gap="md">
                                {[1, 2, 3, 4].map((item) => (
                                    <Card key={item} padding="md">
                                        <CardMeta>ITEM 0{item}</CardMeta>
                                        <CardContent className="px-0 pb-0 pt-3">
                                            <div
                                                className="h-20 rounded-lg"
                                                style={{
                                                    backgroundColor: `${colors.primary}${item * 8 + 10}`,
                                                }}
                                            />
                                        </CardContent>
                                    </Card>
                                ))}
                            </Grid>
                        </Grid>
                    </section>

                    <section
                        id="backgrounds"
                        className="scroll-mt-24 space-y-6"
                    >
                        <AddressPage
                            supAddress="BACKGROUND IMAGE OPTIONS"
                            address={translate({
                                ar: "صور خلفية بطرق عرض مختلفة",
                                en: "Background images in different modes",
                            })}
                        />

                        <Grid
                            layout="two"
                            gap="lg"
                            padding="xl"
                            background="surface"
                            backgroundImage={publicAsset("/images/image.png")}
                            backgroundImageOpacity={0.28}
                            backgroundImageAttachment="fixed"
                            backgroundImageSize="cover"
                            backgroundImagePosition="center"
                            rounded="none"
                            align="center"
                            className="min-h-[420px]"
                        >
                            <div className="space-y-4">
                                <CardMeta>FIXED + COVER + 28% OPACITY</CardMeta>
                                <h3 className="text-3xl font-bold leading-tight sm:text-4xl">
                                    {translate({
                                        ar: "خلفية ثابتة لا تؤثر على وضوح المحتوى.",
                                        en: "A fixed background that keeps content clear.",
                                    })}
                                </h3>
                                <p
                                    className="max-w-lg leading-7"
                                    style={{ color: colors.muted }}
                                >
                                    {translate({
                                        ar: "شفافية الصورة منفصلة عن العناصر، لذلك تظل النصوص والكروت بكامل وضوحها.",
                                        en: "Image opacity is separate from the elements, so text and cards remain fully visible.",
                                    })}
                                </p>
                            </div>

                            <Card variant="elevated" padding="lg">
                                <CardMeta>
                                    {translate({
                                        ar: "كارت فوق الخلفية",
                                        en: "Card over background",
                                    })}
                                </CardMeta>
                                <CardTitle className="mt-3 text-2xl">
                                    {translate({
                                        ar: "المحتوى مستقل",
                                        en: "Independent content",
                                    })}
                                </CardTitle>
                                <CardDescription className="mt-2">
                                    {translate({
                                        ar: "غيّر شفافية الصورة بدون تغيير شفافية هذا الكارت.",
                                        en: "Change the image opacity without changing this card opacity.",
                                    })}
                                </CardDescription>
                            </Card>
                        </Grid>

                        <Grid minItemWidth="280px" gap="lg">
                            <Grid
                                layout="one"
                                padding="lg"
                                background="primary"
                                backgroundImage={publicAsset(
                                    "/images/avora-card-emerald.svg",
                                )}
                                backgroundImageOpacity={0.2}
                                backgroundImageSize="contain"
                                backgroundImagePosition="center"
                                rounded="md"
                                className="min-h-64"
                            >
                                <Card padding="md" className="self-end">
                                    <CardMeta>CONTAIN • OPACITY 20%</CardMeta>
                                    <CardTitle className="mt-2">
                                        {translate({
                                            ar: "الصورة كاملة داخل المساحة",
                                            en: "The full image fits inside",
                                        })}
                                    </CardTitle>
                                </Card>
                            </Grid>

                            <Grid
                                layout="one"
                                padding="lg"
                                background="muted"
                                backgroundImage={publicAsset(
                                    "/images/avora-card-blue.svg",
                                )}
                                backgroundImageOpacity={0.12}
                                backgroundImageSize="180px"
                                backgroundImageRepeat="repeat"
                                rounded="md"
                                className="min-h-64"
                            >
                                <Card padding="md" className="self-end">
                                    <CardMeta>REPEAT • CUSTOM SIZE</CardMeta>
                                    <CardTitle className="mt-2">
                                        {translate({
                                            ar: "نمط صورة متكرر",
                                            en: "Repeating image pattern",
                                        })}
                                    </CardTitle>
                                </Card>
                            </Grid>
                        </Grid>
                    </section>
                </Container>
            </main>

            <CustomerAuthModal
                open={!user && customerAuthOpen}
                onClose={() => setCustomerAuthOpen(false)}
            />
        </>
    );
}
