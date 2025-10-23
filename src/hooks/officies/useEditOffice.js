import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

const host = process.env.NEXT_PUBLIC_HOST || "https://hrm.webng.life/api";

export function useEditOffice() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, name, location }) => {
            const token = Cookies.get("token");
            if (!token) throw new Error("No authentication token found");

            const res = await fetch(`${host}/office/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, location }),
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message || "Failed to update office");

            return data;
        },
        onSuccess: () => {
            // Refresh the office list after update
            queryClient.invalidateQueries(["offices"]);
        },
    });
}
