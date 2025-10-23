// "use client";
//
// import {
//     Breadcrumb,
//     BreadcrumbItem, Button, Label, Modal, ModalBody, ModalHeader, Select,
//     Table, TableBody, TableCell,
//     TableHead, TableHeadCell, TableRow, TextInput,
// } from "flowbite-react";
// import {HiHome} from "react-icons/hi";
// import {usePathname} from "next/navigation";
// import Link from "next/link";
// import {useDepartments} from "@/hooks/useDepartments";
// import {useState} from "react";
// import {useOffices} from "@/hooks/useOffices";
//
//
// export default function DepartmentsPage() {
//     const {data: allData} = useDepartments(1, "all", null);
//     const { data: offices } = useOffices();
//
//     const [openModal, setOpenModal] = useState(false);
//     const [openModalEdit, setOpenModalEdit] = useState(false);
//     const [selectedOffice, setSelectedOffice] = useState("");
//     const [selectedManager, setSelectedManager] = useState("");
//     const [name, setName] = useState("");
//
//     const pathname = usePathname();
//     const segments = pathname.split("/").filter(Boolean);
//
//     const crumbs = segments.map((seg, idx) => {
//         const href = "/" + segments.slice(0, idx + 1).join("/");
//         return {name: seg[0].toUpperCase() + seg.slice(1), href};
//     });
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         console.log("New Position:", { name });
//         setName("");
//         setOpenModal(false);
//     };
//
//     const handleEditClick = (position) => {
//         setSelectedPosition(position);
//         setName(position.name || "");
//         setOpenModalEdit(true);
//     };
//
//     const handleEditSubmit = async (e) => {
//         e.preventDefault();
//         console.log("Updated position:", {
//             id: selectedPosition?.id,
//             name,
//         });
//         setSelectedPosition(null);
//         setOpenModalEdit(false);
//     };
//
//     const menuItems = [
//         { href: "/structure/offices", icon: "/icons/office_img.svg", label: "Offices" },
//         { href: "/structure/departments", icon: "/icons/departments_img.svg", label: "Departments" },
//         { href: "/structure/positions", icon: "/icons/positions_img.svg", label: "Positions" },
//         { href: "/structure/public-holidays", icon: "/icons/public_holidays.svg", label: "Public Holidays" },
//     ];
//
//
//     return (
//         <div className="space-y-6">
//             <Breadcrumb className="flex items-center gap-2">
//                 <BreadcrumbItem href="/" icon={HiHome}>Home</BreadcrumbItem>
//                 {crumbs.map((c, i) => (
//                     <BreadcrumbItem key={i} {...(c.name.toLowerCase() !== "structure" && {href: c.href})}>
//                         {c.name}
//                     </BreadcrumbItem>
//                 ))}
//             </Breadcrumb>
//             <h1>Departments</h1>
//             <div className="flex justify-between items-center">
//                 <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Positions</h2>
//                 <Button onClick={() => setOpenModal(true)}>+ New Department</Button>
//             </div>
//             <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-6">
//                 {/* Left side: Upload + selects */}
//                 <div className="space-y-2 bg-white p-4 rounded-lg shadow dark:bg-gray-800">
//                     {menuItems.map((item) => {
//                         const isActive = pathname === item.href;
//
//                         return (
//                             <Link
//                                 key={item.href}
//                                 href={item.href}
//                                 className={`flex items-center gap-3 p-3 rounded-lg transition
//                                     ${isActive
//                                     ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40"
//                                     : "hover:bg-gray-100 dark:hover:bg-gray-700"
//                                 }`}
//                             >
//                                 <img
//                                     src={item.icon}
//                                     alt={item.label}
//                                     className="w-6 h-6 object-contain"
//                                     style={{
//                                         filter: isActive
//                                             ? "brightness(0) saturate(100%) invert(34%) sepia(99%) saturate(2461%) hue-rotate(194deg) brightness(95%) contrast(96%)"
//                                             : "none",
//                                     }}
//                                 />
//                                 <span
//                                     className={`font-medium ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-gray-100"}`}
//                                 >
//                                     {item.label}
//                                 </span>
//                             </Link>
//                         );
//                     })}
//                 </div>
//
//                 {/* Right side: Main fields */}
//                 <div className="rounded-lg p-6 mb-6 shadow-sm space-y-6 bg-[#F9FAFB] dark:bg-gray-800">
//                     <div className="overflow-x-auto">
//                         <Table>
//                             <TableHead>
//                                 <TableRow>
//                                     <TableHeadCell>Office</TableHeadCell>
//                                     <TableHeadCell>Name</TableHeadCell>
//                                     <TableHeadCell>Manager</TableHeadCell>
//                                     <TableHeadCell>Employees Count</TableHeadCell>
//                                     <TableHeadCell>Actions</TableHeadCell>
//                                     {/*{showActionsColumn && <TableHeadCell>Actions</TableHeadCell>}*/}
//                                 </TableRow>
//                             </TableHead>
//
//                             <TableBody className="divide-y">
//                                 {allData?.data?.map((item) => (
//                                     <TableRow
//                                         key={item.id}
//                                         className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
//                                     >
//                                         <TableCell className="font-medium text-gray-900 dark:text-white">
//                                             {item.office_id}
//                                             {offices.data?.find((o) => o.id === item.office_id)?.name}
//
//                                         </TableCell>
//                                         <TableCell className="font-medium text-gray-900 dark:text-white">
//                                             {item.name}
//                                         </TableCell>
//                                         <TableCell className="font-medium text-gray-900 dark:text-white">
//                                             {item.manager_id}
//                                         </TableCell>
//                                         <TableCell>{item.userCount}</TableCell>
//                                         <TableCell>
//                                                 <Button size="xs" color="info">
//                                                     <img src="/icons/edit.svg" alt="edit" className="w-5 h-5" />
//                                                 </Button>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     </div>
//                 </div>
//             </div>
//
//             {/* ➕ Add Modal */}
//             <Modal show={openModal} onClose={() => setOpenModal(false)}>
//                 <ModalHeader>Add New Position</ModalHeader>
//                 <ModalBody>
//                     <form onSubmit={handleSubmit} className="space-y-4">
//                         <div>
//                             <Label htmlFor="name" value="Position Name" />
//                             <TextInput
//                                 id="name"
//                                 type="text"
//                                 required
//                                 placeholder="Enter position name"
//                                 value={name}
//                                 onChange={(e) => setName(e.target.value)}
//                             />
//                         </div>
//
//                         <div>
//                             <Select
//                                 id="edit-office"
//                                 required
//                                 value={selectedOffice}
//                                 onChange={(e) => setSelectedOffice(e.target.value)}
//                             >
//                                 <option value="">Select Office</option>
//                                 {offices?.data.map((office) => (
//                                     <option key={office.id} value={office.id}>
//                                         {office.name}
//                                     </option>
//                                 ))}
//                             </Select>
//                         </div>
//
//                         <div className="flex justify-end space-x-2 pt-2">
//                             <Button color="gray" onClick={() => setOpenModal(false)} type="button">
//                                 Cancel
//                             </Button>
//                             <Button color="success" type="submit">
//                                 Save
//                             </Button>
//                         </div>
//                     </form>
//                 </ModalBody>
//             </Modal>
//
//             {/* ✏ Edit Modal */}
//             <Modal show={openModalEdit} onClose={() => setOpenModalEdit(false)}>
//                 <ModalHeader>Edit Position</ModalHeader>
//                 <ModalBody>
//                     <form onSubmit={handleEditSubmit} className="space-y-4">
//                         <div>
//                             <Label htmlFor="edit-name" value="Position Name" />
//                             <TextInput
//                                 id="edit-name"
//                                 type="text"
//                                 required
//                                 placeholder="Enter position name"
//                                 value={name}
//                                 onChange={(e) => setName(e.target.value)}
//                             />
//                         </div>
//
//                         <div className="flex justify-end space-x-2 pt-2">
//                             <Button color="gray" onClick={() => setOpenModalEdit(false)} type="button">
//                                 Cancel
//                             </Button>
//                             <Button color="info" type="submit">
//                                 Update
//                             </Button>
//                         </div>
//                     </form>
//                 </ModalBody>
//             </Modal>
//
//         </div>
//     );
// };

