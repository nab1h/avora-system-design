import { Button } from "@/avora-dash/Components/Button";
import { LanguageButton } from "@/avora-dash/Components/LanguageButton";
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
} from "@/avora-dash/Components/Navbar";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";
import ModeButton from "@/avora-dash/providers/ModeButton";

// Copy this file, then change the links and logo for your project.
export function NavbarInclude() {
    const { translate } = useLanguage();

    // Change these links for every project.
    const links = [
        { href: "#home", ar: "الرئيسية", en: "Home" },
        { href: "#services", ar: "الخدمات", en: "Services" },
        { href: "#products", ar: "المنتجات", en: "Products" },
        { href: "#contact", ar: "تواصل معنا", en: "Contact" },
    ];

    const navigationLinks = links.map((link) => (
        <NavbarLink key={link.href} href={link.href}>
            {translate({ ar: link.ar, en: link.en })}
        </NavbarLink>
    ));

    return (
        <Navbar position="sticky" background="glass" shadow="sm" bordered>
            <NavbarContainer width="wide" height="md">
                <NavbarBrand>
                    {/* Change this image path and alt text. */}
                    <NavbarLogo
                        href="#home"
                        src="/images/avora-logo.svg"
                        alt={translate({
                            ar: "شعار المشروع",
                            en: "Project logo",
                        })}
                        imageClassName="h-10"
                    />
                </NavbarBrand>

                <NavbarDesktop>
                    <NavbarLinks>{navigationLinks}</NavbarLinks>

                    <NavbarActions>
                        <ModeButton />
                        <LanguageButton />
                        {/* Change this button action and text. */}
                        <Button size="sm">
                            {translate({
                                ar: "تسجيل الدخول",
                                en: "Sign in",
                            })}
                        </Button>
                    </NavbarActions>
                </NavbarDesktop>

                {/* Pass menuIcon and closeIcon to use your own icons. */}
                <NavbarToggle />
            </NavbarContainer>

            {/* Change placement to top, left, right, start, or end. */}
            <NavbarMobileMenu placement="end" motion="slide" duration="normal">
                <NavbarLinks className="flex-col items-stretch">
                    {navigationLinks}
                </NavbarLinks>

                <NavbarActions className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
                    <ModeButton />
                    <LanguageButton />
                    <Button size="sm" fullWidth>
                        {translate({ ar: "تسجيل الدخول", en: "Sign in" })}
                    </Button>
                </NavbarActions>
            </NavbarMobileMenu>

            {/* Remove this line if you do not want a dark overlay. */}
            <NavbarOverlay opacity="medium" />
        </Navbar>
    );
}
