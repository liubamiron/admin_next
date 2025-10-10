'use client';

import {useEffect, useState} from "react";
import {Breadcrumb, BreadcrumbItem, Button, Datepicker, FileInput, Label, TextInput} from "flowbite-react";
import {HiHome, HiMinus} from "react-icons/hi";
import {usePathname} from "next/navigation";
import {useDepartments} from "@/hooks/useDepartments";
import {usePositions} from "@/hooks/usePositions";
import {useOffices} from "@/hooks/useOffices";
import Select from "react-select";
import z from "zod";
import {useCreateCandidate} from "@/hooks/candidates/useCreateCandidate";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";
import {countryOptions, genderOptions, operatorOptions} from "@/components/constants/filterOptions";

export default function CandidateAddPage() {
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
    const [phones, setPhones] = useState([{code: "+373", phone: "", operator: "", }]);

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);
    const crumbs = segments.map((seg, idx) => ({
        name: seg[0].toUpperCase() + seg.slice(1),
        href: "/" + segments.slice(0, idx + 1).join("/"),
    }));

    const createCandidate = useCreateCandidate();

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) setFileName(file.name);
    };

    const handleAddPhone = () => {
        setPhones([...phones, {code: "", phone: "", operator: ""}]);
    };

    const handleRemovePhone = (index) => {
        setPhones(phones.filter((_, i) => i !== index));
    };

    const candidateSchema = z.object({
        first_name: z.string().min(1, "First name is required"),
        last_name: z.string().min(1, "Last name is required"),
        phone: z.string().min(5, "Phone number is required"),
        // phones: z
        //     .array(
        //         z.object({
        //             code: z.string().min(1, "Country code required"),
        //             phone: z.string().min(5, "Phone number required"),
        //             operator: z.string().min(1, "Operator required"),
        //         })
        //     )
        //     .min(1, "At least one phone number is required"),
        email: z.email("Invalid email").min(1, "Email is required"),
        file: z.string().optional(),
        telegram: z.string().optional(),
        office_id: z.number().optional(),
        department_id: z.number().optional(),
        position_id: z.number().optional(),
        sex: z.string().min(1, "Gender is required"),
        dob: z.string().min(1, "Date of Birth is required"),

    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const candidateData = {
                first_name: firstName,
                last_name: lastName,
                email,
                sex: gender?.value || "",
                dob,
                phone: JSON.stringify(
                    phones.map(p => ({
                        code: p.code || "+373",
                        tel: p.phone || "",
                        operator: p.operator || "",
                    }))
                ),

                // phone: phone.map(p => ({
                //     code: p.code || "", // ensure string
                //     phone: p.phone || "",
                //     operator: p.operator || "",
                // })),
                office_id: offices?.value,
                department_id: departments?.value,
                position_id: positions?.value,
                telegram,
                file: fileName || "",
            };

            console.log(candidateData, 'json')

            // Validate
            const validatedData = candidateSchema.parse(candidateData);

            // Send JSON instead of FormData
            await createCandidate.mutateAsync({
                body: JSON.stringify(validatedData),
                headers: { 'Content-Type': 'application/json' },
            });

            console.log("✅ Candidate created successfully!");
        } catch (err) {
            console.error(err);
        }
    };

    if (!mounted) return <div className="text-center text-gray-500">Loading form...</div>;

    const handleChange = (index, field, value) => {
        const updated = [...phones];
        updated[index][field] = value;
        setPhones(updated);
    };


    return (
        <div className="p-0 space-y-6 md:p-6">
            <Breadcrumb className="flex items-center gap-2">
                <BreadcrumbItem href="/" icon={HiHome}>Home</BreadcrumbItem>
                {crumbs.map((c, i) => (
                    <BreadcrumbItem key={i} {...(c.name.toLowerCase() !== "users" && {href: c.href})}>
                        {c.name}
                    </BreadcrumbItem>
                ))}
            </Breadcrumb>

            <h2 className="text-xl font-semibold mb-4">Add Candidate</h2>

            <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-6">
                <div className="space-y-4 bg-white p-4 rounded-lg shadow dark:bg-gray-800">
                    <div className="w-full">
                        <Label htmlFor="dropzone-file" value="Upload Image or Document"/>
                        <div className="flex items-center justify-center w-full">
                            <label
                                htmlFor="dropzone-file"
                                className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600"
                            >
                                <div
                                    className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
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
                                    {fileName && <p className="mt-2 text-sm text-blue-600">{fileName}</p>}
                                </div>
                                <FileInput id="dropzone-file" className="hidden" onChange={handleFileChange}/>
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
                                    selected={dob ? new Date(dob) : null}
                                    onChange={(date) => {
                                        if (date instanceof Date && !isNaN(date)) {
                                            const formatted = date.toISOString().split("T")[0];
                                            setDob(formatted);
                                        } else {
                                            setDob("");
                                        }
                                    }}
                                />
                                {!dob && <p className="text-sm text-red-500 mt-1">Date of Birth is required</p>}
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
                                                value={countryOptions.find(opt => opt.value === item.code) || countryOptions[0]}
                                                onChange={(selected) => handleChange(index, "code", selected.value)}
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
                                            value={item.phone ?? ""}
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

                                    {/* Buttons */}
                                    <div className="flex items-end gap-2 self-end">
                                        {index === phones.length - 1 ? (<> {phones.length > 1 && (
                                                <Button color="failure" onClick={() => handleRemovePhone(index)}
                                                        size="xs"
                                                        className="flex items-center justify-center h-[42px] w-[42px] rounded-lg border bg-red-700 hover:bg-red-800 text-white text-lg"> - {/*<RiDeleteBin6Fill color="darkred" size="xs" />*/} </Button>)}
                                                <Button onClick={handleAddPhone}
                                                        className="flex items-center justify-center h-[42px] w-[42px] rounded-lg border bg-blue-700 hover:bg-blue-800 text-white text-lg"> + </Button> </>) :
                                            (<Button color="failure" onClick={() => handleRemovePhone(index)}
                                                     size="xs"
                                                     className="flex items-center justify-center h-[42px] text-white color-white">
                                                <HiMinus/>
                                            </Button>)
                                        }
                                    </div>
                                </div>
                            </div>

                        ))}

                        <div className="flex flex-wrap gap-6">
                            <Button outline color="blue" onClick={handleSubmit}>
                                Create
                            </Button>
                            <Button outline color="gray">
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}
