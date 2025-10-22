"use client";

import { useState, useMemo, useEffect } from "react";
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
    Breadcrumb,
    BreadcrumbItem,
} from "flowbite-react";
import { FaFilter } from "react-icons/fa";
import PaginationComponent from "@/components/pagination/PaginationComponent";
import { useAuthStore } from "@/store/useAuthStore";
import { useCandidates } from "@/hooks/candidates/useCandidates";
import { HiHome } from "react-icons/hi";
import { useRouter, useSearchParams } from "next/navigation";
import Select from "react-select";
import { usePositions } from "@/hooks/usePositions";

export default function CandidatesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [positionFilter, setPositionFilter] = useState(null);
    const [filterOpen, setFilterOpen] = useState(false);

    const [totalAllCandidates, setTotalAllCandidates] = useState(0);
    const [newCandidates, setNewCandidates] = useState(0);
    const [hiredCandidates, setHiredCandidates] = useState(0);
    const [declinedCandidates, setDeclinedCandidates] = useState(0);

    const { data: allData } = useCandidates(1, "all", null);
    const { data, isLoading, isError } = useCandidates(page, statusFilter, positionFilter?.value);
    const { data: positionsData = [] } = usePositions();

    const positionOptions = Array.isArray(positionsData?.data)
        ? positionsData.data.map((pos) => ({ value: pos.id, label: pos.name }))
        : [];

    const candidates = data?.data?.data || [];
    const total = data?.data?.total || 0;
    const currentPage = data?.data?.current_page || 1;
    const lastPage = data?.data?.last_page || 1;
    const perPage = data?.data?.per_page || 1;

    const canEditCandidates = useAuthStore((s) => s.edit_candidates);
    const canViewCandidates = useAuthStore((s) => s.view_candidates);
    const showActionsColumn = canEditCandidates || canViewCandidates;

    const statusOptions = [
        { label: "All", value: "all", color: "gray" },
        { label: "New", value: "new", color: "blue" },
        { label: "Hired", value: "hired", color: "green" },
        { label: "Declined", value: "declined", color: "red" },
    ];

    // Modal filters
    const [modalStatusFilter, setModalStatusFilter] = useState(statusOptions[0]);
    const [modalPositionFilter, setModalPositionFilter] = useState(null);

    // Initialize from URL on mount
    useEffect(() => {
        const status = searchParams.get("status") || "all";
        const positionId = searchParams.get("position_id");

        setStatusFilter(status);
        setModalStatusFilter(statusOptions.find((s) => s.value === status) || statusOptions[0]);

        const pos = positionId ? positionOptions.find((p) => p.value === Number(positionId)) : null;
        setPositionFilter(pos);
        setModalPositionFilter(pos);
    }, []); // only on mount

    // Update counts for badges
    useEffect(() => {
        if (!allData) return;
        setTotalAllCandidates(allData.data.total || 0);
        setNewCandidates(allData.full?.newStatus || 0);
        setHiredCandidates(allData.full?.hiredStatus || 0);
        setDeclinedCandidates(allData.full?.declinedStatus || 0);
    }, [allData]);

    const statusCounts = {
        all: totalAllCandidates,
        new: newCandidates,
        hired: hiredCandidates,
        declined: declinedCandidates,
    };

    const filteredCandidates = useMemo(() => {
        const q = search.toLowerCase();
        return candidates.filter(
            (c) =>
                !search.trim() ||
                c.full_name?.toLowerCase().includes(q) ||
                c.email?.toLowerCase().includes(q) ||
                c.position?.name?.toLowerCase().includes(q)
        );
    }, [candidates, search]);

    const updateQueryParams = (params) => {
        const newParams = new URLSearchParams(searchParams.toString());
        Object.entries(params).forEach(([key, value]) => {
            if (value === null || value === "all") newParams.delete(key);
            else newParams.set(key, value);
        });
        router.replace(`?${newParams.toString()}`);
    };

    const handleApplyFilters = () => {
        const status = modalStatusFilter?.value || "all";
        const position = modalPositionFilter || null;

        setStatusFilter(status);
        setPositionFilter(position);
        setPage(1);

        updateQueryParams({ status, position_id: position?.value || null, page: 1 });
        setFilterOpen(false);
    };

    const handleResetFilters = () => {
        setModalStatusFilter(statusOptions[0]);
        setModalPositionFilter(null);

        setStatusFilter("all");
        setPositionFilter(null);
        setPage(1);

        updateQueryParams({ status: "all", position_id: null, page: 1 });
    };

    if (isLoading) return <p>Loading candidates…</p>;
    if (isError) return <p className="text-red-600">Something went wrong...</p>;

    return (
        <div className="p-4 space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb aria-label="Breadcrumb">
                <BreadcrumbItem href="/" icon={HiHome}>
                    Home
                </BreadcrumbItem>
                <BreadcrumbItem>Candidates</BreadcrumbItem>
            </Breadcrumb>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Candidates</h2>

            {/* Add candidate button */}
            <div className="flex justify-end p-4">
                <Button onClick={() => router.push("/candidates/add")}>Add Candidate</Button>
            </div>

            {/* Filter Modal */}
            <Modal show={filterOpen} onClose={() => setFilterOpen(false)}>
                <div className="max-w-[600px] w-full mx-auto">
                    <ModalHeader className="m-5">Filters</ModalHeader>
                    <ModalBody>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="flex flex-col space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                                <Select
                                    value={modalStatusFilter}
                                    onChange={setModalStatusFilter}
                                    options={statusOptions}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Position</label>
                                <Select
                                    value={modalPositionFilter}
                                    onChange={setModalPositionFilter}
                                    options={positionOptions}
                                />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter className="flex justify-between">
                        <Button color="gray" onClick={handleResetFilters}>Reset</Button>
                        <Button onClick={handleApplyFilters}>Apply</Button>
                    </ModalFooter>
                </div>
            </Modal>

            {/* Search & Filter button */}
            <div className="flex justify-between items-center w-full mb-4">
                <Button onClick={() => setFilterOpen(true)} outline className="bg-gray-50 hover:bg-gray-100 hover:border-gray-300 border-gray-300 text-gray-500 flex items-center justify-center">
                    <FaFilter className="h-5 w-5 text-gray-500" />
                </Button>
                <TextInput
                    type="text"
                    placeholder="Search by name, email, position..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-64"
                />
            </div>

            {/* Status badges */}
            <div   className="
    grid grid-cols-2
    md:flex md:flex-row md:justify-center
    gap-4 bg-white p-4 rounded-lg mx-auto
    dark:border-gray-700 dark:bg-gray-800
  "
            >
                {statusOptions.map((status) => {
                    const bgLightMap = { all: "bg-blue-100", new: "bg-violet-100", hired: "bg-green-100", declined: "bg-red-100" };
                    const textColorMap = { all: "text-blue-800", new: "text-violet-800", hired: "text-green-800", declined: "text-red-800" };
                    const badgeBgMap = { all: "bg-blue-400", new: "bg-violet-500", hired: "bg-green-500", declined: "bg-red-500" };

                    return (
                        <div
                            key={status.value}
                            onClick={() => {
                                setStatusFilter(status.value);
                                setPage(1);
                                updateQueryParams({ status: status.value, page: 1 });
                            }}
                            className={`flex items-center justify-center px-4 py-2 rounded-full cursor-pointer transition ${
                                statusFilter === status.value ? `${bgLightMap[status.value]} ${textColorMap[status.value]}` : "text-gray-700"
                            }`}
                        >
                            <span>{status.label}</span>
                            <span className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full ${badgeBgMap[status.value]} text-white`}>
                                {statusCounts[status.value]}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Table */}
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
                            {showActionsColumn && <TableHeadCell>Actions</TableHeadCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody className="divide-y">
                        {filteredCandidates.map((c) => (
                            <TableRow key={c.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{c.first_name}</TableCell>
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{c.last_name}</TableCell>
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{c.email}</TableCell>
                                <TableCell>{c.office?.name}</TableCell>
                                <TableCell>{c.department?.name}</TableCell>
                                <TableCell>{c.position?.name}</TableCell>
                                <TableCell>{c.sex}</TableCell>
                                <TableCell>{c.dob}</TableCell>
                                <TableCell>
                                    <span className={`px-4 py-1 rounded-full text-xs font-medium ${
                                        c.status === "new" ? "bg-primary-100 text-primary-800" :
                                            c.status === "hired" ? "bg-green-100 text-green-800" :
                                                c.status === "declined" ? "bg-red-100 text-red-800" :
                                                    "bg-gray-100 text-gray-800"
                                    }`}>
                                        {c.status}
                                    </span>
                                </TableCell>
                                {showActionsColumn && (
                                    <TableCell>
                                        <div className="flex gap-3 justify-center">
                                            {canEditCandidates && <Link href={`/candidates/${c.id}/edit`} className="text-blue-600 hover:underline"><img src="/icons/edit.svg" alt="Edit" className="w-5 h-5"/></Link>}
                                            {canViewCandidates && <Link href={`/candidates/${c.id}/view`}><img src="/icons/eye.svg" alt="View" className="w-5 h-5"/></Link>}
                                        </div>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {(currentPage - 1) * perPage + 1} to {Math.min(currentPage * perPage, total)} of {total} candidates
                </p>
                <PaginationComponent currentPage={currentPage} totalPages={lastPage} onPageChange={setPage}/>
            </div>
        </div>
    );
}
