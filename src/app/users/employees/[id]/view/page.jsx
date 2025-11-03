'use client';

import {useParams} from "next/navigation";
import {Breadcrumb, BreadcrumbItem, Label, Tabs, Tab, TabItem} from "flowbite-react";
import {HiHome, HiOutlineBadgeCheck, HiOutlineCalendar} from "react-icons/hi";
import {useIdEmployee} from "@/hooks/users/useIdEmployee";

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

    return (
        <div className="space-y-4 p-6">
            {/* Breadcrumb */}
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
                                    src={`https://hrm.webng.life/file/${employee.image}`}
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
                                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 text-green-800 font-medium border border-green-200 shadow-sm">

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
                                            <div className="px-3 py-2 min-h-[42px] border rounded-lg bg-gray-50 dark:bg-gray-700 flex flex-wrap gap-2 items-center">
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
                                                    <div
                                                        className="px-3 py-2 min-h-[42px] border rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center">
                                                        {p?.code && p?.phone ? `${p.code} ${p.phone}` : "—"}
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
                                            <div className="px-3 py-2 min-h-[42px] border rounded-lg bg-gray-50 dark:bg-gray-700 flex flex-wrap gap-2 items-center">
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
                                            <div className="px-3 py-2 min-h-[42px] border rounded-lg bg-gray-50 dark:bg-gray-700 flex flex-wrap gap-2 items-center">
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
                            <div>Company details will go here</div>
                        </TabItem>

                        <TabItem title="Files">
                            <div>Files content here</div>
                        </TabItem>

                        <TabItem title="Documents">
                            <div>Documents content here</div>
                        </TabItem>

                        <TabItem title="Notes">
                            <div>Notes content here</div>
                        </TabItem>

                        <TabItem title="Day Off">
                            <div>Day off info here</div>
                        </TabItem>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
