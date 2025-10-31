import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

const host = process.env.NEXT_PUBLIC_HOST || "https://hrm.webng.life/api";

export function useCreateUserNote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userNoteData) => {
            const token = Cookies.get("token");
            if (!token) throw new Error("No authentication token found");

            const res = await fetch(`${host}/user-note`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(userNoteData),
                credentials: "include",
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(data.message || "Failed to create user note");
            }

            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-note"] });
        },
    });
}
