import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

const host = process.env.NEXT_PUBLIC_HOST || "https://hrm.webng.life/api";

export function useCandidates(page = 1) {
    return useQuery({
        queryKey: ["candidates", page],
        queryFn: async () => {
            const token = Cookies.get("token");
            if (!token) throw new Error("No authentication token found");

            const res = await fetch(`${host}/candidates?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || "Failed to fetch candidates");
            }

            const json = await res.json();
            return json.data;
        },
        keepPreviousData: true,
    });
}
