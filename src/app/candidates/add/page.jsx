'use client';

import { useEffect, useState } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Datepicker,
    FileInput,
    Label,
    TextInput, Toast, ToastToggle,
} from "flowbite-react";
import {HiCheck, HiHome} from "react-icons/hi";
import {usePathname, useRouter} from "next/navigation";
import { useDepartments } from "@/hooks/departments/useDepartments";
import { usePositions } from "@/hooks/positions/usePositions";
import { useOffices } from "@/hooks/officies/useOffices";
import Select from "react-select";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateCandidate } from "@/hooks/candidates/useCreateCandidate";
import {
    countryOptions,
    genderOptions,
    operatorOptions,
} from "@/components/constants/filterOptions";
import {BsExclamation} from "react-icons/bs";
import {reactSelectHeightFix} from "@/components/ui/reactSelectHeightFix";

// ✅ Zod schema
const candidateSchema = z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email").min(1, "Email is required"),
    telegram: z.string().optional(),
    office_id: z.any().optional(),
    department_id: z.any().optional(),
    position_id: z.any().optional(),
    sex: z.string().min(1, "Gender is required"),
    dob: z.string().min(1, "Date of Birth is required"),
    phones: z
        .array(
            z.object({
                code: z.string().min(1),
                phone: z.string().min(1, "Phone is required"),
                operator: z.string().optional(),
            })
        )
        .nonempty("At least one phone number is required"),
    file: z.any().optional(),
});

