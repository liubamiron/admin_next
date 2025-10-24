import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

const host = process.env.NEXT_PUBLIC_HOST || "https://hrm.webng.life/api";

export function useEditDepartment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, name,  office_id, manager_id }) => {
            const token = Cookies.get("token");
            if (!token) throw new Error("No authentication token found");

            const res = await fetch(`${host}/department/${id}`, {
                method: "PATCH",
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, office_id, manager_id}),
                credentials: 'include',
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message || "Failed to update department");

            return data;
        },
        onSuccess: () => {
            // Refresh the office list after update
            queryClient.invalidateQueries(["department"]);
        },
    });
}
