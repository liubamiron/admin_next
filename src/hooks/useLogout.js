"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export function useLogout() {
    const router = useRouter();

    function logout() {
        Cookies.remove("token");

        if (typeof window !== "undefined") {
            localStorage.removeItem("user");
        }

        router.push("/login");
    }

    return { logout };
}
