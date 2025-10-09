// src/app/users/employees/[id]/page.jsx

'use client';

import { useParams } from 'next/navigation';

export default function EmployeeViewPage() {
    const { id } = useParams();

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">View Employee {id}</h2>
            {/* Form content */}
        </div>
    );
}