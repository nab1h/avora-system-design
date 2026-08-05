import type { ReactNode } from "react";
import { Card, CardTitle } from "@/avora-dash/components/Card";
import { Container } from "@/avora-dash/components/Container";
import { Grid } from "@/avora-dash/components/Grid";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";
import { useTheme } from "@/avora-dash/providers/ThemeProvider";

export interface SidebarLayoutIncludeProps {
    children: ReactNode;
}

// Page layout with a responsive sidebar and main content area.
export function SidebarLayoutInclude({ children }: SidebarLayoutIncludeProps) {
    const { translate } = useLanguage();
    const { colors } = useTheme();

    // Replace these items with your real filters or navigation links.
    const sidebarItems = [
        translate({ ar: "نظرة عامة", en: "Overview" }),
        translate({ ar: "الطلبات", en: "Orders" }),
        translate({ ar: "العملاء", en: "Customers" }),
        translate({ ar: "الإعدادات", en: "Settings" }),
    ];

    return (
        <Container as="main" width="wide" gutter="md" paddingY="lg">
            {/* Use sidebarEnd to move the sidebar to the other side. */}
            <Grid
                layout="sidebarStart"
                gap="lg"
                padding="lg"
                background="muted"
                rounded="none"
                align="start"
            >
                <Card padding="md">
                    <CardTitle>
                        {translate({ ar: "القائمة", en: "Menu" })}
                    </CardTitle>

                    <nav className="mt-4 space-y-2">
                        {sidebarItems.map((item, index) => (
                            <a
                                key={item}
                                href="#"
                                className="block rounded-lg px-3 py-2 text-sm"
                                style={{
                                    color:
                                        index === 0
                                            ? colors.primary
                                            : colors.text,
                                    backgroundColor:
                                        index === 0
                                            ? `${colors.primary}14`
                                            : "transparent",
                                }}
                            >
                                {item}
                            </a>
                        ))}
                    </nav>
                </Card>

                {/* Your page content is rendered here. */}
                <div className="min-w-0">{children}</div>
            </Grid>
        </Container>
    );
}
