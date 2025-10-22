"use client";

import {
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Label,
    Modal,
    ModalBody,
    ModalHeader,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow,
    TextInput,
} from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { usePositions } from "@/hooks/usePositions";
import { useState } from "react";

export default function PositionsPage() {
    const { data: allData } = usePositions(1, "all", null);
    const positions = allData;

    const [openModal, setOpenModal] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [name, setName] = useState("");
    const [selectedPosition, setSelectedPosition] = useState(null);

    const pathname = usePathname();

    const crumbs = pathname
        .split("/")
        .filter(Boolean)
        .map((seg, idx, arr) => ({
            name: seg[0].toUpperCase() + seg.slice(1),
            href: "/" + arr.slice(0, idx + 1).join("/"),
        }));

    const menuItems = [
        { href: "/structure/offices", icon: "/icons/office_img.svg", label: "Offices" },
        { href: "/structure/departments", icon: "/icons/departments_img.svg", label: "Departments" },
        { href: "/structure/positions", icon: "/icons/positions_img.svg", label: "Positions" },
        { href: "/structure/public-holidays", icon: "/icons/public_holidays.svg", label: "Public Holidays" },
    ];

    // --- Handlers ---
    const handleAddSubmit = (e) => {
        e.preventDefault();
        console.log("New Position:", { name });
        setName("");
        setOpenModal(false);
    };

    const handleEditClick = (position) => {
        setSelectedPosition(position);
        setName(position.name || "");
        setOpenModalEdit(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        console.log("Updated Position:", { id: selectedPosition?.id, name });
        setSelectedPosition(null);
        setName("");
        setOpenModalEdit(false);
    };

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb className="flex items-center gap-2">
                <BreadcrumbItem href="/" icon={HiHome}>
                    Home
                </BreadcrumbItem>
                {crumbs.map((c, i) => (
                    <BreadcrumbItem key={i} {...(c.name.toLowerCase() !== "structure" && { href: c.href })}>
                        {c.name}
                    </BreadcrumbItem>
                ))}
            </Breadcrumb>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Positions</h2>

            {/* Header */}
            <div className="flex justify-between items-center">
                <Button onClick={() => setOpenModal(true)}>+ New Position</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-6">
                {/* Sidebar */}
                <div className="space-y-2 bg-white p-4 rounded-lg shadow dark:bg-gray-800">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 p-3 rounded-lg transition
                  ${isActive
                                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                            >
                                <img
                                    src={item.icon}
                                    alt={item.label}
                                    className="w-6 h-6 object-contain"
                                    style={isActive ? { filter: "brightness(0) saturate(100%) invert(34%) sepia(99%) saturate(2461%) hue-rotate(194deg) brightness(95%) contrast(96%)" } : {}}
                                />
                                <span className={`font-medium ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-gray-100"}`}>
                  {item.label}
                </span>
                            </Link>
                        );
                    })}
                </div>

                {/* Table */}
                <div className="rounded-lg p-6 mb-6 shadow-sm space-y-6 bg-[#F9FAFB] dark:bg-gray-800">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeadCell>Name</TableHeadCell>
                                    <TableHeadCell>Employees Count</TableHeadCell>
                                    <TableHeadCell>Actions</TableHeadCell>
                                </TableRow>
                            </TableHead>

                            <TableBody className="divide-y">
                                {positions?.data?.map((position) => (
                                    <TableRow key={position.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <TableCell className="font-medium text-gray-900 dark:text-white">{position.name}</TableCell>
                                        <TableCell>{position.userCount}</TableCell>
                                        <TableCell>
                                            <div className="flex justify-center cursor-pointer" onClick={() => handleEditClick(position)}>
                                                <img src="/icons/edit.svg" alt="edit" className="w-5 h-5" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* ➕ Add Modal */}
            <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <ModalHeader>Add New Position</ModalHeader>
                <ModalBody>
                    <form onSubmit={handleAddSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name" value="Position Name" />
                            <TextInput
                                id="name"
                                type="text"
                                required
                                placeholder="Enter position name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end space-x-2 pt-2">
                            <Button color="gray" onClick={() => setOpenModal(false)} type="button">
                                Cancel
                            </Button>
                            <Button color="success" type="submit">
                                Save
                            </Button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>

            {/* ✏ Edit Modal */}
            <Modal show={openModalEdit} onClose={() => setOpenModalEdit(false)}>
                <ModalHeader>Edit Position</ModalHeader>
                <ModalBody>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="edit-name" value="Position Name" />
                            <TextInput
                                id="edit-name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end space-x-2 pt-2">
                            <Button color="gray" onClick={() => setOpenModalEdit(false)} type="button">
                                Cancel
                            </Button>
                            <Button color="info" type="submit">
                                Update
                            </Button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        </div>
    );
}
