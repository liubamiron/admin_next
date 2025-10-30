'use client';

import { useEffect, useState } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Datepicker,
    FileInput,
    Label,
    TextInput,
    Toast,
    ToastToggle,
} from "flowbite-react";
import { HiCheck, HiHome } from "react-icons/hi";
import { BsExclamation } from "react-icons/bs";
import { usePathname, useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "react-select";
import {
    countryOptions,
    genderOptions,
    operatorOptions,
} from "@/components/constants/filterOptions";
import { reactSelectHeightFix } from "@/components/ui/reactSelectHeightFix";
import {useCreateEmployee} from "@/hooks/users/useCreateEmployee";

// ✅ Zod schema
const employeeSchema = z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email").min(1, "Email is required"),
    date_of_placement: z.string().min(1, "Date of placement is required"),
    sex: z.string().min(1, "Gender is required"),
    dob: z.string().min(1, "Date of Birth is required"),
    phone: z
        .array(
            z.object({
                code: z.string().min(1),
                phone: z.string().min(1, "Phone is required"),
                operator: z.string().optional(),
            })
        )
        .nonempty("At least one phone number is required"),
    image: z.any().optional(),
});

export default function EmployeeAddPage() {
    const router = useRouter();
    const createEmployee = useCreateEmployee();

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(employeeSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            sex: "",
            dob: "",
            date_of_placement: "",
            phone: [{ code: "+373", phone: "", operator: "" }],
            image: null,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "phone",
    });

    const [mounted, setMounted] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [fileName, setFileName] = useState(null);

    useEffect(() => setMounted(true), []);
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);
    const crumbs = segments.map((seg, idx) => ({
        name: seg[0].toUpperCase() + seg.slice(1),
        href: "/" + segments.slice(0, idx + 1).join("/"),
    }));

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setValue("image", file);
        setFileName(file);
    };

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (key === "phone") {
                    formData.append("phone", JSON.stringify(value));
                } else if (key === "image" && value) {
                    formData.append("image", value);
                } else {
                    formData.append(key, value || "");
                }
            });

            await createEmployee.mutateAsync(formData);
            setSuccessMsg("Employee created successfully!");
            setTimeout(() => router.push("/employees"), 2000);
        } catch (err) {
            console.error("❌ Error:", err);
            const rawMsg = err?.response?.data?.message || err?.message || "Failed to create employee.";
            setErrorMsg(rawMsg);
        }
    };

    if (!mounted) return <div className="text-center text-gray-500">Loading form...</div>;

    return (
        <div className="p-0 space-y-6 md:p-6">
            {/* Breadcrumbs */}
            <Breadcrumb className="flex items-center gap-2">
                <BreadcrumbItem href="/" icon={HiHome}>Home</BreadcrumbItem>
                {crumbs.map((c, i) => (
                    <BreadcrumbItem key={i} {...(c.name.toLowerCase() !== "users" && { href: c.href })}>
                        {c.name}
                    </BreadcrumbItem>
                ))}
            </Breadcrumb>

            <h2 className="text-xl font-semibold mb-4">Add Employee</h2>

            {/* ✅ Toasts */}
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

            {/* ✅ Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-6">
                    {/* Left: Upload */}
                    <div className="space-y-4 bg-white p-4 rounded-lg shadow dark:bg-gray-800">
                        <div>
                            <Label htmlFor="image" value="Upload Photo or Document" />
                            <div className="flex items-center justify-center w-full">
                                <label
                                    htmlFor="image"
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
                                        id="image"
                                        type="file"
                                        accept="image/*,.pdf"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right: Main fields */}
                    <div>
                        <div className="rounded-lg p-6 mb-6 shadow-sm space-y-6 bg-[#F9FAFB] dark:bg-gray-800">
                            <h2 className="text-xl font-semibold mb-4">Employee Details</h2>

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
                                    <Label>Date of Placement</Label>
                                    <Datepicker onChange={(date) => {
                                        if (date) setValue("date_of_placement", date.toISOString().split("T")[0]);
                                    }} />
                                    {errors.date_of_placement && <p className="text-red-500 text-sm">{errors.date_of_placement.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Phones */}
                        <div className="rounded-lg p-6 shadow-sm space-y-6 bg-[#F9FAFB] dark:bg-gray-800">
                            {fields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                                    <div className="flex flex-col space-y-2">
                                        <Label>Phone Number</Label>
                                        <div className="relative w-full border border-gray-300 rounded-lg dark:border-gray-600">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-1">
                                                <Select
                                                    value={
                                                        countryOptions.find(
                                                            (opt) => opt.value === watch(`phone.${index}.code`)
                                                        ) || countryOptions[0]
                                                    }
                                                    onChange={(selected) => setValue(`phone.${index}.code`, selected.value)}
                                                    options={countryOptions}
                                                    isSearchable={false}
                                                    className="w-[100px]"
                                                    styles={reactSelectHeightFix}
                                                />
                                            </div>
                                            <TextInput
                                                {...register(`phone.${index}.phone`)}
                                                placeholder="123 456 789"
                                                className="pl-[105px] h-[42px] dark:bg-gray-700 dark:text-white border-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-[2fr_auto] gap-4 items-end">
                                        <div>
                                            <Label>Operator</Label>
                                            <Select
                                                options={operatorOptions}
                                                onChange={(val) => setValue(`phone.${index}.operator`, val?.value || "")}
                                                placeholder="Select operator..."
                                                styles={reactSelectHeightFix}
                                            />
                                        </div>

                                        {index === fields.length - 1 && (
                                            <div className="flex gap-2 self-end">
                                                {fields.length > 1 && (
                                                    <Button color="failure" onClick={() => remove(index)} size="xs">
                                                        −
                                                    </Button>
                                                )}
                                                <Button color="blue" onClick={() => append({ code: "+373", phone: "", operator: "" })} size="xs">
                                                    +
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                    {errors.phone?.[index]?.phone && (
                                        <p className="text-red-500 text-sm">{errors.phone[index].phone.message}</p>
                                    )}
                                </div>
                            ))}

                            <div className="flex flex-wrap gap-6 mt-4">
                                <Button type="submit" outline color="blue">
                                    Create
                                </Button>
                                <Button type="button" outline color="gray" onClick={() => router.push("/employees")}>
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
