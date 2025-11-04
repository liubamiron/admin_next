"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function GlobalLoading() {
    const pathname = usePathname();
    const [loading, setLoading] = useState(false);
    const [currentPath, setCurrentPath] = useState(pathname);

    useEffect(() => {
        if (pathname !== currentPath) {
            setLoading(true);

            // Add a small delay to simulate loading bar until component renders
            const timer = setTimeout(() => {
                setCurrentPath(pathname);
                setLoading(false);
            }, 700); // optional, adjust timing as needed

            return () => clearTimeout(timer);
        }
    }, [pathname, currentPath]);

    return loading ? (
        <div className="fixed top-0 left-0 w-full h-[1px] bg-gray-200 dark:bg-gray-700 z-50 overflow-hidden">
            <div className="h-full bg-blue-600 animate-loading-bar" />
        </div>
    ) : null;
}
