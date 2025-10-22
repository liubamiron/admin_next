
'use client';

import { useParams } from 'next/navigation';

export default function EmployeeEditPage() {
    const { id } = useParams();

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Edit Employee {id}</h2>
            {/* Form content */}
        </div>
    );
}