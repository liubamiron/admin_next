import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

// Mutation hook for updating a candidate
export function useEditCandidate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ candidateId, candidateData }) => {
            const token = Cookies.get("token");
            if (!token) throw new Error("No authentication token found");

            const res = await fetch(`https://hrm.webng.life/api/candidates/${candidateId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(candidateData), // send JSON
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || "Failed to update candidate");
            }

            return await res.json();
        },
        onSuccess: () => {
            // Refresh candidate list or specific candidate query
            queryClient.invalidateQueries({ queryKey: ["candidate"] });
        },
    });
}
