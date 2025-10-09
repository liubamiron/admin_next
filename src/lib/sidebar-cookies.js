import Cookies from "js-cookie";

const NAME = "sidebar-collapsed";

export const sidebarCookie = {
    get() {
        const value = Cookies.get(NAME) === "true";
        return { isCollapsed: value };
    },
    set(value) {
        Cookies.set(NAME, String(value.isCollapsed), { path: "/" });
    },
};
