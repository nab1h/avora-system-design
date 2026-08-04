import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { LanguageProvider } from "./avora-dash/providers/LanguageProvider";
import { ThemeProvider } from "./avora-dash/providers/ThemeProvider";

const appName = document.documentElement.dataset.appName || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob("./Pages/**/*.tsx"),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <LanguageProvider>
                <ThemeProvider>
                    <App {...props} />
                </ThemeProvider>
            </LanguageProvider>,
        );
    },
    progress: {
        color: "#4B5563",
    },
});
