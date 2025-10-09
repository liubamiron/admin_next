import { HiChartPie, HiViewGrid, HiShoppingBag, HiUsers, HiDocumentReport, HiLockClosed } from "react-icons/hi";

export const sidebarPages = [
    { href: "/", icon: HiChartPie, label: "Dashboard" },
    { href: "/kanban", icon: HiViewGrid, label: "Kanban" },
    {
        icon: HiShoppingBag,
        label: "E-commerce",
        items: [
            { href: "/e-commerce/products", label: "Products" },
            { href: "/e-commerce/billing", label: "Billing" },
            { href: "/e-commerce/invoice", label: "Invoice" },
        ],
    },
    {
        icon: HiUsers,
        label: "Users",
        items: [
            { href: "/users/list", label: "Users list" },
            { href: "/users/profile", label: "Profile" },
            { href: "/users/feed", label: "Feed" },
            { href: "/users/settings", label: "Settings" },
        ],
    },
    {
        icon: HiDocumentReport,
        label: "Pages",
        items: [
            { href: "/pages/pricing", label: "Pricing" },
            { href: "/pages/maintenance", label: "Maintenance" },
            { href: "/pages/404", label: "404 not found" },
            { href: "/pages/500", label: "500 server error" },
        ],
    },
    {
        icon: HiLockClosed,
        label: "Authentication",
        items: [
            { href: "/authentication/sign-in", label: "Sign in" },
            { href: "/authentication/sign-up", label: "Sign up" },
            { href: "/authentication/forgot-password", label: "Forgot password" },
            { href: "/authentication/reset-password", label: "Reset password" },
            { href: "/authentication/profile-lock", label: "Profile lock" },
        ],
    },
];
