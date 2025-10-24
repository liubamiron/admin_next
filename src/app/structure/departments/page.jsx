"use client"

import {
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Label,
    Modal,
    ModalBody,
    ModalHeader,
    Select,
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
import { useDepartments } from "@/hooks/departments/useDepartments";
import { useOffices } from "@/hooks/officies/useOffices";
import { useState } from "react";
import {useManagers} from "@/hooks/useManagers";
import {useCreatePublicHolidays} from "@/hooks/publicHolidays/useCreatePublicHolidays";
import {useEditPublicHolidays} from "@/hooks/publicHolidays/useEditPublicHolidays";
import {useCreateDepartment} from "@/hooks/departments/useCreateDepartment";
import {useEditDepartment} from "@/hooks/departments/useEditDepartment";

export default function DepartmentsPage() {
    const { data: allData } = useDepartments(1, "all", null);
    const { data: offices } = useOffices();
    const { data: managers } = useManagers();

    const [openModal, setOpenModal] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [selectedOffice, setSelectedOffice] = useState("");
    const [selectedManager, setSelectedManager] = useState("");
    const [name, setName] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    const crumbs = segments.map((seg, idx) => ({
        name: seg[0].toUpperCase() + seg.slice(1),
        href: "/" + segments.slice(0, idx + 1).join("/"),
    }));

    const { mutateAsync: createDepartment } = useCreateDepartment();
    const { mutateAsync: editDepartment } = useEditDepartment();

    const menuItems = [
        { href: "/structure/offices", icon: "/icons/office_img.svg", label: "Offices" },
        { href: "/structure/departments", icon: "/icons/departments_img.svg", label: "Departments" },
        { href: "/structure/positions", icon: "/icons/positions_img.svg", label: "Positions" },
        { href: "/structure/public-holidays", icon: "/icons/public_holidays.svg", label: "Public Holidays" },
    ];

    const resetForm = () => {
        setName("");
        setSelectedOffice("");
        setSelectedManager("");
        setSelectedDepartment(null);
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            name: name.trim(),
            office_id: Number(selectedOffice),
            manager_id: selectedManager ? Number(selectedManager) : null,
        };

        try {
            await createDepartment(payload);
            setName("");
            setSelectedOffice("");
            setSelectedManager("");
            setOpenModal(false);
        } catch (error) {
            console.log("Failed to create department:", error);
        }
    };

    const handleEditClick = (department) => {
        setSelectedDepartment(department);
        setName(department.name || "");
        setSelectedOffice(department.office_id?.toString() || "");
        setSelectedManager(department.manager_id?.toString() || "");
        setOpenModalEdit(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            id: selectedDepartment.id,
            name: name.trim(),
            office_id: Number(selectedOffice),
            manager_id: selectedManager ? parseInt(selectedManager, 10) : null,
        };

        console.log("Edit payload:", payload); // see payload before request

        try {
            await editDepartment(payload);
            setSelectedOffice("");
            setSelectedManager("");
            setOpenModalEdit(false);
        } catch (err) {
            console.log("Failed to edit department:", err.message);
        }
    };



    return (
        <div className="space-y-4 p-6">
            {/* Breadcrumb */}
            <Breadcrumb className="flex items-center gap-2">
                <BreadcrumbItem href="/" icon={HiHome}>Home</BreadcrumbItem>
                {crumbs.map((c, i) => (
                    <BreadcrumbItem key={i} {...(c.name.toLowerCase() !== "structure" && { href: c.href })}>
                        {c.name}
                    </BreadcrumbItem>
                ))}
            </Breadcrumb>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-12">Departments</h2>

            <div className="flex justify-end items-end">
                <Button onClick={() => setOpenModal(true)}>+ New Department</Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <div className="space-y-2 bg-white p-4 rounded-lg shadow dark:bg-gray-800 md:w-[30%] w-full">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 p-3 rounded-lg transition
                  ${isActive ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
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
                <div className="rounded-lg p-6 mb-6 shadow-sm space-y-6 bg-[#F9FAFB] dark:bg-gray-800 md:w-[60%] w-full">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeadCell>Office</TableHeadCell>
                                    <TableHeadCell>Name</TableHeadCell>
                                    <TableHeadCell>Manager</TableHeadCell>
                                    <TableHeadCell>Employees <br/>count</TableHeadCell>
                                    <TableHeadCell>Actions</TableHeadCell>
                                </TableRow>
                            </TableHead>

                            <TableBody className="divide-y">
                                {allData?.data?.map((item) => (
                                    <TableRow key={item.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <TableCell className="font-medium text-gray-900 dark:text-white">
                                            {offices?.data.find((o) => o.id === item?.office_id)?.name}
                                        </TableCell>
                                        <TableCell className="font-medium text-gray-900 dark:text-white">{item?.name}</TableCell>
                                        <TableCell> {managers?.[0]?.office?.departments?.find((o) => o.id === item?.manager_id)?.name}</TableCell>
                                        <TableCell className="font-medium text-gray-900 dark:text-white">{item?.userCount}</TableCell>
                                        <TableCell>
                                            <Button size="xs" color="info" onClick={() => handleEditClick(item)}>
                                                <img src="/icons/edit.svg" alt="edit" className="w-5 h-5" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* Add Modal */}
            <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <ModalHeader>Add New Department</ModalHeader>
                <ModalBody>
                    <form onSubmit={handleAddSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="add-office" value="Select Office" />
                            <Select
                                id="add-office"
                                required
                                value={selectedOffice}
                                onChange={(e) => setSelectedOffice(e.target.value)}
                            >
                                <option value="">Select Office</option>
                                {offices?.data.map((office) => (
                                    <option key={office.id} value={office.id}>
                                        {office.name}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="add-manager" value="Select Manager" />
                            <Select
                                id="add-manager"
                                value={selectedManager}
                                onChange={(e) => setSelectedManager(e.target.value)}
                            >
                                <option value="">Select Manager</option>
                                {managers?.[0]?.office?.departments?.map((manager) => (
                                    <option key={manager.id} value={manager.id}>
                                        {manager.name}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="add-name" value="Department Name" />
                            <TextInput
                                id="add-name"
                                type="text"
                                required
                                placeholder="Enter department name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end space-x-2 pt-2">
                            <Button color="gray" onClick={() => setOpenModal(false)} type="button">Cancel</Button>
                            <Button color="success" type="submit">Save</Button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>

            {/* Edit Modal */}
            <Modal show={openModalEdit} onClose={() => setOpenModalEdit(false)}>
                <ModalHeader>Edit Department</ModalHeader>
                <ModalBody>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="edit-office" value="Select Office" />
                            <Select
                                id="edit-office"
                                required
                                value={selectedOffice}
                                onChange={(e) => setSelectedOffice(e.target.value)}
                            >
                                <option value="">Select Office</option>
                                {offices?.data.map((office) => (
                                    <option key={office.id} value={office.id}>
                                        {office.name}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="edit-manager" value="Select Manager" />
                            <Select
                                id="edit-manager"
                                required
                                value={selectedManager}
                                onChange={(e) => setSelectedManager(e.target.value)}
                            >
                                {managers?.[0]?.office?.departments?.map((manager) => (
                                    <option key={manager.id} value={manager.id}>
                                        {manager.name}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="edit-name" value="Department Name" />
                            <TextInput
                                id="edit-name"
                                type="text"
                                required
                                placeholder="Enter department name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
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
