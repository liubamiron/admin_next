"use client";

import React from "react";

export default function PaginationComponent({
                                                currentPage,
                                                totalPages,
                                                onPageChange,
                                                siblings = 1, // number of pages to show around current
                                            }) {
    if (totalPages === 0) return null;

    const getPages = () => {
        const pages = [];

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 || // first page
                i === totalPages || // last page
                (i >= currentPage - siblings && i <= currentPage + siblings)
            ) {
                pages.push(i);
            } else if (i === 2 && currentPage - siblings > 3) {
                pages.push("...");
            } else if (i === totalPages - 1 && currentPage + siblings < totalPages - 2) {
                pages.push("...");
            }
        }

        // Remove consecutive "..."
        return pages.filter((page, index, arr) => !(page === "..." && arr[index - 1] === "..."));
    };

    const pages = getPages();

    return (
        <nav aria-label="Pagination">
            <ul className="inline-flex -space-x-px text-base h-10">
                {/* Previous */}
                <li>
                    <button
                        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                        className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                        Previous
                    </button>
                </li>

                {/* Page numbers */}
                {pages.map((page, idx) =>
                        page === "..." ? (
                            <li key={idx}>
              <span className="flex items-center justify-center px-4 h-10 leading-tight border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                ...
              </span>
                            </li>
                        ) : (
                            <li key={page}>
                                <button
                                    onClick={() => onPageChange(page)}
                                    className={`flex items-center justify-center px-4 h-10 leading-tight border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                                        page === currentPage
                                            ? "bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-white"
                                            : "bg-white text-gray-500"
                                    }`}
                                    aria-current={page === currentPage ? "page" : undefined}
                                >
                                    {page}
                                </button>
                            </li>
                        )
                )}

                {/* Next */}
                <li>
                    <button
                        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                        className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
}