import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

const host = process.env.NEXT_PUBLIC_HOST;

export function useDepartments() {
    return useQuery({
        queryKey: ["departments"],
        queryFn: async () => {
            const token = Cookies.get("token");
            if (!token) throw new Error("No authentication token found");

            const res = await fetch(`${host}/departments`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || "Failed to fetch departments");
            }

            const json = await res.json();

            // ✅ Extract from nested `data.data`
            const departments = json?.data?.data || [];

            // ✅ Transform for react-select
            return departments.map((d) => ({
                value: d.id,
                label: d.name,
            }));
        },
    });
}
