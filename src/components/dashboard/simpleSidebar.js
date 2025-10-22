"use client";
/* eslint-disable @next/next/no-img-element */

import {useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {HiChevronDown, HiChevronUp} from "react-icons/hi";

import {useSidebarContext} from "@/contexts/sidebar-context";
import {useEmployees} from "@/hooks/useEmployees";

export function SimpleSidebar() {
    const sidebar = useSidebarContext();
    const pathname = usePathname();
    const [isUsersOpen, setUsersOpen] = useState(false);

    const {data} = useEmployees(); // например, первая страница
    const totalEmployees = data?.total || 0;


    const menuItems = [
        {

            icon: <img src="/icons/my_profile.svg" alt="My Profile"/>,
            label: "My Profile",
            href: "/profile",
        },
        {
            icon: <img src="/icons/structure.svg" alt="Structure"/>,
            label: "Structure",
            href: "/structure/offices",
        },
        {
            icon: <img src="/icons/users.svg" alt="Users"/>,
            label: "Users",
            submenu: [
                {
                    id: "1",
                    icon: <img src="/icons/employees.svg" alt="Employees"/>,
                    label: "Employees",
                    href: "/users/employees",
                    count: totalEmployees,
                },
            ],
        },
        {
            icon: <img src="/icons/candidates.svg" alt="Candidates"/>,
            label: "Candidates",
            href: "/candidates",
            count: "1",
        },
        {
            icon: <img src="/icons/interview_calendar.svg" alt="Interview Calendar"/>,
            label: "Interview Calendar",
            href: "/interview-calendar",
            count: "3",
        },
        {
            icon: <img src="/icons/shifts_calendar.svg" alt="Shifts Calendar"/>,
            label: "Shifts Calendar",
            href: "/shifts-calendar",
        },
        {
            icon: <img src="/icons/org_chart.svg" alt="Org Chart"/>,
            label: "Org Chart",
            href: "/orgchart",
        },
    ];


    return (
        <>
            {/* Mobile overlay */}
            {sidebar.mobile.isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-20 md:hidden"
                    onClick={sidebar.mobile.close}
                />
            )}

            {/* Sidebar */}
            <div
                style={{"--sidebar-width": sidebar.desktop.collapsed ? "4rem" : "18rem"}}
                className={`
          fixed top-16 left-0 inset-y-0 z-30 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          w-72 md:translate-x-0
          ${sidebar.desktop.collapsed ? "md:w-16" : "md:w-72"}
          transition-all duration-300
          ${sidebar.mobile.isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
            >
                <div className="mx-4 my-3">
                    <div className="w-[55px]">
                        {sidebar.desktop.collapsed && (
                            <Link href={'/'}>
                                <img
                                    src="/images/logo_sidebar.png"
                                    alt="Sidebar Logo"
                                    className="w-10 h-auto mb-2"
                                />
                            </Link>
                        )}
                    </div>
                    <ul>
                        {menuItems.map((item) => {
                            const hasSubmenu = !!item.submenu;
                            const isActiveMain = !hasSubmenu && pathname === item.href;

                            // Show submenu if open or active
                            const showSubmenu =
                                hasSubmenu &&
                                (isUsersOpen || item.submenu.some((sub) => sub.href === pathname)) &&
                                (!sidebar.desktop.collapsed || sidebar.mobile.isOpen);

                            return (
                                <li key={item.label}>
                                    {/* Main Item */}
                                    {!hasSubmenu ? (
                                        <Link
                                            href={item.href}
                                            className={`
                        flex items-center gap-3 p-2 rounded cursor-pointer 
                        ${isActiveMain ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" : "hover:bg-[#EBF5FF] dark:hover:bg-gray-700"}
                      `}
                                        >
                                            <div
                                                className="flex-shrink-0 w-6 h-6 flex items-center justify-center">{item.icon}</div>
                                            <span
                                                className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
                                                    sidebar.desktop.collapsed && !sidebar.mobile.isOpen ? "max-w-0 opacity-0" : "max-w-full opacity-100"
                                                }`}
                                            >
                        {item.label}
                      </span>
                                            {!sidebar.desktop.collapsed && item.count && (
                                                <span
                                                    className="ml-auto inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                          {item.count}
                        </span>
                                            )}
                                        </Link>
                                    ) : (
                                        <>
                                            {/* Dropdown Header */}
                                            <div
                                                className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-[#EBF5FF] dark:hover:bg-gray-700"
                                                onClick={() => setUsersOpen(!isUsersOpen)}
                                            >
                                                <div
                                                    className="flex-shrink-0 w-6 h-6 flex items-center justify-center">{item.icon}</div>
                                                <span
                                                    className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
                                                        sidebar.desktop.collapsed && !sidebar.mobile.isOpen ? "max-w-0 opacity-0" : "max-w-full opacity-100"
                                                    }`}
                                                >
                          {item.label}
                        </span>
                                                {!sidebar.desktop.collapsed && (
                                                    <div className="ml-auto">
                                                        {showSubmenu ? <HiChevronUp size={20}/> :
                                                            <HiChevronDown size={20}/>}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Submenu */}
                                            {showSubmenu && (
                                                <ul className="mt-1 space-y-1">
                                                    {item.submenu.map((subitem) => {
                                                        const isActiveSub = pathname === subitem.href;
                                                        return (
                                                            <li key={subitem.id}>
                                                                <Link
                                                                    href={subitem.href}
                                                                    className={`
                                    flex justify-between items-center w-full p-2 rounded text-sm
                                    ${isActiveSub ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" : "hover:bg-[#EBF5FF] dark:hover:bg-gray-700"}
                                  `}
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <span
                                                                            className="w-6 h-6 flex-shrink-0 flex items-center justify-center">{subitem.icon}</span>
                                                                        <span
                                                                            className="truncate">{subitem.label}</span>
                                                                    </div>
                                                                    {subitem.count && (
                                                                        <span
                                                                            className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                                      {subitem.count}
                                    </span>
                                                                    )}
                                                                </Link>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            )}
                                        </>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </>
    );
}
