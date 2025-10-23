import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

const host = process.env.NEXT_PUBLIC_HOST || "https://hrm.webng.life/api";

/**
 * ✅ Create new office
 * POST /office
 * Body: { name: string, location: string }
 */
export function useCreateOffice() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ name, location }) => {
            const token = Cookies.get("token");
            if (!token) throw new Error("No authentication token found");

            const res = await fetch(`${host}/office`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, location }),
                credentials: 'include',
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message || "Failed to create office");

            return data;
        },
        onSuccess: () => {
            // Refresh the office list after successful creation
            queryClient.invalidateQueries(["offices"]);
        },
    });
}