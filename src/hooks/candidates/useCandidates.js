import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

const host = process.env.NEXT_PUBLIC_HOST || "https://hrm.webng.life/api";

export const fetchCandidates = async ({ page = 1, status, positionId }) => {
    const token = Cookies.get("token");
    if (!token) throw new Error("No authentication token found");

    let url = `${host}/candidates?page=${page}`;
    if (status && status !== "all") url += `&status=${status}`;
    if (positionId) url += `&position_id=${positionId}`;

    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to fetch candidates");
    }
    const json = await res.json();
    return {
        full: json,        // full JSON response (pagination, meta, etc.)
        data: json.data,   // only candidates array
    };
};

export const useCandidates = (page = 1, status = "all", positionId = null) => {
    return useQuery({
        queryKey: ["candidates", page, status, positionId],
        queryFn: () => fetchCandidates({ page, status, positionId }),
        keepPreviousData: true,
    });
};

