import {useQuery} from "@tanstack/react-query";
import Cookies from "js-cookie";

const host = process.env.NEXT_PUBLIC_HOST || "https://hrm.webng.life/api";

export function usePublicHolidays() {
    return useQuery({
        queryKey: ["positions"],
        queryFn: async () => {
            const token = Cookies.get("token");
            if (!token) throw new Error("No authentication token found");

            const res = await fetch(`${host}/public-holidays`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || "Failed to fetch positions");
            }

            const json = await res.json();

            // ✅ Extract from nested pagination object
            return json?.data || [];

        },
    });
}
