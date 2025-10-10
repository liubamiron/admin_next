import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

const host = process.env.NEXT_PUBLIC_HOST;

// Mutation hook for creating candidate
export function useCreateCandidate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (candidateData) => {
            const token = Cookies.get("token");
            if (!token) throw new Error("No authentication token found");

            const res = await fetch(`https://hrm.webng.life/api/candidate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(candidateData), // send JSON
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || "Failed to create candidate");
            }

            return await res.json();
        },
        onSuccess: () => {
            // Refresh candidates list
            queryClient.invalidateQueries({ queryKey: ["candidate"] });
        },
    });
}
