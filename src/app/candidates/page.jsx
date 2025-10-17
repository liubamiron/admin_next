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
    ModalFooter, Breadcrumb, BreadcrumbItem, Badge
} from "flowbite-react";
import {FaFilter} from "react-icons/fa";
import PaginationComponent from "@/components/pagination/PaginationComponent";
import {useAuthStore} from "@/store/useAuthStore";
import {useCandidates} from "@/hooks/candidates/useCandidates";
import {HiHome} from "react-icons/hi";
import {useRouter} from "next/navigation";
import Select from"react-select";


export default function CandidatesPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [filterOpen, setFilterOpen] = useState(false);

    const [filters, setFilters] = useState({
        position: "",
        status: "",
    });
    const router = useRouter();
    const SELECT_FILTERS = ["position", "status"];

    const {data, isLoading, isError, error} = useCandidates(page); // 🔹 hook to fetch candidates
    const canEditCandidates = useAuthStore((s) => s.edit_candidates);
    const canViewCandidates = useAuthStore((s) => s.view_candidates);

    const showActionsColumn = canEditCandidates || canViewCandidates;

    const candidates = data?.data || [];
    const current_page = data?.current_page || 1;
    const last_page = data?.last_page || 1;
    const per_page = data?.per_page || 1;
    const total = data?.total || 0;


    const dynamicPositionOptions = useMemo(() => {
        if (!candidates) return [];
        const positions = candidates
            .map((c) => c.position?.name)
            .filter(Boolean);

        return Array.from(new Set(positions)).map((name) => ({
            value: name,
            label: name,
        }));
    }, [candidates]);

    const dynamicStatusOptions = useMemo(() => {
        if (!candidates) return [];
        const statuses = candidates
            .map((c) => c.status)
            .filter(Boolean);
        return Array.from(new Set(statuses)).map((status) => ({
            value: status,
            label: status,
        }));
    }, [candidates]);

    const FILTER_OPTIONS_MAP = {
        position: dynamicPositionOptions,
        status: dynamicStatusOptions,
    };


    const filteredCandidates = useMemo(() => {
        return candidates.filter((c) => {
            const q = search.toLowerCase();
            const matchesSearch =
                !search.trim() ||
                c.full_name?.toLowerCase().includes(q) ||
                c.email?.toLowerCase().includes(q) ||
                c.position?.name?.toLowerCase().includes(q) ||
                (c.status)?.toLowerCase().includes(q);

            if (!matchesSearch) return false;

            return Object.entries(filters).every(([key, value]) => {
                if (!value) return true;
                let fieldValue = null;
                switch (key) {
                    case "position":
                        fieldValue = c.position?.name;
                        break;
                    case "status":
                        fieldValue = c.status;
                        break;
                }
                return fieldValue?.toLowerCase() === value.toLowerCase();
            });
        });
    }, [candidates, search, filters]);

    if (isLoading) return <p>Loading candidates…</p>;
    if (isError) return <p className="text-red-600">Error: {error.message}</p>;

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({...prev, [key]: value}));
    };

    const resetFilters = () => {
        const reset = {...filters};
        Object.keys(reset).forEach((key) => (reset[key] = ""));
        setFilters(reset);
    };

    return (
        <div className=" p-4 space-y-6 flex flex-col">
            <Breadcrumb aria-label="Breadcrumb">
                <BreadcrumbItem href="/" icon={HiHome}>
                    Home
                </BreadcrumbItem>
                <BreadcrumbItem>
                    Candidates
                </BreadcrumbItem>
            </Breadcrumb>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Candidates
            </h2>

            <div className="flex justify-end p-4">
                <Button onClick={() => router.push('/candidates/add')} >Add Candidate
                </Button>
            </div>
            <Modal
                show={filterOpen}
                onClose={() => setFilterOpen(false)}
            >
                <div className="max-w-[600px] w-full mx-auto">
                <ModalHeader className="m-5">Filters</ModalHeader>
                <ModalBody>
                    <div className="grid grid-cols-1 gap-6">
                        {SELECT_FILTERS.map((key) => (
                            <div key={key} className="flex flex-col space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                                    {key}
                                </label>
                                <Select
                                    placeholder={`Select ${key}`}
                                    value={
                                        filters[key]
                                            ? {
                                                value: filters[key],
                                                label: filters[key],
                                            }
                                            : null
                                    }
                                    onChange={(selected) =>
                                        handleFilterChange(key, selected ? selected.value : "")
                                    }
                                    options={FILTER_OPTIONS_MAP[key] || []}
                                    classNamePrefix="react-select"
                                    styles={{
                                        control: (provided, state) => ({
                                            ...provided,
                                            borderColor: state.isFocused
                                                ? "#3b82f6"
                                                : "#d1d5db",
                                            boxShadow: "none",
                                            minHeight: "42px",
                                            "&:hover": {
                                                borderColor: "#3b82f6",
                                            },
                                        }),
                                        menu: (provided) => ({
                                            ...provided,
                                            zIndex: 9999, // avoid overlap issues
                                        }),
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </ModalBody>
                <ModalFooter className="flex justify-between">
                    <Button color="gray" onClick={resetFilters}>
                        Reset Filters
                    </Button>
                    <Button onClick={() => setFilterOpen(false)}>Apply</Button>
                </ModalFooter>
                </div>
            </Modal>


            <div className="flex justify-between items-center w-full">
                <Button
                    onClick={() => setFilterOpen(true)}
                    outline
                    className="bg-gray-50 hover:bg-gray-100 hover:border-gray-300 border-gray-300 text-gray-500 flex items-center justify-center"
                >
                    <FaFilter className="h-5 w-5 text-gray-500"/>
                </Button>

                <TextInput
                    type="text"
                    placeholder="Search by name, email, position..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-64"
                />
            </div>

            <div className="flex justify-center gap-4 bg-white p-4 rounded-lg shadow dark:bg-gray-800 max-w-[400px] mx-auto">
                {/* All + Badge */}
                <div className="flex items-center gap-1">
                    <span>All</span>
                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold bg-gray-200 rounded-full">{candidates.total}</span>
                </div>
                <div className="flex items-center gap-1">
                    <span>New</span>
                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-blue-600 bg-blue-200 rounded-full">{candidates.filter((c) => c.status === "new").length}</span>
                </div>
                <div className="flex items-center gap-1">
                    <span>Hired</span>
                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-green-600 bg-green-200 rounded-full">{candidates.filter((c) => c.status === "hired").length}</span>
                </div>
                <div className="flex items-center gap-1">
                    <span>Declined</span>
                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-red-600 bg-red-200 rounded-full">{candidates.filter((c) => c.status === "declined").length}</span>
                </div>
            </div>
            <br/>

            <div className="overflow-x-auto">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeadCell>First Name</TableHeadCell>
                            <TableHeadCell>Last Name</TableHeadCell>
                            <TableHeadCell>Email</TableHeadCell>
                            <TableHeadCell>Office</TableHeadCell>
                            <TableHeadCell>Department</TableHeadCell>
                            <TableHeadCell>Position</TableHeadCell>
                            <TableHeadCell>Sex</TableHeadCell>
                            <TableHeadCell>Birth Date</TableHeadCell>
                            <TableHeadCell>Status</TableHeadCell>
                            {showActionsColumn && (
                                <TableHeadCell>Actions</TableHeadCell>
                            )}
                        </TableRow>
                    </TableHead>

                    <TableBody className="divide-y">
                        {filteredCandidates.map((c) => (
                            <TableRow key={c.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <TableCell
                                    className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{c.first_name}</TableCell>
                                <TableCell
                                    className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{c.last_name}</TableCell>
                                <TableCell
                                    className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{c.email}</TableCell>
                                <TableCell>{c.office?.name}</TableCell>
                                <TableCell>{c.department?.name}</TableCell>
                                <TableCell>{c.position?.name}</TableCell>
                                <TableCell>{c.sex}</TableCell>
                                <TableCell>{c.dob}</TableCell>
                                <TableCell>
            <span className={`px-4 py-1 rounded-full text-xs font-medium ${
                c.status === "new"
                    ? "bg-primary-100 text-primary-800"
                    : c.status === "hired"
                        ? "bg-green-100 text-green-800"
                        : c.status === "new_interviewed"
                            ? "bg-purple-100 text-purple-800"
                            : c.status === "declined"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
            }`}>{c.status}</span>
                                </TableCell>
                                {showActionsColumn && (
                                    <TableCell>
                                        <div className="flex gap-3 justify-center">
                                            {canEditCandidates && (
                                                <Link href={`/candidates/${c.id}/edit`}
                                                      className="text-blue-600 hover:underline">
                                                    <img src={"/icons/edit.svg"} alt="Edit" className="w-5 h-5"/>
                                                </Link>
                                            )}
                                            {canViewCandidates && (
                                                <Link href={`/candidates/${c.id}/view`}>
                                                    <img src={"/icons/eye.svg"} alt="Eye" className="w-5 h-5"/>
                                                </Link>
                                            )}
                                        </div>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {(current_page - 1) * per_page + 1} to{" "}
                    {Math.min(current_page * per_page, total)} of {total} candidates
                </p>
                <PaginationComponent
                    currentPage={current_page}
                    totalPages={last_page}
                    onPageChange={(p) => setPage(p)}
                />
            </div>
        </div>
    );
}
