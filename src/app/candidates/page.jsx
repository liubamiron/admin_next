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
    ModalFooter, Breadcrumb, BreadcrumbItem,
} from "flowbite-react";
import {FaFilter} from "react-icons/fa";
import PaginationComponent from "@/components/pagination/PaginationComponent";
import {useAuthStore} from "@/store/useAuthStore";
import {useCandidates} from "@/hooks/candidates/useCandidates";
import {HiHome} from "react-icons/hi";
import {useRouter} from "next/navigation";


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
        <div className="flex-1 p-4 space-y-6 min-h-screen">
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

            <Button  onClick={() => router.push('/candidates/add')} className={"text-end align-end"}>Add Candidate</Button>
            {/* Filter Modal */}
            <Modal
                show={filterOpen}
                onClose={() => setFilterOpen(false)}
                className="max-w-[600px] mx-auto mt-15"
            >
                <ModalHeader className="m-5">Filters</ModalHeader>
                <ModalBody>
                    <div className="grid grid-cols-1 gap-6">
                        {SELECT_FILTERS.map((key) => (
                            <select
                                key={key}
                                value={filters[key] || ""}
                                onChange={(e) => handleFilterChange(key, e.target.value)}
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="">Select {key}</option>
                                {(FILTER_OPTIONS_MAP[key] || []).map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        ))}
                    </div>
                </ModalBody>
                <ModalFooter className="flex justify-between">
                    <Button color="gray" onClick={resetFilters}>
                        Reset Filters
                    </Button>
                    <Button onClick={() => setFilterOpen(false)}>Apply</Button>
                </ModalFooter>
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

            <div className="overflow-x-auto ">
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
