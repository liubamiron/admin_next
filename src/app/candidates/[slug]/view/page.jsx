'use client';

import { useEffect, useState } from "react";
import {useParams, useRouter} from "next/navigation";
import {Breadcrumb, BreadcrumbItem, Button, Datepicker, FileInput, Label, TextInput} from "flowbite-react";
import {HiHome, HiMinus,} from "react-icons/hi";
import Select from "react-select";
import {useIdCandidate} from "@/hooks/candidates/useIdCandidate";
import {useDepartments} from "@/hooks/useDepartments";
import {usePositions} from "@/hooks/usePositions";
import {useOffices} from "@/hooks/useOffices";
import {countryOptions, genderOptions, operatorOptions} from "@/components/constants/filterOptions";

export default function CandidateViewPage() {
    const { slug } = useParams(); // ✅ get ID from URL
    const { data: candidate, isLoading: loadingCandidate } = useIdCandidate(slug);
    const {data: departmentsData = [], isLoading: depLoading} = useDepartments();
    const {data: positionsData = [], isLoading: posLoading} = usePositions();
    const {data: officesData = [], isLoading: offLoading} = useOffices();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [telegram, setTelegram] = useState("");
    const [fileName, setFileName] = useState("");
    const [departments, setDepartments] = useState(null);
    const [offices, setOffices] = useState(null);
    const [positions, setPositions] = useState(null);
    const [gender, setGender] = useState(null);
    const [dob, setDob] = useState("");
    const [phones, setPhones] = useState([{ phone: "", operator: "", countryCode: "+373" }]);
    const [mounted, setMounted] = useState(false);


    // Convert YYYY-MM-DD to a Date object in local timezone
    const parseDob = (dateString) => {
        if (!dateString) return null;
        const [year, month, day] = dateString.split("-").map(Number);
        return new Date(year, month - 1, day);
    };

    useEffect(() => setMounted(true), []);

// Prefill form when candidate data loads
    useEffect(() => {
        if (!candidate) return;

        // Handle phone normalization
        let phoneArray = [];

        if (typeof candidate.phone === "string") {
            try {
                phoneArray = JSON.parse(candidate.phone);
            } catch (err) {
                console.error("Failed to parse phone JSON:", err);
                phoneArray = [];
            }
        } else if (Array.isArray(candidate.phone)) {
            phoneArray = candidate.phone;
        }

        setPhones(
            phoneArray.length
                ? phoneArray.map((p) => ({
                    phone: p.tel,
                    operator: p.operator,
                    countryCode: p.code,
                }))
                : [{ phone: "", operator: "", countryCode: "+373" }]
        );

        // Prefill other fields
        setFirstName(candidate.first_name || "");
        setLastName(candidate.last_name || "");
        setEmail(candidate.email || "");
        setTelegram(candidate.telegram || "");
        setFileName(candidate.file || "");
        setDepartments(
            candidate.department_id
                ? { value: candidate.department_id, label: candidate.department.name }
                : null
        );
        setOffices(
            candidate.office_id ? { value: candidate.office_id, label: candidate.office.name } : null
        );
        setPositions(
            candidate.position_id
                ? { value: candidate.position_id, label: candidate.position.name }
                : null
        );
        setGender(candidate.sex ? genderOptions.find((g) => g.value === candidate.sex) : null);
        setDob(parseDob(candidate.dob));
    }, [candidate]);



    const handleChange = (index, field, value) => {
        const updated = [...phones];
        updated[index][field] = value;
        setPhones(updated);
    };

    if (!mounted || loadingCandidate) return <div>Loading candidate...</div>;

    return (
        <div className="p-6 space-y-6">
            <Breadcrumb>
                <BreadcrumbItem href="/" icon={HiHome}>Home</BreadcrumbItem>
                <BreadcrumbItem href="/candidates">Candidates</BreadcrumbItem>
                <BreadcrumbItem>Edit</BreadcrumbItem>
            </Breadcrumb>

            <h2 className="text-xl font-semibold">View Candidate</h2>
                <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-6">
                    <div className="space-y-4 bg-white p-4 rounded-lg shadow dark:bg-gray-800">
                        <div className="w-full">
                            <Label htmlFor="dropzone-file" value="Upload Image or Document" />

                            <div className="flex flex-col items-center justify-center w-full">
                                <label
                                    htmlFor="dropzone-file"
                                    className="flex flex-col items-center justify-center w-full min-h-[200px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600"
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                        <svg
                                            aria-hidden="true"
                                            className="w-10 h-10 mb-3 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M7 16V4m0 0L3 8m4-4l4 4M13 8h8m0 0v12m0-12l-4 4m4-4l4 4"
                                            ></path>
                                        </svg>

                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG, PDF (max 10MB)</p>

                                        {fileName && (
                                            <div className="mt-3 flex flex-col items-center space-y-2">
                                                <p className="text-sm text-gray-700 font-medium">{fileName.name}</p>
                                                <Button
                                                    color="blue"
                                                    size="xs"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.open(`https://hrm.webng.life/file/${fileName}`, "_blank", "noopener,noreferrer");
                                                    }}
                                                >
                                                    Preview
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    <FileInput
                                        id="dropzone-file"
                                        className="hidden"
                                        accept="image/*,.pdf"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setFileName(file);
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label>Office</Label>
                            <Select
                                options={officesData}
                                value={offices}
                                onChange={setOffices}
                                isLoading={offLoading}
                                placeholder="Select office..."
                            />

                            <Label>Department</Label>
                            <Select
                                options={departmentsData}
                                value={departments}
                                onChange={setDepartments}
                                isLoading={depLoading}
                                placeholder="Select department..."
                            />

                            <Label>Position</Label>
                            <Select
                                options={positionsData}
                                value={positions}
                                onChange={setPositions}
                                isLoading={posLoading}
                                placeholder="Select position..."
                            />

                            <Label>Status</Label>
                            <br/>
                            <div
                                className="bg-primary-100 text-primary-800 px-4 py-2 rounded-lg inline-block"
                            >
                                {candidate.statusTitle}
                            </div>
                        </div>
                    </div>

                    <div>

                        <div className="rounded-lg p-6 mb-6 shadow-sm space-y-6 bg-[#F9FAFB] dark:bg-gray-800">

                            <h2 className="text-xl font-semibold mb-4">Candidate Details</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                                <div className="flex flex-col space-y-2">
                                    <Label>First Name</Label>
                                    <TextInput
                                        placeholder="First Name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <Label>Last Name</Label>
                                    <TextInput
                                        placeholder="Last Name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Date of Birth</Label>
                                    <Datepicker
                                        value={dob}
                                        // selected={dob}
                                        onChange={(date) => {
                                            if (date instanceof Date && !isNaN(date)) {
                                                setDob(date); // ✅ keep as Date
                                            } else {
                                                setDob(null);
                                            }
                                        }}
                                    />
                                </div>

                                <div className="flex flex-col space-y-2">
                                    <Label>Gender</Label>
                                    <Select
                                        options={genderOptions}
                                        value={gender}
                                        onChange={setGender}
                                        placeholder="Select gender..."
                                        required
                                    />
                                </div>

                                <div className="flex flex-col space-y-2">
                                    <Label>Personal Email</Label>
                                    <TextInput
                                        placeholder="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="flex flex-col space-y-2">
                                    <Label>Personal Telegram</Label>
                                    <TextInput
                                        placeholder="telegram"
                                        value={telegram}
                                        onChange={(e) => setTelegram(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="rounded-lg p-6 shadow-sm space-y-6 bg-[#F9FAFB] dark:bg-gray-800">
                            {phones.map((item, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">

                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor={`phone-${index}`} className="dark:text-white">
                                            Phone Number
                                        </Label>
                                        <div className="relative w-full border border-gray-300 rounded-lg">
                                            {/* Country Code Select */}
                                            <div className="absolute inset-y-0 left-0 flex items-center">
                                                <Select
                                                    value={countryOptions.find(opt => opt.value === item.countryCode) || countryOptions[0]}
                                                    onChange={(selected) => handleChange(index, "countryCode", selected.value)}
                                                    options={countryOptions}
                                                    classNamePrefix="react-select"
                                                    isSearchable={false}
                                                    className="text-[14px] width-[115px]"
                                                    styles={{
                                                        control: (provided) => ({
                                                            ...provided,
                                                            border: 'none',
                                                            boxShadow: 'none',
                                                            backgroundColor: 'transparent',
                                                        }),
                                                        indicatorsContainer: (provided) => ({
                                                            ...provided,
                                                            display: 'yes', // remove dropdown arrow
                                                        }),
                                                        valueContainer: (provided) => ({
                                                            ...provided,
                                                            padding: '0 0 0 6px',
                                                        }),
                                                        singleValue: (provided) => ({
                                                            ...provided,
                                                            color: 'inherit', // match text color
                                                        }),
                                                    }}
                                                />
                                            </div>

                                            {/* Phone Input */}
                                            <TextInput
                                                id={`phone-${index}`}
                                                placeholder="123 456 789"
                                                value={item.phone}
                                                onChange={(e) => handleChange(index, "phone", e.target.value)}
                                                className="pl-25  dark:bg-gray-700  dark:text-white focus:none countryselect"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-[2fr_auto] gap-4 items-end">
                                        {/* Operator */}
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor={`operator-${index}`} className="dark:text-white">
                                                Operator
                                            </Label>
                                            <Select
                                                id={`operator-${index}`}
                                                placeholder="Select an operator"
                                                options={operatorOptions}
                                                value={operatorOptions.find(opt => opt.value === item.operator) || null}
                                                onChange={(selected) => handleChange(index, "operator", selected?.value || "")}
                                            />
                                        </div>
                                    </div>
                                </div>

                            ))}
                        </div>
                    </div>
                </div>
        </div>
    );
}
