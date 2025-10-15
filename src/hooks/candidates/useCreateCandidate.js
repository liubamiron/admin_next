import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

const host = process.env.NEXT_PUBLIC_HOST || "https://hrm.webng.life/api";

// Mutation hook for creating candidate
export function useCreateCandidate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData) => {
            const token = Cookies.get("token");
            if (!token) throw new Error("No authentication token found");

            const res = await fetch(`${host}/candidate`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
                credentials: 'include',
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
