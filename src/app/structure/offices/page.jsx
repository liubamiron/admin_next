"use client";

import {
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Modal,
    Label,
    TextInput,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow,
    ModalBody,
    ModalHeader,
} from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { usePathname } from "next/navigation";
import { useOffices } from "@/hooks/officies/useOffices";
import Link from "next/link";
import { useState } from "react";
import {useCreateOffice} from "@/hooks/officies/useCreateOffice";
import {useEditOffice} from "@/hooks/officies/useEditOffice";

export default function OfficePage() {
    const { data: allData } = useOffices(1, "all", null);
    const offices = allData?.data ?? [];

    const { mutate: createOffice, isPending: creating } = useCreateOffice();
    const { mutateAsync: editOffice, isPending: editing } = useEditOffice();


    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    const crumbs = segments.map((seg, idx) => {
        const href = "/" + segments.slice(0, idx + 1).join("/");
        return { name: seg[0].toUpperCase() + seg.slice(1), href };
    });

    const menuItems = [
        { href: "/structure/offices", icon: "/icons/office_img.svg", label: "Offices" },
        { href: "/structure/departments", icon: "/icons/departments_img.svg", label: "Departments" },
        { href: "/structure/positions", icon: "/icons/positions_img.svg", label: "Positions" },
        { href: "/structure/public-holidays", icon: "/icons/public_holidays.svg", label: "Public Holidays" },
    ];

    // Modal state
    const [openModal, setOpenModal] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [selectedOffice, setSelectedOffice] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        createOffice(
            { name, location },
            {
                onSuccess: () => {
                    setOpenModal(false);
                    setName("");
                    setLocation("");
                },
                onError: (error) => {
                    alert(error.message || "Failed to create office");
                },
            }
        );
    };

    // Open edit modal with prefilled data
    const handleEditClick = (office) => {
        setSelectedOffice(office);
        setName(office.name || "");
        setLocation(office.location || "");
        setOpenModalEdit(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await editOffice({
                id: selectedOffice.id,
                name,
                location,
            });
            setSelectedOffice(null);
            setOpenModalEdit(false);
        } catch (err) {
            alert(err.message);
        }
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

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Offices</h2>


            <div className="flex justify-between items-center">
                <Button onClick={() => setOpenModal(true)}>+ New Office</Button>
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
                                    style={{
                                        filter: isActive
                                            ? "brightness(0) saturate(100%) invert(34%) sepia(99%) saturate(2461%) hue-rotate(194deg) brightness(95%) contrast(96%)"
                                            : "none",
                                    }}
                                />
                                <span
                                    className={`font-medium ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-gray-100"}`}
                                >
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
                                    <TableHeadCell>Location</TableHeadCell>
                                    <TableHeadCell>Actions</TableHeadCell>
                                </TableRow>
                            </TableHead>

                            <TableBody className="divide-y">
                                {offices?.map((office) => (
                                    <TableRow
                                        key={office.id}
                                        className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        <TableCell className="font-medium text-gray-900 dark:text-white">
                                            {office?.name}
                                        </TableCell>
                                        <TableCell>{office?.userCount}</TableCell>
                                        <TableCell>{office?.location}</TableCell>
                                        <TableCell className="flex gap-2">
                                            <div className="flex gap-2 justify-center">
                                                <Button size="xs" color="info" onClick={() => handleEditClick(office)}>
                                                    <img src="/icons/edit.svg" alt="edit" className="w-5 h-5" />
                                                </Button>
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
                <ModalHeader>Add New Office</ModalHeader>
                <ModalBody>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name" value="Office Name" />
                            <TextInput
                                id="name"
                                type="text"
                                required
                                placeholder="Enter office name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="location" value="Location" />
                            <TextInput
                                id="location"
                                type="text"
                                placeholder="Enter location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
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

            {/*  Edit Modal */}
            <Modal show={openModalEdit} onClose={() => setOpenModalEdit(false)}>
                <ModalHeader>Edit Office</ModalHeader>
                <ModalBody>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="edit-name" value="Office Name" />
                            <TextInput
                                id="edit-name"
                                type="text"
                                required
                                placeholder="Enter office name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="edit-location" value="Location" />
                            <TextInput
                                id="edit-location"
                                type="text"
                                placeholder="Enter location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
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
