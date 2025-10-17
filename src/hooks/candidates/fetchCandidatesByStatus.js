import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

const host = process.env.NEXT_PUBLIC_HOST || "https://hrm.webng.life/api";

const fetchCandidatesByStatus = async (status) => {
    const token = Cookies.get("token");
    if (!token) throw new Error("No authentication token found");

    const res = await fetch(`${host}/candidates?status=${status}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to fetch candidates");
    }

    return res.json(); // returns full API response (data + total + meta)
};

export const useNewCandidates = () => {
    return useQuery({
        queryKey: ["candidates", "new"],
        queryFn: () => fetchCandidatesByStatus("new"),
        keepPreviousData: true, // optional
    });
};

export const useHiredCandidates = () => {
    return useQuery({
        queryKey: ["candidates", "hired"],
        queryFn: () => fetchCandidatesByStatus("hired"),
        keepPreviousData: true,
    });
};

export const useDeclinedCandidates = () => {
    return useQuery({
        queryKey: ["candidates", "declined"],
        queryFn: () => fetchCandidatesByStatus("declined"),
        keepPreviousData: true,
    });
};
