"use client";

import {useState, useMemo} from "react";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow,
    TextInput,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    BreadcrumbItem,
    Breadcrumb,
} from "flowbite-react";
import { FaFilter } from "react-icons/fa";
import { useEmployees } from "@/hooks/users/useEmployees";
import PaginationComponent from "@/components/pagination/PaginationComponent";
import { useAuthStore } from "@/store/useAuthStore";
import Select from "react-select";
import { HiHome } from "react-icons/hi";
import {usePathname, useRouter} from "next/navigation";
import {useTranslation} from "@/providers";
import {reactSelectHeightFix} from "@/components/ui/reactSelectHeightFix";

export default function EmployeesPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [filterOpen, setFilterOpen] = useState(false);
    const [columnsModalOpen, setColumnsModalOpen] = useState(false);
    const router = useRouter();
    const {t} = useTranslation();

    const [visibleColumns, setVisibleColumns] = useState({
        image: true,
        name: true,
        email: true,
        department: true,
        roles: false,
        position: true,
        status: true,
        shifts: true,
        date_of_dismissal: false,
        created_at: false,
        updated_at: false,
        actions: true
    });

    const [filters, setFilters] = useState({
        office: [],
        department: [],
        user_name: [],
        position: [],
        status: [],
        type: [],
        marital_status: [],
        citizenship: [],
        languages: [],
        driver_license: [],
        shift_start: "",
        shift_end: "",
        shift_day: [],
        roles: [],
        date_of_dismissal: "",
        created_at: "",
        updated_at: "",
    });

    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    const { data, isLoading, isError, error } = useEmployees(page);
    const canEditEmployees = useAuthStore((s) => s.edit_employees);
    const canViewEmployees = useAuthStore((s) => s.view_employees);
    const canViewPositions = useAuthStore((s) => s.view_positions);
    const canViewRoles = useAuthStore((s) => s.view_roles);

    const showActionsColumn = canEditEmployees || canViewEmployees;
    const showPositionsColumn = canViewPositions;
    const showRolesColumn = canViewRoles;

    const employees = data?.data || [];
    const current_page = data?.current_page || 1;
    const last_page = data?.last_page || 1;
    const per_page = data?.per_page || 1;
    const total = data?.total || 0;

    const FILTER_FIELDS = [
        "office",
        "department",
        "user_name",
        "position",
        "status",
        "type",
        "marital_status",
        "citizenship",
        "languages",
        "driver_license",
    ];

    const SHIFT_DAY_OPTIONS = [
        { value: "1", label: "Mon" },
        { value: "2", label: "Tue" },
        { value: "3", label: "Wed" },
        { value: "4", label: "Thu" },
        { value: "5", label: "Fri" },
        { value: "6", label: "Sat" },
        { value: "7", label: "Sun" },
    ];

    // Build filter options dynamically
    const FILTER_OPTIONS_MAP = useMemo(() => {
        const map = {};
        FILTER_FIELDS.forEach((key) => {
            let values = [];
            employees.forEach((emp) => {
                switch (key) {
                    case "office": if (emp.office?.name) values.push(emp.office.name); break;
                    case "department": if (emp.department?.name) values.push(emp.department.name); break;
                    case "user_name": if (emp.full_name) values.push(emp.full_name); break;
                    case "position": if (emp.position?.name) values.push(emp.position.name); break;
                    case "status": if (emp.status) values.push(emp.status); break;
                    case "type": if (emp.type) values.push(emp.type); break;
                    case "marital_status": if (emp.marital_status) values.push(emp.marital_status); break;
                    case "citizenship": if (emp.citizenship) values.push(emp.citizenship); break;
                    case "languages": if (Array.isArray(emp.languages)) values.push(...emp.languages); break;
                    case "driver_license": if (emp.driver_license?.name) values.push(emp.driver_license.name); break;
                }
            });
            map[key] = [...new Set(values)].map(v => ({ value: v, label: v }));
        });
        return map;
    }, [employees]);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setFilters({
            office: [],
            department: [],
            user_name: [],
            position: [],
            status: [],
            type: [],
            marital_status: [],
            citizenship: [],
            languages: [],
            driver_license: [],
            shift_start: "",
            shift_end: "",
            shift_day: [],
        });
    };

    // Filtered employees
    const filteredEmployees = useMemo(() => {
        return employees.filter(emp => {
            const q = search.toLowerCase();
            const matchesSearch =
                !search.trim() ||
                emp.full_name?.toLowerCase().includes(q) ||
                emp.email?.toLowerCase().includes(q) ||
                emp.department?.name?.toLowerCase().includes(q) ||
                emp.position?.name?.toLowerCase().includes(q) ||
                emp?.status?.toLowerCase().includes(q) ||
                emp.roles?.some(r => r.name.toLowerCase().includes(q));

            if (!matchesSearch) return false;

            // Normal filters
            for (const key of FILTER_FIELDS) {
                const value = filters[key];
                if (!value || value.length === 0) continue;

                let fieldValue = (() => {
                    switch (key) {
                        case "office": return emp.office?.name || "";
                        case "department": return emp.department?.name || "";
                        case "user_name": return emp.full_name || "";
                        case "position": return emp.position?.name || "";
                        case "status": return emp.status || "";
                        case "type": return emp.type || "";
                        case "marital_status": return emp.marital_status || "";
                        case "citizenship": return emp.citizenship || "";
                        case "languages": return Array.isArray(emp.languages) ? emp.languages : [];
                        case "driver_license": return emp.driver_license?.name || "";
                        default: return "";
                    }
                })();

                const fieldArray = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
                const filterValues = value.map(v => String(v).toLowerCase());

                if (!fieldArray.some(fv => filterValues.includes(String(fv).toLowerCase()))) return false;
            }

            // Shift filters
            const { shift_start, shift_end, shift_day } = filters;
            if (shift_start || shift_end || (shift_day && shift_day.length > 0)) {
                return emp.shift?.some(s => {
                    const dayMatch = !shift_day?.length || s.work_days.some(d => shift_day.includes(d));
                    const startMatch = !shift_start || s.start_time >= shift_start + ":00";
                    const endMatch = !shift_end || s.end_time <= shift_end + ":00";
                    return dayMatch && startMatch && endMatch;
                });
            }

            return true;
        });
    }, [employees, search, filters]);

    if (isLoading) return <p>Loading employees…</p>;
    if (isError) return <p className="text-red-600">Error: {error.message}</p>;

    const crumbs = segments.map((seg, idx) => {
        const href = "/" + segments.slice(0, idx + 1).join("/");
        return { name: seg[0].toUpperCase() + seg.slice(1), href };
    });

    return (
        <div className="space-y-6">
            <Breadcrumb className="flex items-center gap-2">
                <BreadcrumbItem href="/" icon={HiHome}>{t("Home")}</BreadcrumbItem>
                {crumbs.map((c, i) => (
                    <BreadcrumbItem key={i} {...(c.name.toLowerCase() !== "users" && { href: c.href })}>
                        {t(c.name)}
                    </BreadcrumbItem>
                ))}
            </Breadcrumb>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{t("Employees")}</h2>

            <Button  onClick={() => router.push('/users/employees/add')} className={"text-end align-end"}>{t("Add_Employee")}</Button>

            <div className="flex  justify-between gap-4 flex-col md:flex-row">
                <div className="flex gap-2">
                    <Button
                        onClick={() => setFilterOpen(true)}
                        outline
                        aria-label="Open filter"
                        className="bg-gray-50 hover:bg-gray-100 hover:border-gray-300 border-gray-300 text-gray-500 flex items-center justify-center"
                    >
                        <FaFilter className="h-5 w-5 text-gray-500" />
                    </Button>

                    <Button
                        onClick={() => setColumnsModalOpen(true)}
                        color="alternative"
                    >
                        Columns
                    </Button>
                </div>

                <TextInput
                    type="text"
                    placeholder="Search by params..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-64"
                />
            </div>

            <Modal show={columnsModalOpen} onClose={() => setColumnsModalOpen(false)}
            >
                <div className="max-w-[600px] w-full mx-auto">
                <ModalHeader>Customize Columns</ModalHeader>
                <ModalBody className="space-y-4">
                    {/* Individual Columns */}
                    {["roles", "date_of_dismissal", "created_at", "updated_at"].map(key => (
                        <div key={key} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={visibleColumns[key]}
                                onChange={() =>
                                    setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }))
                                }
                                id={`col-${key}`}
                                className="w-4 h-4 accent-blue-600"
                            />
                            <label htmlFor={`col-${key}`} className="capitalize font-medium text-gray-700">
                                {key.replace("_", " ")}
                            </label>
                        </div>
                    ))}
                </ModalBody>

                <ModalFooter className="flex justify-between gap-3 pt-4 ">
                    <div className="flex items-center gap-2 ">
                        <input
                            type="checkbox"
                            checked={Object.values(visibleColumns).every(v => v)}
                            onChange={(e) => {
                                const newState = ["roles", "date_of_dismissal", "created_at", "updated_at"].reduce((acc, key) => {
                                    acc[key] = e.target.checked;
                                    return acc;
                                }, {});
                                setVisibleColumns(prev => ({ ...prev, ...newState }));
                            }}
                            id="select-all-columns"
                            className="w-4 h-4"
                        />
                        <label htmlFor="select-all-columns" className="font-medium text-gray-700">
                            Select All
                        </label>
                    </div>
                    <Button onClick={() => setColumnsModalOpen(false)} color="blue">Apply</Button>
                </ModalFooter>
                </div>
            </Modal>

            <Modal show={filterOpen} onClose={() => setFilterOpen(false)}
            >
                <ModalHeader>Filters</ModalHeader>
                <ModalBody className="overflow-y-auto">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {FILTER_FIELDS.map(key => (
                            <div key={key}>
                                <label className="block mb-1 font-medium">
                                    {key.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}
                                </label>
                                <Select
                                    isMulti
                                    options={FILTER_OPTIONS_MAP[key] || []}
                                    value={FILTER_OPTIONS_MAP[key]?.filter(opt => (filters[key] || []).includes(opt.value))}
                                    onChange={selected => handleFilterChange(key, selected?.map(opt => opt.value) || [])}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    placeholder={`Select ${key}`}
                                    styles={{
                                        multiValue: provided => ({ ...provided, backgroundColor: "#DBEAFE" }),
                                        multiValueLabel: provided => ({ ...provided, color: "#1D4ED8", fontWeight: 500 }),
                                        multiValueRemove: provided => ({ ...provided, color: "#1D4ED8", ":hover": { color: "#000" } }),
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="pt-6">
                            <div className="grid grid-cols-3 gap-4 items-end w-full">
                                <div>
                                    <label className="block mb-1 font-medium">Start Time</label>
                                    <input
                                        type="time"
                                        value={filters.shift_start}
                                        onChange={e => handleFilterChange("shift_start", e.target.value)}
                                        className="w-full border rounded px-2 py-1"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 font-medium">End Time</label>
                                    <input
                                        type="time"
                                        value={filters.shift_end}
                                        onChange={e => handleFilterChange("shift_end", e.target.value)}
                                        className="w-full border rounded px-2 py-1"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 font-medium">Workdays</label>
                                    <Select
                                        isMulti
                                        options={SHIFT_DAY_OPTIONS}
                                        value={SHIFT_DAY_OPTIONS.filter(opt => filters.shift_day.includes(opt.value))}
                                        onChange={selected => handleFilterChange("shift_day", selected?.map(opt => opt.value) || [])}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        placeholder="Select Workdays"
                                        styles={reactSelectHeightFix}
                                    />
                                </div>
                            </div>
                    </div>
                </ModalBody>
                <ModalFooter className="flex justify-between">
                    <Button color="gray" onClick={resetFilters}>Reset Filters</Button>
                    <Button onClick={() => setFilterOpen(false)}>Apply</Button>
                </ModalFooter>
            </Modal>

            <div className="overflow-x-auto">
                <Table>
                    <TableHead>
                        <TableRow>
                            {visibleColumns.image && <TableHeadCell>Image</TableHeadCell>}
                            {visibleColumns.name && <TableHeadCell>Name</TableHeadCell>}
                            {visibleColumns.email && <TableHeadCell>Email</TableHeadCell>}
                            {visibleColumns.department && <TableHeadCell>Department</TableHeadCell>}
                            {visibleColumns.roles && showRolesColumn && <TableHeadCell>Roles</TableHeadCell>}
                            {visibleColumns.position && showPositionsColumn && <TableHeadCell>Position</TableHeadCell>}
                            {visibleColumns.status && <TableHeadCell>Status</TableHeadCell>}
                            {visibleColumns.shifts && <TableHeadCell className="min-w-[250px]">Shifts</TableHeadCell>}
                            {visibleColumns.date_of_dismissal && <TableHeadCell>Date of dismissal</TableHeadCell>}
                            {visibleColumns.created_at && <TableHeadCell>Created at</TableHeadCell>}
                            {visibleColumns.updated_at && <TableHeadCell>Updated at</TableHeadCell>}
                            {visibleColumns.actions && showActionsColumn && <TableHeadCell className="text-center">Actions</TableHeadCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredEmployees.length > 0 ? filteredEmployees.map(emp => (
                            <TableRow key={emp.id} className="bg-white dark:bg-gray-800">
                                {visibleColumns.image && (
                                    <TableCell>
                                        <img src={emp.image ? `https://hrm.webng.life/file/${emp.image}` : "/images/default_img.png"} className="w-10 h-10 rounded-full object-cover" alt="img"/>
                                    </TableCell>
                                )}
                                {visibleColumns.name && <TableCell>{emp.full_name}</TableCell>}
                                {visibleColumns.email && <TableCell>{emp.email}</TableCell>}
                                {visibleColumns.department && <TableCell>{emp.department?.name}</TableCell>}
                                {visibleColumns.roles && showRolesColumn && (
                                    <TableCell>
                                        {emp.roles?.map(r => (
                                            <span key={r.id} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1">
                                                {r.name}
                                            </span>
                                        ))}
                                    </TableCell>
                                )}
                                {visibleColumns.position && showPositionsColumn && <TableCell>{emp.position?.name}</TableCell>}
                                {visibleColumns.status && (
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            emp.status === "active" ? "bg-green-100 text-green-800" :
                                                emp.status === "absent" ? "bg-purple-100 text-purple-800" :
                                                    emp.status === "vocation" ? "bg-blue-100 text-blue-800" :
                                                        emp.status === "sick" ? "bg-yellow-100 text-yellow-600" :
                                                            emp.status === "dismissed" ? "bg-red-100 text-red-800" :
                                                                "bg-gray-400 text-gray-800"
                                        }`}>{emp.statusTitle}</span>
                                    </TableCell>
                                )}
                                {visibleColumns.shifts && (
                                    <TableCell className="min-w-[250px]">
                                        {emp.shift?.map(s => (
                                            <div key={s.id}>
                                                {s.work_days.map(d => SHIFT_DAY_OPTIONS.find(o => o.value === d)?.label).join(", ")} - {s.start_time} - {s.end_time}
                                            </div>
                                        ))}
                                    </TableCell>
                                )}
                                {visibleColumns.date_of_dismissal && (
                                    <TableCell>
                                        {emp?.date_of_dismissal
                                            ? new Date(emp.date_of_dismissal).toLocaleString("md-MD", {
                                                year: "numeric",
                                                month: "short",
                                                day: "2-digit",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })
                                            : "-"}
                                    </TableCell>
                                )}
                                {visibleColumns.created_at && (
                                    <TableCell>
                                        {emp?.created_at
                                            ? new Date(emp.created_at).toLocaleString("md-MD", {
                                                year: "numeric",
                                                month: "short",
                                                day: "2-digit",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })
                                            : "-"}
                                    </TableCell>
                                )}
                                {visibleColumns.updated_at && (
                                    <TableCell>
                                        {emp?.updated_at
                                            ? new Date(emp.updated_at).toLocaleString("md-MD", {
                                                year: "numeric",
                                                month: "short",
                                                day: "2-digit",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })
                                            : "-"}
                                    </TableCell>
                                )}
                                {visibleColumns.actions && showActionsColumn && (
                                    <TableCell className="text-center">
                                        <div className="flex items-center gap-3 justify-center">
                                            {canEditEmployees && (
                                                <Link href={`/users/employees/${emp.id}/edit`} className="text-blue-600 hover:underline" prefetch={false}>
                                                    <img src="/icons/edit.svg" alt="edit" className="w-5 h-5 min-w-[25px]"/>
                                                </Link>
                                            )}
                                            {canViewEmployees && (
                                                <Link href={`/users/employees/${emp.id}/view`} className="text-blue-600 hover:underline" prefetch={false}>
                                                    <img src="/icons/eye.svg" alt="view" className="w-5 h-5 min-w-[25px]"/>
                                                </Link>
                                            )}
                                        </div>
                                    </TableCell>
                                )}
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={visibleColumns.length} className="text-center text-gray-500">No employees found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                    Showing {(current_page - 1) * per_page + 1} to {Math.min(current_page * per_page, total)} of {total} users
                </p>
                <PaginationComponent currentPage={current_page} totalPages={last_page} onPageChange={p => setPage(p)} />
            </div>
        </div>
    );
}
