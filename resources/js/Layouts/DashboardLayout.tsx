import { useState, type ReactNode } from "react";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";
import { DashboardHeader } from "@/avora-dash/components/navigation/DashboardHeader";
import { DashboardSidebar } from "@/avora-dash/components/navigation/DashboardSidebar";

export function DashboardLayout({ children }: { children: ReactNode }) {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
    const { direction } = useLanguage();

    return (
        <div className="avora-dashboard min-h-screen">
            <DashboardSidebar
                open={mobileSidebarOpen}
                desktopOpen={desktopSidebarOpen}
                onClose={() => setMobileSidebarOpen(false)}
            />
            <div
                className={`transition-[margin] duration-300 ${
                    desktopSidebarOpen
                        ? direction === "rtl"
                            ? "lg:mr-72"
                            : "lg:ml-72"
                        : ""
                }`}
            >
                <DashboardHeader
                    desktopSidebarOpen={desktopSidebarOpen}
                    onMenuClick={() => setMobileSidebarOpen(true)}
                    onDesktopMenuClick={() =>
                        setDesktopSidebarOpen((open) => !open)
                    }
                />
                <main className="mx-auto max-w-screen-2xl p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
