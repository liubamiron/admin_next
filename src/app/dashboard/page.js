"use client";

import { useEffect, useState } from "react";


export default function DashboardPage() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser)); // parse only once
        }
    }, []);


    if (!user) {
        return <p className="p-6 text-gray-700">No user data found. Please login.</p>;
    }


    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                Admin Dashboard

                <div>Welcome, authorized user!</div>
                <div className="border rounded-lg p-4 bg-white shadow">
                    <h2 className="text-lg font-semibold">Welcome, {user?.full_name}</h2>
                    <p className="text-gray-600">Email: {user?.email}</p>
                    <p className="text-gray-600">Status: {user?.statusTitle}</p>

                    <div className="mt-4">
                        <h3 className="font-semibold">Role(s):</h3>
                        <ul className="list-disc pl-5">
                            {user.roles?.map((role) => (
                                <li key={role.id}>
                                    {role?.name} — permissions:{" "}
                                    {role?.permissions.map((p) => p?.name).join(", ")}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-4">
                        <h3 className="font-semibold">Office:</h3>
                        <p>
                            {user.office?.name} — {user.office?.location}
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
