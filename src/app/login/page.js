"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/useLogin";
import { HiEye, HiEyeOff } from "react-icons/hi"; // 👈 icons

export default function LogInPage() {
    const router = useRouter();
    const { login, loading, error } = useLogin();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // 👈 toggle

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await login({ email, password });
            router.push("/dashboard");
        } catch (err) {
            console.error("Login failed:", err);
        }
    }

    return (
        <div className="mx-auto flex flex-col items-center justify-center px-6 md:h-screen">
            <form
                className="w-full max-w-md border rounded-lg p-12 bg-white dark:bg-gray-800"
                onSubmit={handleSubmit}
            >
                {/* Email */}
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-2.5 text-sm text-gray-900 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>

                {/* Password */}
                <div className="mb-5 relative">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Password
                    </label>
                    <input
                        type={showPassword ? "text" : "password"} // 👈 toggle type
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-2.5 text-sm text-gray-900 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 top-7 flex items-center text-gray-500 dark:text-gray-300"
                    >
                        {showPassword ? (
                            <HiEyeOff className="h-5 w-5" />
                        ) : (
                            <HiEye className="h-5 w-5" />
                        )}
                    </button>
                </div>

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}
