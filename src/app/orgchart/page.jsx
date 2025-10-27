"use client";

import { OrgChartComponent } from "@/lib/OrgChart";
import { useState, useEffect } from "react";
import { useOffices } from "@/hooks/officies/useOffices";
import { useDepartments } from "@/hooks/departments/useDepartments";

export default function TestPage() {
    const [chartData, setChartData] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);

    const { data: officesData = [], isLoading: loadingOffices } = useOffices();
    const { data: departmentsData = [], isLoading: loadingDepartments } = useDepartments();

    // Prepare chart data with departments included
    useEffect(() => {
        if (!officesData?.data || !departmentsData?.data) return;

        const dataWithRoot = [
            { id: 0, parentId: null, name: "WebNG Global", type: "root" },
            ...officesData.data.map((office) => {
                // Attach departments from useDepartments
                const officeDepartments = departmentsData.data.filter(d => d.office_id === office.id);

                const officeNode = {
                    id: office.id,
                    parentId: 0,
                    name: office.name,
                    type: "office",
                    departments: officeDepartments,
                };

                const departmentNodes = officeDepartments.map(dept => ({
                    id: 1000 + dept.id,
                    parentId: office.id,
                    name: dept.name,
                    type: "department",
                    manager: dept.manager, // include full manager info
                }));

                return [officeNode, ...departmentNodes];
            }).flat()
        ];

        setChartData(dataWithRoot);
    }, [officesData, departmentsData]);

    if (loadingOffices || loadingDepartments) return <div>Loading...</div>;

    const getIcon = (type) => {
        if (type === "root") return "/images/logo_sidebar.png";
        if (type === "office") return "🏢";
        return "👤";
    };

    return (
        <div className="w-full h-screen relative">
            <OrgChartComponent
                data={chartData}
                onNodeClick={(id) => setSelectedNode(chartData.find((d) => d.id === id))}
            />

            {selectedNode && (
                <div className="fixed right-0 top-16 h-full w-72 bg-white shadow-lg border-l z-50 p-4 overflow-y-auto dark:bg-gray-900 dark:text-white">
                    <div className="p-4 flex flex-col items-center">
                        {selectedNode.type === "root" ? (
                            <img src={getIcon(selectedNode.type)} className="w-20 h-20 rounded-full mb-2" alt="logo" />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-blue-200 flex items-center justify-center text-4xl mb-2">
                                {getIcon(selectedNode.type)}
                            </div>
                        )}

                        <h2 className="text-xl font-bold mb-4">{selectedNode.name}</h2>

                        {selectedNode.type === "office" && (
                            <div className="w-full overflow-y-auto">
                                <h3 className="font-semibold mb-2">Departments:</h3>
                                {selectedNode.departments.length > 0 ? (
                                    selectedNode.departments.map(dept => (
                                        <div key={dept.id} className="border-b py-1 px-2">
                                            <div>{dept.name}</div>
                                            <div className="text-gray-500 text-xs">
                                                Manager: {dept.manager?.full_name || "-"}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div>No departments</div>
                                )}
                            </div>
                        )}

                        {selectedNode.type === "department" && (
                            <div className="w-full">
                                <h3 className="font-semibold mb-2">Department Details:</h3>
                                <div>Name: {selectedNode.name}</div>
                                <div className="text-gray-500 text-xs">
                                    Manager: {selectedNode.manager?.full_name || "-"}
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setSelectedNode(null)}
                        className="w-full bg-gray-200 hover:bg-gray-300 rounded py-2 mt-15 transition"
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
}
