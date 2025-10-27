"use client";

import { useRef, useEffect } from "react";
import { OrgChart } from "d3-org-chart";

export const OrgChartComponent = ({ data, onNodeClick }) => {
    const containerRef = useRef(null);
    const chartRef = useRef(null);
    const clickRef = useRef(onNodeClick);

    useEffect(() => {
        clickRef.current = onNodeClick;
    }, [onNodeClick]);

    useEffect(() => {
        if (!containerRef.current || !data.length) return;

        if (!chartRef.current) {
            const chart = new OrgChart();
            chartRef.current = chart;

            chart
                .container(containerRef.current)
                .data(data.map((n) => ({ ...n, expanded: true })))
                .nodeContent((d) => {
                    const dept = d.data;

                    let iconHTML = "";

                    if (dept.parentId === null) {
                        iconHTML = `<img src="/images/logo_sidebar.png" class="w-12 h-12 rounded-full object-contain border border-gray-300" alt="img_global"/>`;
                    } else if (dept.parentId === 0) {
                        iconHTML = `<div class="w-12 h-12 rounded-full flex items-center justify-center bg-blue-200 text-xl">🏢</div>`;
                    } else {
                        iconHTML = `<div class="w-12 h-12 rounded-full flex items-center justify-center bg-green-200 text-xl">👤</div>`;
                    }

                    return `
            <div class="border rounded-xl shadow-sm bg-white cursor-pointer h-[140px] text-center org-node transition hover:shadow-md" data-id="${dept.id}">
              <div class="bg-blue-200 h-[20px] rounded-t-xl"></div>
              <div class="p-4 flex flex-col items-center space-y-2">
                ${iconHTML}
                <span class="font-semibold text-gray-800 text-sm leading-tight">${dept.name}</span>
                <span class="text-gray-400 text-xs">Employees: ${dept.userCount || 0}</span>
              </div>
            </div>
          `;
                })
                .render();

            const handleClick = (e) => {
                const nodeEl = e.target.closest("div[data-id]");
                if (nodeEl) {
                    const id = Number(nodeEl.getAttribute("data-id"));
                    if (clickRef.current) clickRef.current(id);
                }
            };

            containerRef.current.addEventListener("click", handleClick);
            return () => {
                if (containerRef.current)
                    containerRef.current.removeEventListener("click", handleClick);
            };
        }
    }, [data]);

    return <div ref={containerRef} className="w-full h-full" />;
};
