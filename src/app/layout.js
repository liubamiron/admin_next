"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeModeScript, ThemeProvider } from "flowbite-react";
import { DashboardNavbar } from "@/components/dashboard/navbar";
import {usePathname, useRouter} from "next/navigation";
import { SidebarProvider, useSidebarContext } from "@/contexts/sidebar-context";
import { SimpleSidebar } from "@/components/dashboard/simpleSidebar";
import {customTheme} from "@/theme/customTheme";
import "./globals.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {useEffect} from "react";
import {useSessionTimer} from "@/hooks/useSessionTimer";
import Cookies from "js-cookie";


const queryClient = new QueryClient();

function LayoutContent({ children, isLogin }) {
    const { isCollapsed, collapsedWidth } = useSidebarContext();
    const openWidth = 288;
    const currentWidth = isCollapsed ? collapsedWidth : openWidth;

    return (
        <>
            {!isLogin && <DashboardNavbar />}

            <div className={'pt-14'}>
                {!isLogin && <SimpleSidebar />}

                <div
                    className="flex-1 transition-all duration-300 md:ml-[var(--sidebar-width)] dark:bg-black"
                    style={
                        {
                            '--sidebar-width': `${currentWidth}px`,
                        }
                    }
                >
                    {children}
                </div>

            </div>
        </>
    );
}

// 🔒 Session protection layout
function ProtectedLayout({ children }) {
    const expired = useSessionTimer(7);
    const router = useRouter();

    useEffect(() => {
        if (expired) {
            alert("Your session has expired. Please log in again.");
            localStorage.removeItem("loginTime");
            localStorage.removeItem("user");
            // Remove token cookie
            Cookies.remove("token"); // <-- important!
            router.push("/login");
        }
    }, [expired, router]);

    return <>{children}</>;
}



export default function RootLayout({ children }) {
    const pathname = usePathname();
    const isLogin = pathname.startsWith("/login");

    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            <title>Admin Page</title>
            <ThemeModeScript />
        </head>
        <body >
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={customTheme} >
                <SidebarProvider>
                    {isLogin ? (
                        <LayoutContent isLogin>{children}</LayoutContent>
                    ) : (
                        <ProtectedLayout>
                            <LayoutContent>{children}</LayoutContent>
                        </ProtectedLayout>
                    )}
                    {/*<LayoutContent isLogin={isLogin}>{children}</LayoutContent>*/}
                </SidebarProvider>
            </ThemeProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        </body>
        </html>
    );
}
