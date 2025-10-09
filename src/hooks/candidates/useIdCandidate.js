import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

export function useIdCandidate(candidateId) {
    return useQuery({
        queryKey: ["candidate", candidateId],
        queryFn: async () => {
            const token = Cookies.get("token");
            if (!token) throw new Error("No authentication token found");

            const res = await fetch(`https://hrm.webng.life/api/candidates/${candidateId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || "Failed to fetch candidate");
            }

            const json = await res.json();
            return json.data;
        },
        enabled: !!candidateId, // only fetch if ID exists
    });
}
