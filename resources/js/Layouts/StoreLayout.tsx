import { StoreDrawer } from "@/components/StoreDrawer";
import { StoreNavbar } from "@/components/StoreNavbar";
import { StoreFooter } from "@/components/StoreFooter";
import type { CartProduct } from "@/types";
import type { PageProps } from "@/types";
import { usePage } from "@inertiajs/react";
import { useState, type ReactNode } from "react";

interface StoreLayoutProps {
    children: ReactNode;
    cartProducts?: CartProduct[];
}

export function StoreLayout({ children, cartProducts = [] }: StoreLayoutProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pageCartProducts =
        usePage<PageProps<{ cartProducts?: CartProduct[] }>>().props
            .cartProducts;
    const resolvedCartProducts = cartProducts.length
        ? cartProducts
        : (pageCartProducts ?? []);

    return (
        <>
            <StoreNavbar setIsOpen={setIsOpen} />

            <main>{children}</main>

            <StoreFooter />

            <StoreDrawer
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                cartProducts={resolvedCartProducts}
            />
        </>
    );
}
