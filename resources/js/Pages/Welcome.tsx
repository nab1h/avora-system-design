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
import { CustomerAuthModal } from "@/Components/CustomerAuthModal";
import { PageProps } from "@/types";
import { Head, router, usePage } from "@inertiajs/react";
import { useState } from "react";
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

export default function Welcome({}: PageProps) {
    const { translate, direction } = useLanguage();
    const appName = useAppName();
    const page = usePage<PageProps & { errors?: Record<string, string> }>();
    const [customerAuthOpen, setCustomerAuthOpen] = useState(false);
    const user = page.props.auth.user;

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

    return (
        <>
            <Head
                title={translate({
                    ar: `معرض ${appName}`,
                    en: `${appName} Showcase`,
                })}
            />

            <Navbar position="sticky" background="surface" shadow="sm" bordered>
                <NavbarContainer
                    width="full"
                    className="min-h-24 grid grid-cols-[2.5rem_1fr_2.5rem] md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]"
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
        </>
    );
}
