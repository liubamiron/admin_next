"use client";

export default function StructureLayout({ children }) {

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 p-0 md:p-4">{children}</main>
        </div>
    );
}
