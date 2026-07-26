import { Button } from "@/avora-dash/components/Button";
import { LanguageButton } from "@/avora-dash/components/LanguageButton";
import {
    Navbar,
    NavbarActions,
    NavbarBrand,
    NavbarContainer,
    NavbarLink,
    NavbarLinks,
    NavbarLogo,
    NavbarMobileMenu,
    NavbarToggle,
} from "@/avora-dash/components/Navbar";
import { useAppName } from "@/avora-dash/hooks/useAppName";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";
import ModeButton from "@/avora-dash/providers/ModeButton";
import { Link } from "@inertiajs/react";
import { type ReactNode } from "react";
import { LuShoppingCart } from "react-icons/lu";

export function StoreLayout({ children }: { children: ReactNode }) {
    const { translate, direction } = useLanguage();
    const appName = useAppName();
    const links = [
        { href: route("home"), label: translate({ ar: "الرئيسية", en: "Home" }) },
        { href: `${route("home")}#prodcts`, label: translate({ ar: "المنتجات", en: "Products" }) },
    ];

    return <>
        <Navbar position="sticky" background="surface">
            <NavbarContainer width="full" className="min-h-24 my-10 grid grid-cols-[2.5rem_1fr_2.5rem] md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]" dir="ltr">
                <NavbarBrand className="col-start-2 row-start-1 justify-self-center md:col-start-2" dir={direction}>
                    <NavbarLogo href={route("home")} alt={translate({ ar: `شعار ${appName}`, en: `${appName} logo` })} imageClassName="h-10" />
                </NavbarBrand>
                <NavbarLinks className="row-start-2 hidden md:flex col-start-2 justify-self-center" dir={direction}>{links.map((link) => <NavbarLink key={link.href} href={link.href}>{link.label}</NavbarLink>)}</NavbarLinks>
                <NavbarActions className="hidden md:flex md:col-start-3 md:justify-self-end" dir={direction}>
                    <Link href={route("home")} aria-label={translate({ ar: "عربة التسوق", en: "Cart" })}><Button size="icon" variant="ghost" rounded="full"><LuShoppingCart className="h-5 w-5" /></Button></Link><ModeButton /><LanguageButton />
                </NavbarActions>
                <NavbarToggle className="col-start-1 row-start-1 justify-self-start" />
            </NavbarContainer>
            <NavbarMobileMenu placement="right" motion="slide" duration="slow"><NavbarLinks className="flex-col items-stretch">{links.map((link) => <NavbarLink key={link.href} href={link.href}>{link.label}</NavbarLink>)}</NavbarLinks><NavbarActions className="mt-4 justify-center border-t border-slate-200 pt-4 dark:border-slate-700"><ModeButton /><LanguageButton /></NavbarActions></NavbarMobileMenu>
        </Navbar>
        {children}
    </>;
}
