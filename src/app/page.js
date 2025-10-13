// app/page.js
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        redirect("/login");
    }

    if (token) {
        redirect("/users/employees");
    }


    return (
        <main className="flex items-center justify-center min-h-screen">
            <h1>Welcome to Dashboard</h1>
        </main>
    );
}
