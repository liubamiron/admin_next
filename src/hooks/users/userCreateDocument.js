import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

const host = process.env.NEXT_PUBLIC_HOST || "https://hrm.webng.life/api";

export function useCreateDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formDataDoc, id) => {
            const token = Cookies.get("token");
            if (!token) throw new Error("No authentication token found");

            const res = await fetch(`${host}/user-document/${id}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formDataDoc,
                credentials: 'include',
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(data.message || "Failed to create user document");
            }

            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-document"] });
        },
    });
}