"use client";

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
import { useDepartments } from "@/hooks/useDepartments";
import { useOffices } from "@/hooks/officies/useOffices";
import { useState } from "react";

export default function DepartmentsPage() {
    const { data: allData } = useDepartments(1, "all", null);
    const { data: offices } = useOffices();

    const [openModal, setOpenModal] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [selectedOffice, setSelectedOffice] = useState("");
    const [name, setName] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    const crumbs = segments.map((seg, idx) => ({
        name: seg[0].toUpperCase() + seg.slice(1),
        href: "/" + segments.slice(0, idx + 1).join("/"),
    }));

    const menuItems = [
        { href: "/structure/offices", icon: "/icons/office_img.svg", label: "Offices" },
        { href: "/structure/departments", icon: "/icons/departments_img.svg", label: "Departments" },
        { href: "/structure/positions", icon: "/icons/positions_img.svg", label: "Positions" },
        { href: "/structure/public-holidays", icon: "/icons/public_holidays.svg", label: "Public Holidays" },
    ];

    const resetForm = () => {
        setName("");
        setSelectedOffice("");
        setSelectedDepartment(null);
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        console.log("New Department:", { name, selectedOffice });
        resetForm();
        setOpenModal(false);
    };

    const handleEditClick = (department) => {
        setSelectedDepartment(department);
        setName(department.name || "");
        setSelectedOffice(department.office_id?.toString() || "");
        setOpenModalEdit(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        console.log("Updated Department:", { id: selectedDepartment?.id, name, selectedOffice });
        resetForm();
        setOpenModalEdit(false);
    };

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb className="flex items-center gap-2">
                <BreadcrumbItem href="/" icon={HiHome}>Home</BreadcrumbItem>
                {crumbs.map((c, i) => (
                    <BreadcrumbItem key={i} {...(c.name.toLowerCase() !== "structure" && { href: c.href })}>
                        {c.name}
                    </BreadcrumbItem>
                ))}
            </Breadcrumb>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Departments</h2>

            <div className="flex justify-between items-center">
                <Button onClick={() => setOpenModal(true)}>+ New Department</Button>
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
                <div className="rounded-lg p-6 mb-6 shadow-sm space-y-6 bg-[#F9FAFB] dark:bg-gray-800">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeadCell>Office</TableHeadCell>
                                    <TableHeadCell>Name</TableHeadCell>
                                    <TableHeadCell>Manager</TableHeadCell>
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
                                        <TableCell>{item?.userCount}</TableCell>
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
