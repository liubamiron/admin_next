'use client'

import { useRef, useEffect } from "react";
import { OrgChart } from "d3-org-chart";

export const OrgChartComponent = ({ data, onNodeClick }) => {
    const d3Container = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        if (!d3Container.current || !data) return;

        chartRef.current = new OrgChart()
            .container(d3Container.current)
            .data(data)
            .nodeWidth(() => 180)
            .nodeHeight(() => 125)
            .childrenMargin(() => 40)
            .compactMarginBetween(() => 25)
            .nodeContent(d => {
                const dept = d.data;
                return `
                    <div class="p-2 border rounded bg-white cursor-pointer">
                        <img src="${dept.image}" alt="${dept.name}" width="50" height="50" style="border-radius:50%; margin-bottom:5px;" />
                        <div><strong>${dept.name} ${dept.lastName || ''}</strong></div>
                        <div>${dept.position}</div>
                        <div>Employees: ${dept.userCount || 0}</div>
                    </div>
                `;
            })
            .onNodeClick(d => {
                if (onNodeClick) onNodeClick(d.data.id); // Pass ID to parent
            })
            .render();

    }, [data, onNodeClick]);

    return <div ref={d3Container} />;
};
