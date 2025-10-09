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
import {HiBell, HiLogout, HiMenuAlt2} from "react-icons/hi";
import {useLogout} from "@/hooks/useLogout";
import {useSidebarContext} from "@/contexts/sidebar-context";



export function DashboardNavbar() {

    const {logout} = useLogout();
    const sidebar = useSidebarContext();

    function handleToggleSidebar() {
        const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

        if (isDesktop) {
            sidebar.desktop.toggle();
        } else {
            sidebar.mobile.toggle();
        }
    }

    return (
        <Navbar
            fluid
            className="fixed top-0 z-30 w-full border-b border-gray-200 bg-white  dark:border-gray-700 dark:bg-gray-800"
        >
            <div className="pl-4 pr-4 flex w-full items-center justify-between">
                {/* Left side: logo */}
                <div className="flex items-center gap-4 ">
                    <NavbarBrand as={Link} href="/" className="flex items-center">
                        {/* Light mode logo */}
                        <img
                            src="/images/logo_group_light.svg"
                            alt="Logo"
                            className="mr-2 w-auto h-8 dark:hidden"
                        />
                        {/* Dark mode logo */}
                        <img
                            src="/images/logo_group_dark.svg"
                            alt="Logo"
                            className="mr-2 w-auto h-8 hidden dark:block"
                        />
                    </NavbarBrand>

                    <button
                        onClick={handleToggleSidebar}
                        className="rounded p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                        <HiMenuAlt2 className="h-6 w-6" />
                        <span className="sr-only">Toggle sidebar</span>
                    </button>
                </div>
                {/* Right side: bell + dark toggle */}
                <div className="flex items-center gap-4 ">
                    <form className="relative max-w-xs md:block hidden">
                        <label htmlFor="countries" className="sr-only">Choose a country</label>
                        <select
                            id="countries"
                            defaultValue=""
                            className="
      block w-full rounded-lg border border-gray-300 bg-gray-50
      px-3 py-2 text-sm text-gray-900
      focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50
      dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400
      dark:focus:border-blue-500 dark:focus:ring-blue-500
    "
                        >
                            <option value="" disabled>Choose a country</option>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="FR">France</option>
                            <option value="DE">Germany</option>
                        </select>
                    </form>

                    <DarkThemeToggle/>
                    <Dropdown
                        inline
                        arrowIcon={false}
                        label={
                            <span
                                className="rounded p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                                <HiBell className="h-6 w-6"/>
                                <span className="sr-only">Notifications</span>
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
                                <span className="sr-only">User menu</span>
                                <Avatar alt="" img="/images/neil-sims.png" rounded size="sm"/>
                            </span>
                        }
                    >
                        <DropdownHeader className="px-4 py-3">
                            <span className="block text-sm dark:text-gray-400 dark:hover:bg-gray-700">
                                Neil Sims
                            </span>
                            <br/>
                            <span className="block truncate text-sm font-medium">
                                neil.sims@flowbite.com
                            </span>
                        </DropdownHeader>

                        <DropdownDivider/>

                        <DropdownItem
                            onClick={logout}
                            className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                            <HiLogout className="h-5 w-5"/>
                            <span>Sign out</span>
                        </DropdownItem>
                    </Dropdown>


                </div>
            </div>
        </Navbar>
    );
}
