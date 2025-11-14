'use client';

import { useParams } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, Button,  Label } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { useIdCandidate } from "@/hooks/candidates/useIdCandidate";
import {useTranslation} from "@/providers";
// import {useTransition} from "react";

export default function CandidateViewPage() {
    const { slug } = useParams(); // get ID from URL
    const { data: candidate, isLoading: loadingCandidate, isError } = useIdCandidate(slug);
    const {t} = useTranslation();
    if (loadingCandidate) return <div>Loading candidate...</div>;
    if (isError || !candidate) return <div>Error loading candidate.</div>;

    // Convert YYYY-MM-DD to local date string
    const formatDate = (dateString) => {
        if (!dateString) return "—";
        const [year, month, day] = dateString.split("-").map(Number);
        return new Date(year, month - 1, day).toLocaleDateString();
    };

    return (
        <div className="p-0 space-y-6 md:p-4">
            {/* Breadcrumb */}
            <Breadcrumb>
                <BreadcrumbItem href="/" icon={HiHome}>{t("Home")}</BreadcrumbItem>
                <BreadcrumbItem href="/candidates">{t("Candidates")}</BreadcrumbItem>
                <BreadcrumbItem>{t("View")}</BreadcrumbItem>
            </Breadcrumb>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-12">View Candidate</h2>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="space-y-2 bg-white p-4 rounded-lg shadow dark:bg-gray-800 md:w-[30%] w-full">
                    <div className="grid grid-cols-1 gap-6">
                {/* Left Column */}

                    <Label>Uploaded Image / Document</Label>
                    {candidate.file ? (
                        <div className="flex flex-col items-center space-y-2 mt-4 mb-2">
                            {/*<p className="text-sm font-medium">{candidate.file.name || candidate.file}</p>*/}
                            <Button
                                color="blue"
                                size="md"
                                onClick={() => window.open(`https://hrm.webng.life/file/${candidate.file}`, "_blank")}
                            >
                                Preview
                            </Button>
                        </div>
                    ) : (
                        <div className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500">No file uploaded</div>
                    )}

                        <div>
                    <Label>Office</Label>
                    <div className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700">{candidate.office?.name || "—"}</div>
                        </div>
                        <div>
                    <Label>Department</Label>
                    <div className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700">{candidate.department?.name || "—"}</div>
                        </div>
                        <div>
                    <Label>Position</Label>
                    <div className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700">{candidate.position?.name || "—"}</div>
                        </div>
                        <div>
                    <Label>Status &nbsp;</Label>
                        <div className="bg-primary-100 text-primary-800 px-4 py-2 rounded-lg inline-block">{candidate?.statusTitle || "—"}</div>
                        </div>
                </div>
                </div>

                {/* Right Column */}
                <div className="rounded-lg p-6 mb-6 shadow-sm space-y-6 bg-[#F9FAFB] dark:bg-gray-800 md:w-[65%] w-full">

                        <h2 className="text-xl font-semibold mb-4">{t("Candidate_Details")}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label>{t("First_Name")}</Label>
                                <div className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700">{candidate?.first_name || "—"}</div>
                            </div>
                            <div>
                                <Label>{t("Last_Name")}</Label>
                                <div className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700">{candidate?.last_name || "—"}</div>
                            </div>
                            <div>
                                <Label>{t("Date_of_Birth")}</Label>
                                <div className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700">{formatDate(candidate?.dob)}</div>
                            </div>
                            <div>
                                <Label>{t("Gender")}</Label>
                                <div className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700">
                                    {candidate.sex}
                                </div>
                            </div>
                            <div>
                                <Label>{t("Personal_Email")}</Label>
                                <div className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700">{candidate?.email || "—"}</div>
                            </div>
                            <div>
                                <Label>{t("Personal_Telegram")}</Label>
                                <div className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700">{candidate?.telegram || "—"}</div>
                            </div>
                        </div>


                    {/* Phones */}

                        {Array.isArray(candidate.phone) && candidate.phone.length > 0 ? candidate.phone.map((p, idx) => (
                            <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label>Phone</Label>
                                    <div className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700">
                                        {`${p.code || "+373"} ${p.tel || "—"}`}
                                    </div>
                                </div>
                                <div>
                                    <Label>Operator</Label>
                                    <div className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700">{p.operator || "—"}</div>
                                </div>
                            </div>
                        )) : (
                            <div>No phone numbers</div>
                        )}

                </div>
            </div>
        </div>
    );
}
