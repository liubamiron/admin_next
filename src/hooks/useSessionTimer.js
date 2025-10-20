"use client";

import { useEffect, useState } from "react";

export function useSessionTimer(maxHours = 7) {
    const [expired, setExpired] = useState(false);

    useEffect(() => {
        const loginTime = localStorage.getItem("loginTime");
        if (!loginTime) return;

        const maxMs = maxHours * 60 * 60 * 1000;
        const diff = Date.now() - Number(loginTime);

        if (diff > maxMs) {
            setExpired(true);
        } else {
            const timeout = setTimeout(() => setExpired(true), maxMs - diff);
            return () => clearTimeout(timeout);
        }
    }, [maxHours]);

    return expired;
}
