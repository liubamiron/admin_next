import { NextResponse } from "next/server";

const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123";

export async function POST(req) {
    const { email, password } = await req.json();

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        return NextResponse.json({ token: "fake-jwt-token" });
    }

    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
}
