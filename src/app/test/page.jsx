"use client";

import {OrgChartComponent} from "@/lib/OrgChart";
import {useState, useEffect} from "react";

export default function TestPage() {
    const [data, setData] = useState([]);
    const [selectedDept, setSelectedDept] = useState(null);

    const departments = [
        { id: 1, name: "WebNG Global", location: "Global", position: "Chief", image: '/images/users/neil-sims.png', userCount: 5 },
        { id: 2, parentId: 1, name: "CTO", location: "King", position: "Chief", image: '/images/users/neil-sims.png', userCount: 3 },
        { id: 3, parentId: 1, name: "CFO", location: "King", position: "Chief", image: '/images/users/neil-sims.png', userCount: 2 },
        { id: 4, parentId: 2, name: "Lead Dev", location: "King", position: "Chief", image: '/images/users/neil-sims.png', userCount: 4 },
        { id: 5, parentId: 2, name: "QA Manager", location: "King", position: "Chief", image: '/images/users/neil-sims.png', userCount: 6 },
    ];

    useEffect(() => {
        setData(departments);
    }, []);

    const deptDetails = departments.find(d => d.id === selectedDept);

    return (
        <div className="flex min-h-screen relative">
            <div className="flex-1">
                <OrgChartComponent
                    data={data}
                    onNodeClick={(id) => setSelectedDept(id)}
                />

            </div>

            {/* Right Sidebar */}
            {deptDetails && (
                <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg border-l p-4 overflow-y-auto">
                    <h2 className="text-xl font-bold mb-4">{deptDetails.name}</h2>
                    <img src={deptDetails.image} className="w-20 h-20 rounded-full mb-2" alt={'img_org'}/>
                    <div className="font-semibold">{deptDetails.location}</div>
                    <div className="text-gray-500 mb-2">{deptDetails.position}</div>
                    <div className="bg-blue-100 text-blue-500 p-1 rounded mb-4">
                        Employees: {deptDetails.userCount}
                    </div>
                    <button
                        onClick={() => setSelectedDept(null)}
                        className="w-full bg-gray-200 hover:bg-gray-300 rounded py-2 transition"
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
}