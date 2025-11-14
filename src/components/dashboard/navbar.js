"use client";
/* eslint-disable @next/next/no-img-element */

import {Navbar, NavbarBrand, DarkThemeToggle, Dropdown} from "flowbite-react";
import Link from "next/link";
import {
    Avatar,
    DropdownDivider,
    DropdownHeader,
    DropdownItem,
} from "flowbite-react";
import { HiBell, HiLogout, HiMenuAlt2 } from "react-icons/hi";
import { useLogout } from "@/hooks/useLogout";
import { useSidebarContext } from "@/contexts/sidebar-context";
import {useTranslation} from "@/providers";
import dynamic from "next/dynamic";
import {reactSelectHeightFix} from "@/components/ui/reactSelectHeightFix";
import {useDarkMode} from "@/hooks/useDarkMode";
const Select = dynamic(() => import("react-select"), {ssr: false});


export function DashboardNavbar() {
    const { logout } = useLogout();
    const sidebar = useSidebarContext();

    const { language, setLanguage, langOptions } = useTranslation();
    const isDark = useDarkMode();

    function handleToggleSidebar() {
        const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
        if (isDesktop) sidebar.desktop.toggle();
        else sidebar.mobile.toggle();
    }

    const isSidebarCollapsed = sidebar.desktop.collapsed;
    const options = langOptions.map(lang => ({ value: lang.value, label: lang.label }));

    return (
        <Navbar
            fluid
            className="fixed top-0 z-30 w-full border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
        >
            <div className="pr-4 flex w-full items-center justify-between">
                {/* Left side: logo */}
                <div className="flex items-center gap-4">
                    {!isSidebarCollapsed && (
                        <NavbarBrand as={Link} href="/" className="flex items-center">
                            <img
                                src="/images/logo_group_light.svg"
                                alt="Logo"
                                className="mr-2 w-auto h-8 dark:hidden"
                            />
                            <img
                                src="/images/logo_group_dark.svg"
                                alt="Logo"
                                className="mr-2 w-auto h-8 hidden dark:block"
                            />
                        </NavbarBrand>
                    )}

                    <button
                        onClick={handleToggleSidebar}
                        className="rounded p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                        <HiMenuAlt2 className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <Select
                        value={options.find(opt => opt.value === language)}
                        onChange={(opt) => setLanguage(opt.value)}
                        options={options}
                        styles={reactSelectHeightFix}
                        isSearchable={false}
                        menuPlacement="auto"
                        isDark={isDark}
                    />
                    <DarkThemeToggle />
                    <Dropdown
                        inline
                        arrowIcon={false}
                        label={
                            <span className="rounded p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                                <HiBell className="h-6 w-6" />
                            </span>
                        }
                    >
                        <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-400">
                            No new notifications
                        </div>
                    </Dropdown>

                    <Dropdown
                        className="rounded"
                        arrowIcon={false}
                        inline
                        label={
                            <span>
                                <Avatar
                                    alt=""
                                    img="/images/neil-sims.png"
                                    rounded
                                    size="sm"
                                    className="w-[40px] rounded-full"
                                />
                            </span>
                        }
                    >
                        <DropdownHeader className="px-4 py-3">
                            <span className="block text-sm dark:text-gray-400">Neil Sims</span>
                            <span className="block truncate text-sm font-medium">
                                neil.sims@flowbite.com
                            </span>
                        </DropdownHeader>

                        <DropdownDivider />

                        <DropdownItem
                            onClick={logout}
                            className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                            <HiLogout className="h-5 w-5" />
                            <span>Sign out</span>
                        </DropdownItem>
                    </Dropdown>
                </div>
            </div>
        </Navbar>
    );
}
