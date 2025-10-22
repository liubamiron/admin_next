// src/app/users/layout.jsx
"use client";

export default function UsersLayout({ children }) {

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 p-4">{children}</main>
        </div>
    );
}