export default function CandidateAddPage() {
    const { data: departmentsData = [], isLoading: depLoading } = useDepartments();
    const { data: positionsData = [], isLoading: posLoading } = usePositions();
    const { data: officesData = [], isLoading: offLoading } = useOffices();

    const router = useRouter();

    const officeOptions = Array.isArray(officesData.data)
        ? officesData.data.map((office) => ({
            value: office.id,
            label: office.name,
        }))
        : [];

    const departmentOptions = Array.isArray(departmentsData.data)
        ? departmentsData.data.map((dept) => ({
            value: dept.id,
            label: dept.name,
        }))
        : [];

    const positionOptions = Array.isArray(positionsData.data)
        ? positionsData.data.map((pos) => ({
            value: pos.id,
            label: pos.name,
        }))
        : [];

 console.log(officeOptions, 'officiesData')


    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(candidateSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            telegram: "",
            sex: "",
            dob: "",
            office_id: "",
            department_id: "",
            position_id: "",
            phones: [{ code: "+373", phone: "", operator: "" }],
            file: null,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "phones",
    });

    const [mounted, setMounted] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => setMounted(true), []);

    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);
    const crumbs = segments.map((seg, idx) => ({
        name: seg[0].toUpperCase() + seg.slice(1),
        href: "/" + segments.slice(0, idx + 1).join("/"),
    }));

    const createCandidate = useCreateCandidate();
    const [fileName, setFileName] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setValue("file", file);
        setFileName(file);
    };

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (key === "phones") {
                    formData.append("phone", JSON.stringify(value));
                } else if (key === "file" && value) {
                    formData.append("file", value);
                } else {
                    formData.append(key, value || "");
                }
            });

            await createCandidate.mutateAsync(formData);
            setSuccessMsg("Candidate created successfully!");
            console.log("✅ Candidate created successfully!");
            setTimeout(() => {
                router.push("/candidates");
            }, 2000);
        } catch (err) {
            console.error("❌ Error:", err);
            let rawMsg = err?.response?.data?.message || err?.message || "Failed to create candidate. Please try again.";

            // Extract from "Key" to first period
            const keyIndex = rawMsg.indexOf("Key");
            let cleanMsg = rawMsg;
            if (keyIndex !== -1) {
                const periodIndex = rawMsg.indexOf("(Connection: pgsql", keyIndex);
                cleanMsg = periodIndex !== -1 ? rawMsg.slice(keyIndex, periodIndex + 1) : rawMsg.slice(keyIndex);
            }

            setSuccessMsg("");
            setErrorMsg(cleanMsg);
        }
    };


    if (!mounted)
        return <div className="text-center text-gray-500">Loading form...</div>;

    return (
        <div className="p-0 space-y-6 md:p-6">
            {/* Breadcrumbs */}
            <Breadcrumb className="flex items-center gap-2">
                <BreadcrumbItem href="/" icon={HiHome}>
                    Home
                </BreadcrumbItem>
                {crumbs.map((c, i) => (
                    <BreadcrumbItem key={i} {...(c.name.toLowerCase() !== "users" && { href: c.href })}>
                        {c.name}
                    </BreadcrumbItem>
                ))}
            </Breadcrumb>

            <h2 className="text-xl font-semibold mb-4">Add Candidate</h2>

            {successMsg && (
                <Toast>
                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500">
                        <HiCheck className="h-5 w-5" />
                    </div>
                    <div className="ml-3 text-sm font-normal">{successMsg}</div>
                    <ToastToggle onDismiss={() => setSuccessMsg("")} />
                </Toast>
            )}

            {errorMsg && (
                <Toast>
                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500">
                        <BsExclamation className="h-5 w-5" />
                    </div>
                    <div className="ml-3 text-sm font-normal">{errorMsg}</div>
                    <ToastToggle onDismiss={() => setErrorMsg("")} />
                </Toast>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-6">
                    {/* Left side: Upload + selects */}
                    <div className="space-y-4 bg-white p-4 rounded-lg shadow dark:bg-gray-800">
                        <div>
                            <Label htmlFor="file" value="Upload Image or Document" />
                            <div className="flex items-center justify-center w-full">
                                <label
                                    htmlFor="file"
                                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700"
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
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
                                                        const url = URL.createObjectURL(fileName);
                                                        window.open(url, "_blank");
                                                    }}
                                                >
                                                    Preview
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    <FileInput
                                        id="file"
                                        type="file"
                                        accept="image/*,.pdf"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Office / Department / Position */}
                        <div className="space-y-4">
                            <Label>Office</Label>
                            <Select
                                options={officeOptions}
                                onChange={(val) => setValue("office_id", val?.value)}
                                isLoading={offLoading}
                                placeholder="Select office..."
                                styles={reactSelectHeightFix}
                            />

                            <Label>Department</Label>
                            <Select
                                options={departmentOptions}
                                onChange={(val) => setValue("department_id", val?.value)}
                                isLoading={depLoading}
                                placeholder="Select department..."
                                styles={reactSelectHeightFix}
                            />

                            <Label>Position</Label>
                            <Select
                                options={positionOptions}
                                onChange={(val) => setValue("position_id", val?.value)}
                                isLoading={posLoading}
                                placeholder="Select position..."
                                styles={reactSelectHeightFix}
                            />
                        </div>
                    </div>

                    {/* Right side: Main fields */}
                    <div>
                        <div className="rounded-lg p-6 mb-6 shadow-sm space-y-6 bg-[#F9FAFB] dark:bg-gray-800">
                            <h2 className="text-xl font-semibold mb-4">Candidate Details</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label>First Name</Label>
                                    <TextInput {...register("first_name")} placeholder="First Name" />
                                    {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message}</p>}
                                </div>

                                <div>
                                    <Label>Last Name</Label>
                                    <TextInput {...register("last_name")} placeholder="Last Name" />
                                    {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name.message}</p>}
                                </div>

                                <div>
                                    <Label>Date of Birth</Label>
                                    <Datepicker onChange={(date) => {
                                        if (date) setValue("dob", date.toISOString().split("T")[0]);
                                    }} />
                                    {errors.dob && <p className="text-red-500 text-sm">{errors.dob.message}</p>}
                                </div>


                                <div>
                                    <Label>Gender</Label>
                                    <Select
                                        options={genderOptions}
                                        onChange={(val) => setValue("sex", val?.value)}
                                        placeholder="Select gender..."
                                        styles={reactSelectHeightFix}
                                    />
                                    {errors.sex && <p className="text-red-500 text-sm">{errors.sex.message}</p>}
                                </div>

                                <div>
                                    <Label>Email</Label>
                                    <TextInput {...register("email")} placeholder="Email" />
                                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                                </div>

                                <div>
                                    <Label>Telegram</Label>
                                    <TextInput {...register("telegram")} placeholder="Telegram" />
                                </div>
                            </div>
                        </div>

                        {/* Phones */}
                        <div className="rounded-lg p-6 shadow-sm space-y-6 bg-[#F9FAFB] dark:bg-gray-800">
                            {fields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end"
                                >
                                    {/* Phone number block */}
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor={`phones.${index}.phone`} className="dark:text-white">
                                            Phone Number
                                        </Label>

                                        <div className="relative w-full border border-gray-300 rounded-lg dark:border-gray-600">
                                            {/* Country code select */}
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-1">
                                                <Select
                                                    value={
                                                        countryOptions.find(
                                                            (opt) => opt.value === watch(`phones.${index}.code`)
                                                        ) || countryOptions[0]
                                                    }
                                                    onChange={(selected) =>
                                                        setValue(`phones.${index}.code`, selected.value)
                                                    }
                                                    options={countryOptions}
                                                    classNamePrefix="react-select"
                                                    isSearchable={false}
                                                    className="text-[14px] w-[100px]"
                                                    styles={{
                                                        control: (provided) => ({
                                                            ...provided,
                                                            border: "none",
                                                            boxShadow: "none",
                                                            backgroundColor: "transparent",
                                                            minHeight: "40px",
                                                        }),
                                                        indicatorsContainer: (provided) => ({
                                                            ...provided,
                                                            display: "yes",
                                                        }),
                                                        valueContainer: (provided) => ({
                                                            ...provided,
                                                            padding: "0 0 0 6px",
                                                        }),
                                                        singleValue: (provided) => ({
                                                            ...provided,
                                                            color: "inherit",
                                                        }),
                                                       reactSelectHeightFix
                                                    }}
                                                />
                                            </div>

                                            {/* Phone input */}
                                            <TextInput
                                                id={`phones.${index}.phone`}
                                                {...register(`phones.${index}.phone`)}
                                                placeholder="123 456 789"
                                                className="pl-[105px] h-[42px] dark:bg-gray-700 dark:text-white border-none focus:none countryselect"
                                            />
                                        </div>
                                    </div>

                                    {/* Operator + Buttons */}
                                    <div className="grid grid-cols-1 md:grid-cols-[2fr_auto] gap-4 items-end">
                                        {/* Operator select */}
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor={`operator-${index}`} className="dark:text-white">
                                                Operator
                                            </Label>
                                            <Select
                                                options={operatorOptions}
                                                onChange={(val) =>
                                                    setValue(`phones.${index}.operator`, val?.value || "")
                                                }
                                                placeholder="Select operator..."
                                                classNamePrefix="react-select"
                                                styles={{
                                                    control: (provided) => ({
                                                        ...provided,
                                                        borderColor: "#d1d5db",
                                                        minHeight: "42px",
                                                        boxShadow: "none",
                                                        "&:hover": { borderColor: "#3b82f6" },
                                                    }),
                                                    reactSelectHeightFix
                                                }}
                                            />
                                        </div>

                                        {/* Add / Remove buttons (only for last item) */}
                                        {index === fields.length - 1 && (
                                            <div className="flex items-end gap-2 self-end">
                                                {/* Show "-" only if more than one phone */}
                                                {fields.length > 1 && (
                                                    <Button
                                                        color="failure"
                                                        onClick={() => remove(index)}
                                                        size="xs"
                                                        className="flex items-center justify-center h-[42px] w-[42px] rounded-lg border bg-red-700 hover:bg-red-800 text-white text-lg"
                                                    >
                                                        −
                                                    </Button>
                                                )}
                                                <Button
                                                    color="blue"
                                                    onClick={() =>
                                                        append({ code: "+373", phone: "", operator: "" })
                                                    }
                                                    size="xs"
                                                    className="flex items-center justify-center h-[42px] w-[42px] rounded-lg border bg-blue-700 hover:bg-blue-800 text-white text-lg"
                                                >
                                                    +
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                    {errors.phones?.[index]?.phone && (
                                        <p className="text-red-500 text-sm">
                                            {errors.phones[index].phone.message}
                                        </p>
                                    )}

                                </div>
                            ))}


                            {/* Submit / Cancel */}
                            <div className="flex flex-wrap gap-6 mt-4">
                                <Button type="submit" outline color="blue">
                                    Create
                                </Button>
                                <Button type="button" outline color="gray" onClick={() => router.push("/candidates")}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
