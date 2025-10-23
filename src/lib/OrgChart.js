'use client'

import { useRef, useEffect } from "react";
import { OrgChart } from "d3-org-chart";

export const OrgChartComponent = ({ data, setClick }) => {
    const d3Container = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        if (!d3Container.current || !data) return;

        chartRef.current = new OrgChart()
            .container(d3Container.current)
            .data(data)
            .nodeWidth(d => 180)       // width of each node
            .nodeHeight(d => 125)      // height of each node
            .childrenMargin(d => 40)   // vertical margin between nodes
            .compactMarginBetween(d => 25)
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
                if (setClick) setClick(d);
            })
            .render();

        if (setClick) {
            setClick(node => chartRef.current.addNode(node));
        }

    }, [data]);

    return <div ref={d3Container} />;
};
