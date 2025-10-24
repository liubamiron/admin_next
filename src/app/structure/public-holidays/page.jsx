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
import { usePublicHolidays } from "@/hooks/publicHolidays/usePublicHolidays";
import { useState } from "react";
import {useCreatePublicHolidays} from "@/hooks/publicHolidays/useCreatePublicHolidays";
import {useEditPublicHolidays} from "@/hooks/publicHolidays/useEditPublicHolidays";

export default function PublicHolidaysPage() {
    const { data: allData } = usePublicHolidays(1, "all", null);

    const [openModal, setOpenModal] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [selectedHoliday, setSelectedHoliday] = useState(null);

    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    const crumbs = segments.map((seg, idx) => {
        const href = "/" + segments.slice(0, idx + 1).join("/");
        return { name: seg[0].toUpperCase() + seg.slice(1), href };
    });

    const { mutateAsync: createHoliday } = useCreatePublicHolidays();
    const { mutateAsync: editPublicHolidays } = useEditPublicHolidays();

    const menuItems = [
        { href: "/structure/offices", icon: "/icons/office_img.svg", label: "Offices" },
        { href: "/structure/departments", icon: "/icons/departments_img.svg", label: "Departments" },
        { href: "/structure/positions", icon: "/icons/positions_img.svg", label: "Positions" },
        { href: "/structure/public-holidays", icon: "/icons/public_holidays.svg", label: "Public Holidays" },
    ];

    const handleAddSubmit = async (e) => {
        e.preventDefault();

        try {
            await createHoliday({ name, date });
            setName("");
            setDate("");
            setOpenModal(false);
        } catch (error) {
            console.error("Failed to create holiday:", error);
        }
    };

    const handleEditClick = (holiday) => {
        setSelectedHoliday(holiday);
        setName(holiday.name || "");
        setDate(holiday.date || "");
        setOpenModalEdit(true);
    };


    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await editPublicHolidays({
                id: selectedHoliday.id,
                name,
                date,
            });
            setName("");
            setDate("");
            setSelectedHoliday(null);
            setOpenModalEdit(false);
        } catch (err) {
            console.log(err.message);
        }
    };

    return (
        <div className="space-y-4 p-6">
            <Breadcrumb className="flex items-center gap-2">
                <BreadcrumbItem href="/" icon={HiHome}>Home</BreadcrumbItem>
                {crumbs.map((c, i) => (
                    <BreadcrumbItem key={i} {...(c.name.toLowerCase() !== "structure" && { href: c.href })}>
                        {c.name}
                    </BreadcrumbItem>
                ))}
            </Breadcrumb>

            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mt-12">Public Holidays</h1>

            <div className="flex justify-end items-end h-full ">
                <Button onClick={() => setOpenModal(true)}>+ New Holiday</Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left menu */}
                <div className="bg-white p-4 rounded-lg shadow dark:bg-gray-800 md:w-[30%] w-full">
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
                                    className={`w-6 h-6 object-contain`}
                                    style={isActive ? { filter: "brightness(0) saturate(100%) invert(34%) sepia(99%) saturate(2461%) hue-rotate(194deg) brightness(95%) contrast(96%)" } : {}}
                                />
                                <span className={`font-medium ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-gray-100"}`}>
                  {item.label}
                </span>
                            </Link>
                        );
                    })}
                </div>

                {/* Right main content */}
                <div className="rounded-lg p-6 mb-6 shadow-sm bg-[#F9FAFB] dark:bg-gray-800 md:w-[69%] w-full">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeadCell>Name</TableHeadCell>
                                    <TableHeadCell>Date</TableHeadCell>
                                    <TableHeadCell>Actions</TableHeadCell>
                                </TableRow>
                            </TableHead>

                            <TableBody className="divide-y">
                                {allData?.data?.map((holiday) => (
                                    <TableRow key={holiday.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <TableCell className="font-medium text-gray-900 dark:text-white">{holiday.name}</TableCell>
                                        <TableCell>{holiday.date}</TableCell>
                                        <TableCell>
                                            <div onClick={() => handleEditClick(holiday)}>
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

            {/* Add Holiday Modal */}
            <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <ModalHeader>Add New Holiday</ModalHeader>
                <ModalBody>
                    <form onSubmit={handleAddSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="holiday-name" value="Holiday Name" />
                            <TextInput
                                id="holiday-name"
                                type="text"
                                required
                                placeholder="Enter holiday name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="holiday-date" value="Holiday Date" />
                            <TextInput
                                id="holiday-date"
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end space-x-2 pt-2">
                            <Button color="gray" onClick={() => setOpenModal(false)} type="button">Cancel</Button>
                            <Button color="success" type="submit">Save</Button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>

            {/* Edit Holiday Modal */}
            <Modal show={openModalEdit} onClose={() => setOpenModalEdit(false)}>
                <ModalHeader>Edit Holiday</ModalHeader>
                <ModalBody>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="edit-holiday-name" value="Holiday Name" />
                            <TextInput
                                id="edit-holiday-name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="edit-holiday-date" value="Holiday Date" />
                            <TextInput
                                id="edit-holiday-date"
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end space-x-2 pt-2">
                            <Button color="gray" onClick={() => setOpenModalEdit(false)} type="button">Cancel</Button>
                            <Button color="info" type="submit">Update</Button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        </div>
    );
}
