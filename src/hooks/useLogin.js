"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import {useAuthStore} from "@/store/useAuthStore";

const host = process.env.NEXT_PUBLIC_HOST;

export function useLogin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const setFlags = useAuthStore((s) => s.setFlags);


    async function login({ email, password }) {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${host}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.message || "Login failed");


            const user = result.data;
            const token = result.token || "";

            Cookies.set("token", token, { expires: 7, sameSite: "strict" });

            setFlags(user.permissions);

            if (typeof window !== "undefined") {
                localStorage.setItem("user", JSON.stringify(user));
            }

            return { token, user };
         } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        throw err;
    }
    }

    return { login, loading, error };
}
