import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

const host = process.env.NEXT_PUBLIC_HOST;

export function useOffices() {
    return useQuery({
        queryKey: ["offices"],
        queryFn: async () => {
            const token = Cookies.get("token");
            if (!token) throw new Error("No authentication token found");

            const res = await fetch(`https://hrm.webng.life/api/offices`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || "Failed to fetch offices");
            }

            const json = await res.json();

            // ✅ Extract actual data
            const offices = json?.data?.data || [];

            // ✅ Transform for react-select
            return offices.map((o) => ({
                value: o.id,
                label: o.name,
            }));
        },
    });
}
