"use client";

import React, { useState } from "react";

const departments = [
    {
        id: 1,
        name: "WebNG",
        manager: [
            { id: 1, full_name: "Cristen Scavo", position: "Head of Department", img: "/images/neil-sims.png" },
        ],
        total_employees: "14",
        employees: [],
        children: [2, 3],
    },
    {
        id: 2,
        name: "Micle",
        manager: [
            { id: 1, full_name: "Neil Sims", position: "Team Lead", img: "/images/neil-sims.png" },
        ],
        total_employees: "60",
        employees: [],
        children: [4, 5],
    },
    {
        id: 3,
        name: "FinancePro",
        manager: [
            { id: 1, full_name: "Sarah Green", position: "Finance Director", img: "/images/neil-sims.png" },
        ],
        total_employees: "25",
        employees: [],
        children: [],
    },
    {
        id: 4,
        name: "TechLab",
        manager: [
            { id: 1, full_name: "Alice Brown", position: "CTO", img: "/images/neil-sims.png" },
        ],
        total_employees: "40",
        employees: [],
        children: [],
    },
    {
        id: 5,
        name: "DesignHub",
        manager: [
            { id: 1, full_name: "Olivia Martin", position: "Creative Director", img: "/images/neil-sims.png" },
        ],
        total_employees: "18",
        employees: [],
        children: [6, 7],
    },
    {
        id: 6,
        name: "SupportPlus",
        manager: [
            { id: 1, full_name: "James Carter", position: "Support Lead", img: "/images/neil-sims.png" },
        ],
        total_employees: "30",
        employees: [],
        children: [],
    },
    {
        id: 7,
        name: "SalesBoost",
        manager: [
            { id: 1, full_name: "Robert Hall", position: "Sales Director", img: "/images/neil-sims.png" },
        ],
        total_employees: "22",
        employees: [],
        children: [8],
    },
    {
        id: 8,
        name: "MarketingVision",
        manager: [
            { id: 1, full_name: "Emma Watson", position: "Marketing Head", img: "/images/neil-sims.png" },
        ],
        total_employees: "50",
        employees: [],
        children: [],
    },
];

export default function OrgChartPage() {
    const [expanded, setExpanded] = useState([]);
    const [selectedDept, setSelectedDept] = useState(null);

    const toggleExpand = (id) => {
        setExpanded((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const currentDept = departments.find((d) => d.id === selectedDept);

    const renderCard = (dept, level) => {
        const isTopLevel = level === 0;
        const cardWidth = isTopLevel ? "w-[320px]" : "w-[280px]";
        const imgSize = isTopLevel ? "h-14 w-14" : "h-12 w-12";
        const nameSize = isTopLevel ? "text-lg" : "text-base";

        return (
            <div
                key={dept.id}
                className={`border border-gray-200 rounded-lg overflow-hidden bg-white pt-4
        dark:border-gray-700 dark:bg-gray-800 dark:text-white
        hover:border-blue-300 hover:shadow-lg transition-all ${cardWidth}`}
            >
                {/* Header */}
                <div className="px-4 py-2 bg-transparent font-semibold flex flex-row items-center gap-1">
                    <img src="/icons/case.svg" alt="case" />
                    {dept.name}
                </div>

                {/* Body */}
                <div
                    className="px-4 py-3 cursor-pointer"
                    onClick={() => setSelectedDept(dept.id)}
                >
                    <div className="flex flex-row gap-4">
                        <img
                            src={dept.manager[0]?.img}
                            alt="manager"
                            className={`rounded-full ${imgSize}`}
                        />
                        <div className={nameSize}>
                            {dept.manager[0]?.full_name}
                            <br />
                            <span className="text-gray-500 text-sm">
                {dept.manager[0]?.position}
              </span>
                        </div>
                    </div>

                    <div className="text-sm flex flex-row items-center gap-2 mt-4 text-gray-500">
                        Employees:
                        <div className="bg-blue-100 text-blue-500 p-1 border rounded border-blue-100">
                            employees&nbsp;{dept.total_employees}
                        </div>
                    </div>
                </div>

                <div
                    onClick={() => dept.children.length > 0 && toggleExpand(dept.id)}
                    className={`px-2 py-2 text-sm text-center transition cursor-pointer 
    ${dept.children.length > 0
                        ? "bg-blue-50 text-blue-500 hover:bg-blue-100"
                        : "bg-gray-50 text-gray-400 cursor-default"
                    }`}
                >
                    {dept.children.length === 0
                        ? "No subdepartments"
                        : expanded.includes(dept.id)
                            ? `Hide ${dept.children.length} subdepartments`
                            : `View ${dept.children.length} subdepartments`}
                </div>
            </div>
        );
    };

    const renderLevel = (parentIds, level = 0) => (
        <div className="flex flex-wrap justify-center gap-8 mt-6">
            {parentIds.map((id) => {
                const dept = departments.find((d) => d.id === id);
                if (!dept) return null;

                return (
                    <div key={dept.id} className="flex flex-col items-center">
                        {renderCard(dept, level)}

                        {/* Connector + Children */}
                        {expanded.includes(dept.id) && dept.children.length > 0 && (
                            <>
                                <div className="md:flex hidden justify-center items-center mt-2">
                                    <img
                                        src={"/images/blue_connector_line_left.png"}
                                        alt="line left"
                                        className="w-20 sm:w-42"
                                    />
                                    <img
                                        src={"/images/blue_connector_line_right.png"}
                                        alt="line right"
                                        className="w-20 sm:w-42"
                                    />
                                </div>
                                {renderLevel(dept.children, level + 1)}
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-12 mt-12 text-center dark:text-white">
                Organization Chart
            </h1>

            {/* Sidebar */}
            {currentDept && (
                <div className="fixed right-0 top-16 h-full w-72 bg-white shadow-lg border-l z-50 p-4 overflow-y-auto dark:bg-gray-900 dark:text-white">
                    <h2 className="text-xl font-bold mb-5">{currentDept.name}</h2>

                    <div className="bg-blue-100 text-blue-500 p-1.5 border rounded border-blue-100 mb-5">
                        Total employees: {currentDept.total_employees}
                    </div>

                    <div className="mb-5">
                        <span className="font-bold">Manager</span>
                        {currentDept.manager.map((m) => (
                            <div className="flex flex-row gap-3 mt-2" key={m.id}>
                                <img
                                    src={m.img}
                                    alt="manager"
                                    className="rounded-full h-10 w-10"
                                />
                                <div>
                                    {m.full_name}
                                    <br />
                                    <span className="text-gray-500 text-sm">{m.position}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => setSelectedDept(null)}
                        className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded py-2 mt-6 transition"
                    >
                        Close
                    </button>
                </div>
            )}

            {/* Chart */}
            <div className="flex flex-col items-center">{renderLevel([1])}</div>
        </div>
    );
}
