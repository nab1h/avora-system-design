import { Button } from "@/avora-dash/components/Button";
import { LanguageButton } from "@/avora-dash/components/LanguageButton";
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
import { CartProduct, PageProps } from "@/types";
import { router, usePage } from "@inertiajs/react";
import { CgMenuRight } from "react-icons/cg";
import {
    LuHeart,
    LuLogOut,
    LuPackage,
    LuSearch,
    LuSettings,
    LuShoppingCart,
    LuUserRound,
} from "react-icons/lu";
import { CustomerAuthModal } from "@/components/CustomerAuthModal";
import { useEffect, useRef, useState } from "react";

type StoreCategory = {
    id: number;
    name_ar: string;
    name_en: string;
    slug_ar: string | null;
    slug_en: string | null;
    img: string | null;
    sub_categories: {
        id: number;
        name_ar: string;
        name_en: string;
        img: string | null;
    }[];
};

interface IProps {
    setIsOpen: (open: boolean) => void;
}
export function StoreNavbar({ setIsOpen }: IProps) {
    const { colors } = useTheme();
    const { translate, direction } = useLanguage();
    const page = usePage<
        PageProps<{
            cartProducts?: CartProduct[];
            favoritesCount?: number;
            storeCategories?: StoreCategory[];
            storeBrands?: { id: number; name_ar: string; name_en: string }[];
        }> & { errors?: Record<string, string> }
    >();
    const [customerAuthOpen, setCustomerAuthOpen] = useState(false);
    const [shopOpen, setShopOpen] = useState(false);
    const [activeCategoryId, setActiveCategoryId] = useState<number | null>(
        null,
    );
    const shopCloseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const user = page.props.auth.user;
    const appName = useAppName();
    const cartItemsCount = (page.props.cartProducts ?? []).reduce(
        (total, product) => total + Number(product.pivot.quantity),
        0,
    );
    const favoritesCount = page.props.favoritesCount ?? 0;
    const storeCategories = page.props.storeCategories ?? [];
    const storeBrands = page.props.storeBrands ?? [];
    const activeCategory =
        storeCategories.find((category) => category.id === activeCategoryId) ??
        storeCategories[0];
    const openShopMenu = () => {
        if (shopCloseTimeout.current) {
            clearTimeout(shopCloseTimeout.current);
        }
        setShopOpen(true);
    };
    const closeShopMenu = () => {
        shopCloseTimeout.current = setTimeout(() => setShopOpen(false), 220);
    };

    const [scrolled, setScrolled] = useState(false);

    const navbar = [
        {
            href: route("home"),
            name: translate({ ar: "الرئيسية", en: "Home" }),
        },
        {
            href: route("shopping.index"),
            name: translate({ ar: "مزايا التسوق", en: "Shopping" }),
        },
        {
            href: route("brands.index"),
            name: translate({ ar: "البراندات", en: "Brands" }),
        },
    ];

    // scroll navbar
    // ===============
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 500);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    console.log(scrolled);
    // =======================
    return (
        <>
            <Navbar
                position="sticky"
                shadow={scrolled ? "md" : "none"}
                className={`
        top-0 z-50 transition-all duration-300
        ${scrolled ? "bg-transparent" : "bg-white/90 backdrop-blur-md"}
    `}
            >
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
                                    href={route("favorites.index")}
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
                            onClick={() =>
                                user
                                    ? router.visit(route("favorites.index"))
                                    : setCustomerAuthOpen(true)
                            }
                            aria-label={translate({
                                ar: "المفضلة",
                                en: "Favorites",
                            })}
                            title={translate({
                                ar: "المفضلة",
                                en: "Favorites",
                            })}
                        >
                            <span className="relative">
                                <LuHeart className="h-5 w-5" />
                                {favoritesCount > 0 && (
                                    <span className="absolute -end-2 -top-2 grid min-h-4 min-w-4 place-items-center rounded-full bg-rose-600 px-1 text-[9px] font-bold leading-4 text-white">
                                        {favoritesCount > 99
                                            ? "99+"
                                            : favoritesCount}
                                    </span>
                                )}
                            </span>
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
                            <span className="relative">
                                <LuShoppingCart className="h-5 w-5" />
                                {cartItemsCount > 0 && (
                                    <span className="absolute -end-2 -top-2 grid min-h-4 min-w-4 place-items-center rounded-full bg-rose-600 px-1 text-[9px] font-bold leading-4 text-white">
                                        {cartItemsCount > 99
                                            ? "99+"
                                            : cartItemsCount}
                                    </span>
                                )}
                            </span>
                        </Button>

                        <ModeButton />
                        <LanguageButton />
                    </NavbarActions>

                    <NavbarLinks
                        className="row-start-2 hidden md:flex col-start-2 justify-self-center"
                        dir={direction}
                    >
                        <div
                            className="relative"
                            onMouseEnter={openShopMenu}
                            onMouseLeave={closeShopMenu}
                            onFocus={openShopMenu}
                            onBlur={(event) => {
                                if (
                                    !event.currentTarget.contains(
                                        event.relatedTarget,
                                    )
                                ) {
                                    closeShopMenu();
                                }
                            }}
                        ></div>
                        {navbar.map((nav) => (
                            <NavbarLink key={nav.href} href={nav.href}>
                                {nav.name}
                            </NavbarLink>
                        ))}
                        {storeCategories.map((category) => (
                            <NavbarLink
                                key={category.id}
                                href="#"
                                active={false}
                                onMouseEnter={() => {
                                    setActiveCategoryId(category.id);
                                    openShopMenu();
                                }}
                                onClick={(event) => {
                                    event.preventDefault();
                                }}
                            >
                                {direction === "rtl"
                                    ? category.name_ar
                                    : category.name_en}
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

                <div
                    className={`absolute inset-x-0 top-[calc(100%-2.5rem)] hidden border-t shadow-xl transition md:block ${shopOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"}`}
                    style={{
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                    }}
                    onMouseEnter={openShopMenu}
                    onMouseLeave={closeShopMenu}
                >
                    {activeCategory &&
                        activeCategory.sub_categories.length > 0 && (
                            <div className="mx-auto grid max-w-7xl gap-6 px-6 py-4 lg:grid-cols-[minmax(240px,0.8fr)_minmax(0,1fr)]">
                                <a
                                    href={`${route("shopping.index")}?category=${activeCategory.id}`}
                                    className="group relative min-h-72 overflow-hidden rounded-none"
                                >
                                    {activeCategory.img ? (
                                        <img
                                            src={`/storage/${activeCategory.img}`}
                                            alt={activeCategory.name_en}
                                            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="avora-surface-muted absolute inset-0" />
                                    )}
                                    <div className="absolute inset-0 bg-black/35 group-hover:bg-black/50" />
                                    <span className="absolute inset-x-0 top-0 p-5 text-xl font-bold text-white">
                                        {direction === "rtl"
                                            ? activeCategory.name_ar
                                            : activeCategory.name_en}
                                    </span>
                                </a>
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                    {activeCategory.sub_categories.map(
                                        (subcategory) => (
                                            <a
                                                key={subcategory.id}
                                                href={`${route("shopping.index")}?category=${activeCategory.id}&subcategory=${subcategory.id}`}
                                                className="group relative min-h-36 overflow-hidden rounded-none"
                                            >
                                                {subcategory.img ? (
                                                    <img
                                                        src={`/storage/${subcategory.img}`}
                                                        alt=""
                                                        className="h-full w-full object-cover transition group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="avora-surface-muted h-full" />
                                                )}
                                                <span className="absolute inset-x-0 top-0 bg-black/60 p-2 text-center text-xs text-white">
                                                    {direction === "rtl"
                                                        ? subcategory.name_ar
                                                        : subcategory.name_en}
                                                </span>
                                            </a>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}

                    {/* <div className="mx-auto grid max-w-7xl grid-cols-3 gap-5 px-6 py-7 xl:grid-cols-4">
                        {storeCategories.map((category) => (
                            <a
                                key={category.id}
                                href="#"
                                onClick={(event) => { event.preventDefault(); setActiveCategoryId(category.id); }}
                                className="group relative min-h-36 overflow-hidden"
                            >
                                {category.img ? (
                                    <img
                                        src={`/storage/${category.img}`}
                                        alt={direction === "rtl" ? category.name_ar : category.name_en}
                                        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="avora-surface-muted absolute inset-0" />
                                )}
                                <div className="absolute inset-0 bg-black/35 transition group-hover:bg-black/45" />
                                <div className="relative flex h-full min-h-36 flex-col justify-end p-4 text-white">
                                    <span className="text-base font-semibold">
                                        {direction === "rtl" ? category.name_ar : category.name_en}
                                    </span>
                                    {category.sub_categories.length > 0 && (
                                        <span className="mt-1 line-clamp-1 text-xs text-white/85">
                                            {category.sub_categories
                                                .slice(0, 3)
                                                .map((subcategory) => direction === "rtl" ? subcategory.name_ar : subcategory.name_en)
                                                .join(" · ")}
                                        </span>
                                    )}
                                </div>
                            </a>
                        ))}
                    </div> */}
                </div>

                <NavbarMobileMenu
                    placement="right"
                    motion="slide"
                    duration="slow"
                >
                    <NavbarLinks className="flex-col items-stretch">
                        {storeCategories.map((category) => (
                            <details
                                key={category.id}
                                className="border-b border-slate-200 py-2 dark:border-slate-700"
                            >
                                <summary className="cursor-pointer px-3 py-2 text-sm font-medium">
                                    {direction === "rtl"
                                        ? category.name_ar
                                        : category.name_en}
                                </summary>
                                <div className="ms-4 mt-2 space-y-1 border-s ps-3">
                                    {category.sub_categories.map(
                                        (subcategory) => (
                                            <NavbarLink
                                                key={subcategory.id}
                                                href={`${route("shopping.index")}?category=${category.id}&subcategory=${subcategory.id}`}
                                                className="block !px-0 !py-1 text-xs"
                                            >
                                                {direction === "rtl"
                                                    ? subcategory.name_ar
                                                    : subcategory.name_en}
                                            </NavbarLink>
                                        ),
                                    )}
                                </div>
                            </details>
                        ))}
                        <NavbarLink href={`${route("home")}#cards`}>
                            {translate({ ar: "تسوّق", en: "Shop" })}
                        </NavbarLink>
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
                                    ? router.visit(route("favorites.index"))
                                    : setCustomerAuthOpen(true)
                            }
                            aria-label={translate({
                                ar: "المفضلة",
                                en: "Favorites",
                            })}
                            title={translate({
                                ar: "المفضلة",
                                en: "Favorites",
                            })}
                        >
                            <span className="relative">
                                <LuHeart className="h-5 w-5" />
                                {favoritesCount > 0 && (
                                    <span className="absolute -end-2 -top-2 grid min-h-4 min-w-4 place-items-center rounded-full bg-rose-600 px-1 text-[9px] font-bold leading-4 text-white">
                                        {favoritesCount > 99
                                            ? "99+"
                                            : favoritesCount}
                                    </span>
                                )}
                            </span>
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
                            <span className="relative">
                                <LuShoppingCart className="h-5 w-5" />
                                {cartItemsCount > 0 && (
                                    <span className="absolute -end-2 -top-2 grid min-h-4 min-w-4 place-items-center rounded-full bg-rose-600 px-1 text-[9px] font-bold leading-4 text-white">
                                        {cartItemsCount > 99
                                            ? "99+"
                                            : cartItemsCount}
                                    </span>
                                )}
                            </span>
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
        </>
    );
}
