"use client";

import { useRef, useEffect } from "react";
import { OrgChart } from "d3-org-chart";

export const OrgChartComponent = ({ data, onNodeClick }) => {
    const d3Container = useRef(null);
    const chartRef = useRef(null);
    const onNodeClickRef = useRef(onNodeClick);

    // Keep the ref updated to the latest callback
    useEffect(() => {
        onNodeClickRef.current = onNodeClick;
    }, [onNodeClick]);

    useEffect(() => {
        if (!d3Container.current || !data.length) return;

        if (!chartRef.current) {
            const chart = new OrgChart();
            chartRef.current = chart;

            const root = data.find(n => !n.parentId);

            const initialData = data.map(n => ({ ...n, expanded: false }));
            if (root) {
                const rootIndex = initialData.findIndex(n => n.id === root.id);
                initialData[rootIndex].expanded = true;
            }

            chart
                .container(d3Container.current)
                .data(initialData)
                .nodeWidth(() => 180)
                .nodeHeight(() => 125)
                .childrenMargin(() => 40)
                .compactMarginBetween(() => 25)
                .nodeContent(d => {
                    const dept = d.data;
                    return `
            <div class="p-2 border rounded bg-white cursor-pointer text-center org-node" data-id="${dept.id}">
              <img src="${dept.image}" alt="${dept.name}" width="50" height="50" style="border-radius:50%; margin-bottom:5px;" />
              <div><strong>${dept.name} ${dept.lastName || ''}</strong></div>
              <div>${dept.position}</div>
              <div>Employees: ${dept.userCount || 0}</div>
              ${
                        data.some(n => n.parentId === dept.id)
                            ? `<button class="expand-btn" data-id="${dept.id}" style="margin-top:5px; padding:2px 6px; border:none; background:#e2e8f0; border-radius:4px; cursor:pointer;">▼</button>`
                            : ""
                    }
            </div>
          `;
                })
                .render();

            if (root) chart.collapseAll().setExpanded(root.id, true).render();

            const handleClick = (e) => {
                const toggleBtn = e.target.closest(".expand-btn");
                if (toggleBtn) {
                    const nodeId = Number(toggleBtn.getAttribute("data-id"));
                    const isExpanded = chart.getExpanded(nodeId);
                    chart.setExpanded(nodeId, !isExpanded).render();
                    return;
                }

                const nodeEl = e.target.closest(".org-node");
                if (nodeEl) {
                    const nodeId = Number(nodeEl.getAttribute("data-id"));
                    if (onNodeClickRef.current) onNodeClickRef.current(nodeId);
                }
            };

            d3Container.current.addEventListener("click", handleClick);
            return () => d3Container.current.removeEventListener("click", handleClick);
        }
    }, [data]);

    return <div ref={d3Container} />;
};
