import { Button } from "@/avora-dash/Components/Button";
import { Container } from "@/avora-dash/Components/Container";
import { useAppName } from "@/avora-dash/hooks/useAppName";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";
import { useTheme } from "@/avora-dash/providers/ThemeProvider";
import type { PageProps } from "@/types";
import { usePage } from "@inertiajs/react";
import {
    LuArrowUpRight,
    LuHeart,
    LuMail,
    LuMapPin,
    LuPhone,
    LuSend,
} from "react-icons/lu";
import {
    FaDiscord,
    FaFacebookF,
    FaGithub,
    FaInstagram,
    FaLinkedinIn,
    FaPinterestP,
    FaSnapchat,
    FaTelegram,
    FaThreads,
    FaTiktok,
    FaWhatsapp,
    FaXTwitter,
    FaYoutube,
} from "react-icons/fa6";

export function StoreFooter() {
    const { colors } = useTheme();
    const { direction, translate } = useLanguage();
    const appName = useAppName();
    const settings = usePage<PageProps>().props.websiteSettings;
    const currentYear = new Date().getFullYear();
    const socialLinks = [
        { href: settings.facebook_url, label: "Facebook", icon: FaFacebookF },
        { href: settings.instagram_url, label: "Instagram", icon: FaInstagram },
        { href: settings.x_url, label: "X", icon: FaXTwitter },
        { href: settings.linkedin_url, label: "LinkedIn", icon: FaLinkedinIn },
        { href: settings.youtube_url, label: "YouTube", icon: FaYoutube },
        { href: settings.tiktok_url, label: "TikTok", icon: FaTiktok },
        { href: settings.telegram_url, label: "Telegram", icon: FaTelegram },
        { href: settings.snapchat_url, label: "Snapchat", icon: FaSnapchat },
        {
            href: settings.pinterest_url,
            label: "Pinterest",
            icon: FaPinterestP,
        },
        { href: settings.github_url, label: "GitHub", icon: FaGithub },
        { href: settings.discord_url, label: "Discord", icon: FaDiscord },
        { href: settings.threads_url, label: "Threads", icon: FaThreads },
        {
            href: settings.whatsapp
                ? `https://wa.me/${settings.whatsapp.replace(/[^\\d]/g, "")}`
                : null,
            label: "WhatsApp",
            icon: FaWhatsapp,
        },
    ].filter((link) => link.href);

    return (
        <footer
            className="mt-16 border-t"
            style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
            }}
            dir={direction}
        >
            <Container width="wide" gutter="lg" paddingY="lg">
                <div className="grid gap-10 lg:grid-cols-[1.35fr_.8fr_.8fr_1.25fr]">
                    <section>
                        <p className="text-2xl font-bold tracking-tight">
                            {appName}
                        </p>
                        <p className="avora-muted mt-4 max-w-sm text-sm leading-7">
                            {translate({
                                ar: "تسوق منتجات مختارة بعناية، مع تجربة بسيطة وآمنة من أول اختيار حتى وصول طلبك.",
                                en: "Shop curated products with a simple, secure experience from selection to delivery.",
                            })}
                        </p>
                        {socialLinks.length > 0 && (
                            <div className="mt-6 flex gap-2">
                                {socialLinks.map(
                                    ({ href, label, icon: Icon }) => (
                                        <a
                                            key={label}
                                            href={href ?? "#"}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label={label}
                                            className="avora-surface-muted avora-border grid h-10 w-10 place-items-center border transition hover:text-[var(--avora-primary)]"
                                        >
                                            <Icon className="h-4 w-4" />
                                        </a>
                                    ),
                                )}
                            </div>
                        )}
                    </section>

                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-[0.16em]">
                            {translate({ ar: "تسوق", en: "SHOP" })}
                        </h2>
                        <nav className="avora-muted mt-5 space-y-3 text-sm">
                            <a
                                href={route("home")}
                                className="block transition hover:text-[var(--avora-primary)]"
                            >
                                {translate({ ar: "الرئيسية", en: "Home" })}
                            </a>
                            <a
                                href="#products"
                                className="block transition hover:text-[var(--avora-primary)]"
                            >
                                {translate({ ar: "المنتجات", en: "Products" })}
                            </a>
                            <a
                                href={route("brands.index")}
                                className="block transition hover:text-[var(--avora-primary)]"
                            >
                                {translate({ ar: "البراندات", en: "Brands" })}
                            </a>
                            <a
                                href={route("shopping.index")}
                                className="block transition hover:text-[var(--avora-primary)]"
                            >
                                {translate({
                                    ar: "مزايا التسوق",
                                    en: "Shopping benefits",
                                })}
                            </a>
                        </nav>
                    </section>

                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-[0.16em]">
                            {translate({
                                ar: "خدمة العملاء",
                                en: "CUSTOMER CARE",
                            })}
                        </h2>
                        <div className="avora-muted mt-5 space-y-3 text-sm">
                            <a
                                href={route("favorites.index")}
                                className="flex items-center gap-2 transition hover:text-[var(--avora-primary)]"
                            >
                                <LuHeart className="h-4 w-4" />
                                {translate({ ar: "المفضلة", en: "Favorites" })}
                            </a>
                            {settings.contact_email && (
                                <a
                                    href={`mailto:${settings.contact_email}`}
                                    className="flex items-center gap-2 transition hover:text-[var(--avora-primary)]"
                                >
                                    <LuMail className="h-4 w-4" />
                                    {settings.contact_email}
                                </a>
                            )}
                            {settings.phone && (
                                <a
                                    href={`tel:${settings.phone}`}
                                    className="flex items-center gap-2 transition hover:text-[var(--avora-primary)]"
                                >
                                    <LuPhone className="h-4 w-4" />
                                    {settings.phone}
                                </a>
                            )}
                            <a
                                href={route("shopping.index")}
                                className="flex items-center gap-2 transition hover:text-[var(--avora-primary)]"
                            >
                                <LuMapPin className="h-4 w-4" />
                                {translate({
                                    ar: "الشحن والإرجاع",
                                    en: "Shipping & returns",
                                })}
                            </a>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-[0.16em]">
                            {translate({
                                ar: "ابقَ على اطلاع",
                                en: "STAY IN THE LOOP",
                            })}
                        </h2>
                        <p className="avora-muted mt-5 text-sm leading-6">
                            {translate({
                                ar: "اشترك لتصلك أحدث المنتجات والعروض المختارة.",
                                en: "Subscribe for new arrivals and selected offers.",
                            })}
                        </p>
                        <form
                            className="mt-5 flex"
                            onSubmit={(event) => event.preventDefault()}
                        >
                            <input
                                type="email"
                                required
                                placeholder={translate({
                                    ar: "بريدك الإلكتروني",
                                    en: "Your email address",
                                })}
                                className="avora-surface avora-border min-w-0 flex-1 border-0 border-b px-0 py-3 text-sm outline-none focus:border-[var(--avora-primary)]"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                rounded="no"
                                aria-label={translate({
                                    ar: "اشتراك",
                                    en: "Subscribe",
                                })}
                            >
                                <LuSend className="h-4 w-4" />
                            </Button>
                        </form>
                    </section>
                </div>

                <div
                    className="avora-muted mt-12 flex flex-wrap items-center justify-between gap-3 border-t pt-5 text-xs"
                    style={{ borderColor: colors.border }}
                >
                    <p>
                        © {currentYear} {appName}.{" "}
                        {translate({
                            ar: "جميع الحقوق محفوظة.",
                            en: "All rights reserved.",
                        })}
                    </p>
                    <a
                        href="#top"
                        className="inline-flex items-center gap-1 transition hover:text-[var(--avora-primary)]"
                    >
                        {translate({ ar: "العودة للأعلى", en: "Back to top" })}
                        <LuArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                </div>
            </Container>
        </footer>
    );
}
