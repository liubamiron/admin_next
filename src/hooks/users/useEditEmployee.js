import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

const host = process.env.NEXT_PUBLIC_HOST || "https://hrm.webng.life/api";

export function useEditEmployee() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, formData }) => {
            const token = Cookies.get("token");
            if (!token) throw new Error("No authentication token found");

            const res = await fetch(`${host}/user/${id}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    // Accept: 'application/json',
                },
                body: formData,
                credentials: 'include',
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || "Failed to update employee");
            }

            return await res.json();
        },
        onSuccess: () => {
            // Refresh candidate list or specific candidate query
            queryClient.invalidateQueries({ queryKey: ["employee"] });
        },
    });
}
