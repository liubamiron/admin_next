"use client";

import { OrgChartComponent } from "@/lib/OrgChart";
import { useState, useEffect } from "react";
import { useOffices } from "@/hooks/officies/useOffices";
import {useManagers} from "@/hooks/useManagers";

export default function TestPage() {
    const [chartData, setChartData] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);

    const { data: offices = [], isLoading: loadingOffices, isError: errorOffices } = useOffices();
    const { data: managers = [], isLoading: loadingManagers } = useManagers();

    // Prepare chart data
    useEffect(() => {
        if (!offices?.data) return;

        const dataWithRoot = [
            { id: 0, parentId: null, name: "WebNG Global", type: "root" },
            ...offices.data.flatMap((office) => {
                const officeNode = {
                    id: office.id,
                    parentId: 0,
                    name: office.name,
                    type: "office",
                    departments: office.departments || [],
                };

                const departmentNodes = (office.departments || []).map((dept) => ({
                    id: 1000 + dept.id,
                    parentId: office.id,
                    name: dept.name,
                    type: "department",
                    manager_id: dept.manager_id || null,
                }));

                return [officeNode, ...departmentNodes];
            }),
        ];

        setChartData(dataWithRoot);
    }, [offices]);

    if (loadingOffices) return <div>Loading offices...</div>;
    if (errorOffices) return <div>Failed to load offices</div>;

    // Get manager details by id
    const getManagerName = (id) => {
        const manager = managers?.find((m) => m.id === id);
        return manager ? manager.name : "-";
    };

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

            {/* Sidebar */}
            {selectedNode && (
                <div className="fixed right-0 top-12 w-80 h-[70%] bg-white shadow-lg border-l flex flex-col">
                    <div className="p-4 flex flex-col items-center">
                        {/* Node Icon */}
                        {selectedNode.type === "root" ? (
                            <img
                                src={getIcon(selectedNode.type)}
                                className="w-20 h-20 rounded-full mb-2"
                                alt="logo"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-blue-200 flex items-center justify-center text-4xl mb-2">
                                {getIcon(selectedNode.type)}
                            </div>
                        )}

                        {/* Node Name */}
                        <h2 className="text-xl font-bold mb-4">{selectedNode.name}</h2>

                        {/* If office, show departments */}
                        {selectedNode.type === "office" && (
                            <div className="w-full overflow-y-auto">
                                <h3 className="font-semibold mb-2">Departments:</h3>
                                {selectedNode.departments.length > 0 ? (
                                    selectedNode.departments.map((dept) => (
                                        <div
                                            key={dept.id}
                                            className="border-b py-1 px-2"
                                        >
                                            <div>{dept.name}</div>
                                            <div className="text-gray-500 text-xs">
                                                Manager: {dept.manager_id ? getManagerName(dept.manager_id) : "-"}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div>No departments</div>
                                )}
                            </div>
                        )}

                        {/* If department, show manager */}
                        {selectedNode.type === "department" && (
                            <div className="w-full">
                                <h3 className="font-semibold mb-2">Department Details:</h3>
                                <div>Name: {selectedNode.name}</div>
                                <div className="text-gray-500 text-xs">
                                    Manager: {selectedNode.manager_id ? getManagerName(selectedNode.manager_id) : "-"}
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setSelectedNode(null)}
                        className="w-full bg-gray-200 hover:bg-gray-300 rounded py-2 transition mt-auto"
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
}
