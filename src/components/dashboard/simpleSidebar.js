"use client";
/* eslint-disable @next/next/no-img-element */

import {useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {HiChevronDown, HiChevronUp} from "react-icons/hi";

import {useSidebarContext} from "@/contexts/sidebar-context";
import {useEmployees} from "@/hooks/users/useEmployees";
import {useTranslation} from "@/providers";
import dynamic from "next/dynamic";
import {reactSelectHeightFix} from "@/components/ui/reactSelectHeightFix";
import {useDarkMode} from "@/hooks/useDarkMode";

export function SimpleSidebar() {
    const sidebar = useSidebarContext();
    const pathname = usePathname();
    const [isUsersOpen, setUsersOpen] = useState(false);
    const {t, language, setLanguage, langOptions} = useTranslation();
    const options = langOptions.map(lang => ({value: lang.value, label: lang.label}));
    const {data} = useEmployees();
    const Select = dynamic(() => import("react-select"), {ssr: false});
    const isDark = useDarkMode();

    const totalEmployees = data?.total || 0;

    const menuItems = [
        {
            icon: <img src="/icons/my_profile.svg" alt="my_profile"/>, // decorative
            label: t('My_Profile'),
            href: "/profile",
        },
        {
            icon: <img src="/icons/structure.svg" alt="structure"/>,
            label: t('Structure'),
            href: "/structure/offices",
        },
        {
            icon: <img src="/icons/users.svg" alt="users"/>,
            label: t("Users"),
            submenu: [
                {
                    id: "1",
                    icon: <img src="/icons/employees.svg" alt="employees"/>,
                    label: t("Employees"),
                    href: "/users/employees",
                    count: totalEmployees,
                },
            ],
        },
        {
            icon: <img src="/icons/candidates.svg" alt="candidates"/>,
            label: t("Candidates"),
            href: "/candidates",
            count: "1",
        },
        {
            icon: <img src="/icons/interview_calendar.svg" alt="interview"/>,
            label: t("Interview_Calendar"),
            href: "/interview-calendar",
            count: "3",
        },
        {
            icon: <img src="/icons/shifts_calendar.svg" alt="shifts"/>,
            label: t("Shifts_Calendar"),
            href: "/shifts-calendar",
        },
        {
            icon: <img src="/icons/org_chart.svg" alt="org_chart"/>,
            label: t("Org_Chart"),
            href: "/orgchart",
        },
    ];

    return (
        <>
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
          fixed top-16 left-0 inset-y-0 z-30  bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          w-72 md:translate-x-0
          ${sidebar.desktop.collapsed ? "md:w-16" : "md:w-72"}
          transition-all duration-300
          ${sidebar.mobile.isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
            >
                <div className="px-3 py-5 flex flex-col h-full">
                    {sidebar.desktop.collapsed && (
                        <Link href="/">
                            <img
                                src="/images/logo_sidebar.png"
                                alt="Company Logo"
                                className="w-10 h-auto mb-2"
                            />
                        </Link>
                    )}

                    <ul className="text-center">
                        {menuItems.map((item) => {
                            const hasSubmenu = !!item.submenu;
                            const isActiveMain = !hasSubmenu && pathname === item.href;

                            // Show submenu if open or active
                            const showSubmenu =
                                hasSubmenu &&
                                (isUsersOpen || item.submenu.some((sub) => sub.href === pathname)) &&
                                (!sidebar.desktop.collapsed || sidebar.mobile.isOpen);

                            return (
                                <li key={item.label} className="p-1 dark:text-gray-300">
                                    {/* Main Item */}
                                    {!hasSubmenu ? (
                                        <Link
                                            href={item.href}
                                            className={`
                        flex items-center gap-3 p-1 rounded cursor-pointer
                        ${isActiveMain ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" : "hover:bg-[#EBF5FF] dark:hover:bg-gray-700"}
                      `}
                                        >
                                            <div
                                                className="flex-shrink-0 w-6 h-6 flex items-center justify-center">{item.icon}</div>
                                            <span
                                                className={`transition-all duration-300 overflow-hidden 
      ${sidebar.desktop.collapsed && !sidebar.mobile.isOpen
                                                    ? "max-w-0 opacity-0 whitespace-nowrap"
                                                    : "max-w-full opacity-100 whitespace-normal break-words text-left"
                                                }
  `}
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
                                                    className={`transition-all duration-300 overflow-hidden
      ${sidebar.desktop.collapsed && !sidebar.mobile.isOpen
                                                        ? "max-w-0 opacity-0 whitespace-nowrap"
                                                        : "max-w-full opacity-100 whitespace-normal break-words text-left"
                                                    }
  `}
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
                    <div className="mt-auto px-3 pb-5 w-full md:w-1/2">
                        <Select
                            value={options.find(opt => opt.value === language)}
                            onChange={(opt) => setLanguage(opt.value)}
                            options={options}
                            styles={reactSelectHeightFix}
                            isSearchable={false}
                            menuPlacement="top"
                            isDark={isDark}
                            className={`${sidebar.desktop.collapsed ? "hidden" : "block"}`}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
