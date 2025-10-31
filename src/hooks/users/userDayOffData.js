import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

const host = process.env.NEXT_PUBLIC_HOST || "https://hrm.webng.life/api";

export function useCreateUserDayOff() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userDayOffData) => {
            const token = Cookies.get("token");
            if (!token) throw new Error("No authentication token found");

            const res = await fetch(`${host}/user-day-off`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(userDayOffData),
                credentials: "include",
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(data.message || "Failed to create user day off data");
            }

            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-day-off"] });
        },
    });
}
