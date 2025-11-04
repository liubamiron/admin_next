'use client';

import {useParams} from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    Label,
    Tabs,
    TabItem,
    Table,
    TableHead,
    TableCell,
    TableRow, TableBody, TableHeadCell
} from "flowbite-react";
import {HiHome, HiOutlineCalendar} from "react-icons/hi";
import {useIdEmployee} from "@/hooks/users/useIdEmployee";
import {AiOutlineClockCircle, AiOutlineDownload} from "react-icons/ai";

export default function EmployeeViewPage() {
    const {id} = useParams();
    const {data: employee, isLoading: loadingEmployee, isError} = useIdEmployee(id);

    if (loadingEmployee) return <div>Loading employee...</div>;
    if (isError || !employee) return <div>Error loading employee.</div>;

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        const [year, month, day] = dateString.split("-").map(Number);
        return new Date(year, month - 1, day).toLocaleDateString();
    };

    const getDayName = (dayNumber) => {
        const days = {
            1: "Monday",
            2: "Tuesday",
            3: "Wednesday",
            4: "Thursday",
            5: "Friday",
            6: "Saturday",
            7: "Sunday",
        };
        return days[dayNumber] || dayNumber;
    };

    return (
        <div className="p-0 space-y-6 md:p-4">
            <Breadcrumb>
                <BreadcrumbItem href="/" icon={HiHome}>Home</BreadcrumbItem>
                <BreadcrumbItem href="/users/employees">Employees</BreadcrumbItem>
                <BreadcrumbItem>View</BreadcrumbItem>
            </Breadcrumb>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-12">View Employee</h2>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column */}
                <div className="space-y-2 bg-white p-4 rounded-lg shadow dark:bg-gray-800 md:w-[30%] w-full">
                    <div className="grid grid-cols-1 gap-6">
                        {employee.image ? (
                            <div className="flex flex-col items-center space-y-2 mt-4 mb-2">
                                <img
                                    src={`${process.env.NEXT_PUBLIC_IMG}/${employee.image}`}
                                    alt="Employee Image"
                                    className="w-60 h-auto  rounded-lg shadow-md border border-gray-200"
                                />
                            </div>
                        ) : (
                            <div className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500">
                                No file uploaded
                            </div>
                        )}

                        <div>
                            <Label>Status</Label>
                            <div className="flex items-center gap-2 mt-1">
                                <div
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 text-green-800 font-medium border border-green-200 shadow-sm">

                                    <span>{employee?.statusTitle || "—"}</span>
                                </div>
                            </div>

                        </div>
                        <div>
                            <Label>Type</Label>
                            <div
                                className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700">{employee?.type || "—"}</div>
                        </div>
                        <div>
                            <Label>Position</Label>
                            <div
                                className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700">{employee.position?.name || "—"}</div>
                        </div>

                        <div>
                            <Label>Date of Placement</Label>
                            <div
                                className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center gap-2 ">
                                <HiOutlineCalendar className="w-4 h-4 text-primary-700"/>
                                <span> {employee?.date_of_placement
                                    ? new Date(employee.date_of_placement).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "numeric",
                                        year: "numeric",
                                    })
                                    : "—"}
                                </span>
                            </div>
                        </div>

                        <div>
                            <Label>Date of Dismissal</Label>
                            <div
                                className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center gap-2 ">
                                <HiOutlineCalendar className="w-4 h-4 text-primary-700"/>
                                <span> {employee?.date_of_dismissal
                                    ? new Date(employee.date_of_dismissal).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "numeric",
                                        year: "numeric",
                                    })
                                    : "—"}
                                </span>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="md:w-[65%] w-full">
                    {/* Right Column with Tabs */}
                    <Tabs aria-label="Employee Tabs" variant="underline">
                        <TabItem title="General" active>
                            <div className="space-y-6">
                                <div className="rounded-lg p-6 shadow-sm space-y-6 bg-[#F9FAFB] dark:bg-gray-800">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label>First Name</Label>
                                            <div
                                                className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700">{employee?.first_name || "—"}</div>
                                        </div>
                                        <div>
                                            <Label>Last Name</Label>
                                            <div
                                                className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700">{employee?.last_name || "—"}</div>
                                        </div>
                                        <div>
                                            <Label>Date of Birth</Label>
                                            <div
                                                className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center gap-2 ">
                                                <HiOutlineCalendar className="w-4 h-4 "/>
                                                <span> {employee?.dob
                                                    ? new Date(employee.dob).toLocaleDateString("en-GB", {
                                                        day: "2-digit",
                                                        month: "numeric",
                                                        year: "numeric",
                                                    })
                                                    : "—"}
                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Gender</Label>
                                            <div
                                                className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700">{employee?.sex || "—"}</div>
                                        </div>
                                        <div>
                                            <Label>Marital Status</Label>
                                            <div
                                                className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700">{employee?.marital_status || "—"}</div>
                                        </div>

                                        <div>
                                            <Label>Citizenship</Label>
                                            <div
                                                className="px-3 py-2 min-h-[42px] border rounded-lg bg-gray-50 dark:bg-gray-700 flex flex-wrap gap-2 items-center">
                                                {Array.isArray(employee?.citizenship) && employee.citizenship.length > 0 ? (
                                                    employee.citizenship.map((citizen, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-3 py-1 rounded-[6px] bg-blue-100 text-blue-800 text-sm font-medium border border-blue-200"
                                                        >{citizen}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-500">—</span>
                                                )}
                                            </div>
                                        </div>

                                    </div>

                                    <div>
                                        <Label>Current Address</Label>
                                        <div
                                            className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700">{employee?.address || "—"}</div>
                                    </div>
                                </div>

                                <div className="mb-2">Phone Number</div>
                                <div className="rounded-lg p-6 shadow-sm space-y-6 bg-[#F9FAFB] dark:bg-gray-800">
                                    {Array.isArray(employee.phone) && employee.phone.length > 0 ? (
                                        employee.phone.map((p, idx) => (
                                            <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <Label>Phone</Label>
                                                    <div className="px-3 py-2 min-h-[42px] border rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center">
                                                        {p?.code && (p?.tel || p?.phone) ? `${p.code} ${p.tel || p.phone}` : "—"}
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label>Operator</Label>
                                                    <div
                                                        className="px-3 py-2 min-h-[42px] border rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center">
                                                        {p.operator || "—"}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        // Empty placeholders instead of "No phone numbers"
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <Label>Phone</Label>
                                                <div
                                                    className="px-3 py-2 min-h-[42px] border rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center">
                                                    —
                                                </div>
                                            </div>
                                            <div>
                                                <Label>Operator</Label>
                                                <div
                                                    className="px-3 py-2 min-h-[42px] border rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center">
                                                    —
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-2">Primary Contact</div>
                                <div className="rounded-lg p-6 shadow-sm space-y-6 bg-[#F9FAFB] dark:bg-gray-800">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label>Primary Contact Name</Label>
                                            <div
                                                className="px-3 py-2 min-h-[42px] border rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center">
                                                {employee?.primary_contact || "—"}
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Primary Contact Number</Label>
                                            <div
                                                className="px-3 py-2 min-h-[42px] border rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center">
                                                {employee?.primary_contact_phone || "—"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-2">Children</div>
                                <div className="rounded-lg p-6 shadow-sm space-y-6 bg-[#F9FAFB] dark:bg-gray-800">
                                    {Array.isArray(employee.children) && employee.children.length > 0 ? (
                                        employee.children.map((child, idx) => (
                                            <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div>
                                                    <Label>Child Name</Label>
                                                    <div
                                                        className="px-3 py-2 min-h-[42px] border rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center">
                                                        {child.name || "—"}
                                                    </div>
                                                </div>

                                                <div>
                                                    <Label>Gender</Label>
                                                    <div
                                                        className="px-3 py-2 min-h-[42px] border rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center">
                                                        {child.gender || "—"}
                                                    </div>
                                                </div>

                                                <div>
                                                    <Label>Date of Birth</Label>
                                                    <div
                                                        className="px-3 py-2 min-h-[42px] border rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center">
                                                        {child.dob
                                                            ? new Date(child.dob).toLocaleDateString()
                                                            : "—"}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        // Empty row for consistent layout
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <Label>Child Name</Label>
                                                <div
                                                    className="px-3 py-2 min-h-[42px] border rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center">—
                                                </div>
                                            </div>
                                            <div>
                                                <Label>Gender</Label>
                                                <div
                                                    className="px-3 py-2 min-h-[42px] border rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center">—
                                                </div>
                                            </div>
                                            <div>
                                                <Label>Date of Birth</Label>
                                                <div
                                                    className="px-3 py-2 min-h-[42px] border rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center">—
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="rounded-lg p-6 shadow-sm space-y-6 bg-[#F9FAFB] dark:bg-gray-800">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex flex-col space-y-2">
                                            <Label>Personal Email</Label>
                                            <div
                                                className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700">{employee?.email || "—"}</div>
                                        </div>
                                        <div>
                                            <Label>Personal Telegram</Label>
                                            <div
                                                className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700">{employee?.telegram || "—"}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg p-6 shadow-sm space-y-6 bg-[#F9FAFB] dark:bg-gray-800">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label>Education</Label>
                                            <div
                                                className="px-3 py-2 min-h-[42px] border rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center">
                                                {employee.education || "—"}
                                            </div>
                                        </div>


                                        <div>
                                            <Label>Languages</Label>
                                            <div
                                                className="px-3 py-2 min-h-[42px] border rounded-lg bg-gray-50 dark:bg-gray-700 flex flex-wrap gap-2 items-center">
                                                {Array.isArray(employee?.languages) && employee.languages.length > 0 ? (
                                                    employee.languages.map((language, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-3 py-1 rounded-[6px] bg-blue-100 text-blue-800 text-sm font-medium border border-blue-200"
                                                        >{language}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-500">—</span>
                                                )}
                                            </div>
                                        </div>

                                    </div>
                                </div>


                                <div className="rounded-lg p-6 shadow-sm space-y-6 bg-[#F9FAFB] dark:bg-gray-800">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label>Transport Type</Label>
                                            <div
                                                className="px-3 py-2 min-h-[42px] border rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center">
                                                {employee.transport_type || "—"}
                                            </div>
                                        </div>

                                        <div>
                                            <Label>Driver License</Label>
                                            <div
                                                className="px-3 py-2 min-h-[42px] border rounded-lg bg-gray-50 dark:bg-gray-700 flex flex-wrap gap-2 items-center">
                                                {Array.isArray(employee?.driver_license) && employee.driver_license.length > 0 ? (
                                                    employee.driver_license.map((item, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-3 py-1 rounded-[6px] bg-blue-100 text-blue-800 text-sm font-medium border border-blue-200"
                                                        >{item}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-500">—</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </TabItem>

                        <TabItem title="Company">
                            <div className="space-y-6">
                                <div className="rounded-lg p-6 shadow-sm space-y-6 bg-[#F9FAFB] dark:bg-gray-800">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label>Office</Label>
                                            <div
                                                className="px-3 py-2 min-h-[42px] border rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center">
                                                {employee?.office?.name || "—"}
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Department</Label>
                                            <div
                                                className="px-3 py-2 min-h-[42px] border rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center">
                                                {employee?.department?.name || "—"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-lg p-6 shadow-sm space-y-6 bg-[#F9FAFB] dark:bg-gray-800">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label>Position</Label>
                                            <div
                                                className="px-3 py-2 min-h-[42px] border rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center">
                                                {employee?.position?.name || "—"}
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Official Position</Label>
                                            <div
                                                className="px-3 py-2 min-h-[42px] border rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center">
                                                {employee?.official_position || "—"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg p-6 shadow-sm space-y-6 bg-[#F9FAFB] dark:bg-gray-800">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label>Work name</Label>
                                            <div
                                                className="px-3 py-2 min-h-[42px] border rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center">
                                                {employee?.work_name || "—"}
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Work email</Label>
                                            <div
                                                className="px-3 py-2 min-h-[42px] border rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center">
                                                {employee?.corporate_email || "—"}
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="rounded-lg p-6 shadow-sm space-y-6 bg-[#F9FAFB] dark:bg-gray-800">
                                    <div className="space-y-4">
                                        <Label>Shifts</Label>

                                        {employee?.shift?.length ? (
                                            employee.shift.map((shift, index) => (
                                                <div
                                                    key={shift.id || index}
                                                    className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700"
                                                >
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                                        {/* Start Time */}
                                                        <div>
                                                            <Label>Start Time</Label>
                                                            <div className="px-3 py-2 min-h-[42px] border rounded-lg bg-white/50 dark:bg-gray-800 flex items-center gap-2">
                                                              <AiOutlineClockCircle className="text-blue-600 w-5 h-5" /> {shift.start_time || "—"}
                                                            </div>
                                                        </div>

                                                        {/* End Time */}
                                                        <div>
                                                            <Label>End Time</Label>
                                                            <div className="px-3 py-2 min-h-[42px] border rounded-lg bg-white/50 dark:bg-gray-800 flex items-center gap-2">
                                                                <AiOutlineClockCircle className="text-blue-600 w-5 h-5" />{shift.end_time || "—"}
                                                            </div>
                                                        </div>

                                                        {/* Work Days */}
                                                        <div>
                                                            <Label>Work Days</Label>
                                                            <div className="px-3 py-2 min-h-[42px] border rounded-[4px] bg-white/50 dark:bg-gray-800 flex items-center flex-wrap gap-2">
                                                                {shift.work_days?.length ? (
                                                                    shift.work_days.map((day, i) => (
                                                                        <span
                                                                            key={i}
                                                                            className="px-3 py-1 text-sm font-medium text-blue-800 bg-blue-200 rounded-[4px] shadow-sm"
                                                                        >
                      {getDayName(day)}
                    </span>
                                                                    ))
                                                                ) : (
                                                                    <span className="text-gray-400">—</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-gray-500 text-sm">No shift data available.</div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </TabItem>
                        <TabItem title="Files">
                            <div className="rounded-lg p-6 shadow-sm space-y-6 bg-[#F9FAFB] dark:bg-gray-800">
                                <div className="space-y-4">


                                    {employee?.document?.length ? (
                                        employee.document.map((doc) => (
                                            <div
                                                key={doc.id}
                                                className="grid grid-cols-1 md:grid-cols-2 gap-6 "
                                            >
                                                {/* File Type */}
                                                <div>
                                                    <Label>File Type</Label>
                                                    <div className="px-3 mt-1 py-2 min-h-[42px] border rounded-lg bg-white/50 dark:bg-gray-800 flex items-center capitalize">
                                                        {doc.type || "—"}
                                                    </div>
                                                </div>

                                                {/* File Link */}
                                                <div>
                                                    <Label>File</Label>
                                                    <div className="px-3 py-2 mt-1 min-h-[42px] border rounded-lg bg-white/50 dark:bg-gray-800 flex items-center justify-between">
              <span className="truncate text-sm text-gray-700 dark:text-gray-300">
                {doc.file?.split("/").pop() || "—"}
              </span>

                                                        {doc.file && (
                                                            <a
                                                                href={`${process.env.NEXT_PUBLIC_IMG || ""}/${doc.file.replace(/^\/+/, "")}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="ml-3 inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-5 w-5 mr-1"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                    strokeWidth={2}
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="M13 16h-1v-4h-1m1-4h.01M12 20h9m-9 0a9 9 0 110-18 9 9 0 010 18z"
                                                                    />
                                                                </svg>
                                                                View
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-gray-500 text-sm">No documents available.</div>
                                    )}
                                </div>
                            </div>

                        </TabItem>
                        <TabItem title="Documents">
                            <div className="rounded-lg  shadow-sm space-y-6 bg-[#F9FAFB] dark:bg-gray-800">
                                <div className="space-y-4">

                                    {employee?.generated_documents?.length ? (
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHead>
                                                <TableRow>
                                                    <TableHeadCell>Template</TableHeadCell>
                                                    <TableHeadCell>Created By</TableHeadCell>
                                                    <TableHeadCell>Created At</TableHeadCell>
                                                    <TableHeadCell>Number (NR)</TableHeadCell>
                                                    <TableHeadCell>Actions</TableHeadCell>
                                                </TableRow>
                                                </TableHead>

                                                <TableBody className="divide-y">
                                                {employee.generated_documents.map((doc) => (
                                                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800" key={doc.id}>
                                                        <TableCell>{doc?.template_id || "—"}</TableCell>
                                                        <TableCell>{doc?.created_by || "—"}</TableCell>
                                                        <TableCell>
                                                            {doc.variables?.[1] || "—"}
                                                        </TableCell>
                                                        <TableCell>
                                                            {doc.variables?.[2] || "—"}
                                                        </TableCell>
                                                        <TableCell>
                                                            {doc.file_path ? (
                                                                <a
                                                                    href={`${process.env.NEXT_PUBLIC_IMG || ""}/${doc.file_path.replace(/^\/+/, "")}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                                                >
                                                                    <AiOutlineDownload className="mr-1 w-4 h-4" />
                                                                    Download
                                                                </a>
                                                            ) : (
                                                                <button
                                                                    disabled
                                                                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-not-allowed"
                                                                >
                                                                    No file
                                                                </button>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    ) : (
                                        <div className="text-gray-500 text-sm">No generated documents available.</div>
                                    )}
                                </div>
                            </div>

                        </TabItem>
                        <TabItem title="Notes">
                            <div className="rounded-lg  shadow-sm space-y-6 bg-[#F9FAFB] dark:bg-gray-800">
                                <div className="space-y-4">
                                    {employee?.received_notes?.length ? (
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHead>
                                                <TableRow>
                                                    <TableHeadCell>Commenter</TableHeadCell>
                                                    <TableHeadCell>Comment</TableHeadCell>
                                                    <TableHeadCell>Created At</TableHeadCell>
                                                </TableRow>
                                                </TableHead>
                                                <TableBody className="divide-y">
                                                {employee.received_notes.map((note) => (
                                                    <TableRow key={note.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                        {/* Commenter */}
                                                        <TableCell>{note.commenter_id || "—"}</TableCell>

                                                        {/* Comment (HTML content rendered safely) */}
                                                        <TableCell
                                                            dangerouslySetInnerHTML={{
                                                                __html: note.comment || "—",
                                                            }}
                                                        />
                                                        <TableCell>
                                                            {new Date(note.created_at).toLocaleString() || "—"}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    ) : (
                                        <div className="text-gray-500 text-sm">No received notes available.</div>
                                    )}
                                </div>
                            </div>

                        </TabItem>
                        <TabItem title="Day Off">



                                    {employee?.day_off?.length ? (
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHead>
                                                <TableRow>
                                                    <TableHeadCell>Type</TableHeadCell>
                                                    <TableHeadCell>Start Date</TableHeadCell>
                                                    <TableHeadCell>End Date</TableHeadCell>
                                                    <TableHeadCell>Created At</TableHeadCell>
                                                    <TableHeadCell>Reason</TableHeadCell>
                                                </TableRow>
                                                </TableHead>

                                                <TableBody className="divide-y">
                                                {employee.day_off.map((off) => (
                                                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800" key={off.id}>
                                                        {/* Type with color-coded badge */}
                                                        <TableCell>
                                                            <span
                                                                className={`px-3 py-1  rounded-[4px]  ${
                                                                    off.type === "vacation"
                                                                        ? "bg-blue-100 text-blue-500"
                                                                        : off.type === "sick"
                                                                            ? "bg-yellow-100 text-yellow-500"
                                                                            : off.type === "absent"
                                                                                ? "bg-red-100 text-red-500"
                                                                                : "bg-green-100 text-green-500"
                                                                }`}
                                                            >{off.type}
                                                            </span>
                                                        </TableCell>

                                                        {/* Start Date */}
                                                        <TableCell className="px-4 py-3 whitespace-nowrap">
                                                            {off.start || "—"}
                                                        </TableCell>

                                                        {/* End Date */}
                                                        <TableCell className="px-4 py-3 whitespace-nowrap">
                                                            {off.end || "—"}
                                                        </TableCell>

                                                        {/* Created At */}
                                                        <TableCell className="px-4 py-3 whitespace-nowrap">
                                                            {new Date(off.created_at).toLocaleDateString() || "—"}
                                                        </TableCell>

                                                        {/* Reason */}
                                                        <TableCell className="px-4 py-3 text-gray-700 dark:text-gray-300">
                                                            {off.reason || "—"}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    ) : (
                                        <div className="text-gray-500 text-sm">No day off records available.</div>
                                    )}
                        </TabItem>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
