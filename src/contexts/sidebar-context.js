"use client";

import { createContext, useContext, useState } from "react";

const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
    const [desktopCollapsed, setDesktopCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Width of the collapsed sidebar (px)
    const collapsedWidth = 72; // ≈ 4.5rem

    return (
        <SidebarContext.Provider
            value={{
                desktop: {
                    collapsed: desktopCollapsed,
                    toggle: () => setDesktopCollapsed(prev => !prev),
                    set: setDesktopCollapsed,
                },
                mobile: {
                    isOpen: mobileOpen,
                    toggle: () => setMobileOpen(prev => !prev),
                    open: () => setMobileOpen(true),
                    close: () => setMobileOpen(false),
                },
                // 👉 Normalized values for easy consumption
                isCollapsed: desktopCollapsed,
                collapsedWidth,
            }}
        >
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebarContext() {
    const context = useContext(SidebarContext);
    if (!context) throw new Error("useSidebarContext must be used with SidebarProvider");
    return context;
}
