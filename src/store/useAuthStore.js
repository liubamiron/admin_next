"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const PERMISSION_LIST = [
    "view permissions",
    "view roles",
    "view candidates",
    "edit candidates",
    "view employees",
    "edit employees",
    "view positions",
    "edit positions",
    "view org chart",
    "view variables",
    "view templates",
    "view documents",
    "view multiple departments",
    "view interview calendar",
    "view structure",
    "view shifts calendar",
    "edit structure",
    "view interview relation",
    "view notes relation",
    "view off day relation",
    "view documents relation",
    "create employer"
];

export const useAuthStore = create(
    devtools(
        persist(
            (set) => ({

                ...PERMISSION_LIST.reduce((acc, perm) => {
                    acc[perm.replace(/\s+/g, "_")] = false;
                    return acc;
                }, {}),


                setFlags: (userPermissions = []) => {
                    const flags = PERMISSION_LIST.reduce((acc, perm) => {
                        acc[perm.replace(/\s+/g, "_")] = userPermissions.includes(perm);
                        return acc;
                    }, {});
                    set(flags);
                },


                resetFlags: () => {
                    const reset = PERMISSION_LIST.reduce((acc, perm) => {
                        acc[perm.replace(/\s+/g, "_")] = false;
                        return acc;
                    }, {});
                    set(reset);
                }
            }),
            {
                name: "auth-flags", // локальное хранилище UI-флагов
                partialize: (state) =>
                    PERMISSION_LIST.reduce((acc, perm) => {
                        acc[perm.replace(/\s+/g, "_")] = state[perm.replace(/\s+/g, "_")];
                        return acc;
                    }, {})
            }
        )
    )
);
