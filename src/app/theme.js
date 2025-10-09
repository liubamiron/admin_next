import { createTheme } from "flowbite-react";

export const customTheme = createTheme({
    modal: {
        content: {
            inner: "dark:bg-gray-800",
        },
        header: {
            base: "items-center dark:border-gray-700",
            title: "font-semibold",
            close: {
                base: "hover:bg-gray-200 dark:hover:bg-gray-700",
            },
        },
        footer: {
            base: "dark:border-gray-700",
        },
    },
    progress: {
        color: {
            blue: "bg-primary-600",
            dark: "bg-gray-900 dark:bg-white",
        },
        size: {
            md: "h-2",
        },
    },
    select: {
        field: {
            select: {
                sizes: {
                    md: "text-base sm:text-sm",
                },
                colors: {
                    gray: "focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-500",
                },
            },
        },
    },
    sidebar: {
        root: {
            inner: "bg-white",
        },
        collapse: {
            button:
                "text-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700",
        },
        item: {
            base: "text-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700",
            label:
                "text-primary-800 bg-primary-100 ml-3 inline-flex h-5 w-5 items-center justify-center rounded-full p-1 text-sm font-medium",
        },
    },
    textarea: {
        base: "p-4",
        colors: {
            gray: "text-base focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:focus:border-blue-500 dark:focus:ring-blue-500",
        },
    },
    textInput: {
        field: {
            input: {
                base: "outline-none",
                sizes: {
                    md: "p-2.5 sm:text-sm",
                },
            },
        },
    },
    card: {
        root: {
            base: "border-none shadow",
            children: "p-4 sm:p-6 xl:p-8",
        },
    },
});

// Optional: applyTheme config
export const applyTheme = {
    card: {
        root: {
            children: "replace",
        },
    },
};
