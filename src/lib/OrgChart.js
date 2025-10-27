"use client";

import {useRef, useEffect} from "react";
import {OrgChart} from "d3-org-chart";

export const OrgChartComponent = ({data, onNodeClick}) => {
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

            const initialData = data.map(n => ({...n, expanded: false}));
            if (root) {
                const rootIndex = initialData.findIndex(n => n.id === root.id);
                initialData[rootIndex].expanded = true;
            }

            chart
                .container(d3Container.current)
                .data(initialData)
                // .nodeWidth(() => 180)
                // .nodeHeight(() => 125)
                .childrenMargin(() => 40)
                .compactMarginBetween(() => 25)
                .nodeContent((d) => {
                    const dept = d.data;
                    return `
            <div class="border rounded-xl shadow-sm bg-white cursor-pointer h-[140px] text-center org-node transition hover:shadow-md" data-id="${dept.id}">
              <div class="bg-blue-200 h-[20px] rounded-t-xl"></div>
              <div class="p-4">
                <div class="flex items-center space-x-4">
                  <img 
                    src="${dept.image || "/default-avatar.png"}" 
                    alt="${dept.name}" 
                    class="w-12 h-12 rounded-full object-cover border border-gray-300"
                  />
                  <div class="flex flex-col items-start">
                    <span class="font-semibold text-gray-800 text-sm leading-tight">${dept.name}</span>
                    <span class="text-gray-500 text-xs">${dept.position || ""}</span>
                    <span class="text-gray-400 text-xs">Employees: ${dept.userCount || 0}</span>
                  </div>
                </div>
              </div>
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

    return <div ref={d3Container}/>;
};
