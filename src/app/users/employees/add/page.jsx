"use client"

import {
    Breadcrumb,
    BreadcrumbItem, Button, Datepicker,
    FileInput,
    Label,
    TabItem, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow,
    Tabs,
    TextInput, Tooltip
} from "flowbite-react";
import {HiHome, HiMinus, HiPhone} from "react-icons/hi";
import {GoDownload} from "react-icons/go";
import {useEffect, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import dynamic from "next/dynamic";
import {useDepartments} from "@/hooks/departments/useDepartments";
import {usePositions} from "@/hooks/positions/usePositions";
import {useOffices} from "@/hooks/officies/useOffices";
import {reactSelectHeightFix} from "@/components/ui/reactSelectHeightFix";
import {useTemplates} from "@/hooks/useTemplates";
import {Controller} from "react-hook-form";

import {
    citizenshipOptions, countryOptions, driverLicenseOptions, educationOptions, employeeFilesOptions,
    genderOptions, languagesOptions,
    maritalStatusOption, operatorOptions, SHIFT_DAY_OPTIONS,
    statusOptions, transportTypeOptions,
    workTimeOptions
} from "@/components/constants/filterOptions";
import {useCreateEmployee} from "@/hooks/users/useCreateEmployee";
import * as toast from "zod";
import {z} from "zod";
import {useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

const Select = dynamic(() => import("react-select"), {ssr: false});


// documents: z
//     .array(
//         z.object({
//             document_type: z.string().min(1, "Document type is required"),
//             document: z.any().optional(),
//         })
//     )
//     .optional(),
// notes: z
//     .array(
//         z.object({
//             note_type: z.string().min(1, "Note type is required"),
//             note: z.any().optional(),
//         })
//     )
//     .optional(),
// day_off: z
//     .array(
//         z.object({
//             type: z.string().min(1, "Type is required"),
//             start_day_off: z.string().optional(),
//             end_day_off: z.string().optional(),
//         })
//     )
//     .optional(),


export default function EmployeeAddPage() {
    const [mounted, setMounted] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    const crumbs = segments.map((seg, idx) => {
        const href = "/" + segments.slice(0, idx + 1).join("/");
        return {name: seg[0].toUpperCase() + seg.slice(1), href};
    });

    const employeeSchema = z.object({
        image: z.any().optional(),
        status: z.any().optional(),
        type: z.any().optional(),
        date_of_placement: z.string().min(1, "Date of Placement is required"),
        date_of_dismissal: z.string().optional(),
        first_name: z.string().min(1, "First name is required"),
        last_name: z.string().min(1, "Last name is required"),
        sex: z.string().min(1, "Gender is required"),
        dob: z.string().min(1, "Date of Birth is required"),
        email: z.email("Invalid email").optional(),
        marital_status: z.string().optional(),
        citizenship: z.string().optional(),
        address: z.string().optional(),
        telegram: z.string().optional(),
        education: z.string().optional(),
        languages: z.string().optional(),
        transport_type: z.string().optional(),
        driver_license: z.string().optional(),
        phones: z
            .array(
                z.object({
                    code: z.string().min(1),
                    phone: z.string().min(1, "Phone is required"),
                    operator: z.string().optional(),
                })
            )
            .nonempty("At least one phone number is required"),

        primary_contact: z.string().optional(),
        primary_contact_phone: z.string().optional(),
        children: z
            .array(
                z.object({
                    name: z.string().min(1, "Child name is required"),
                    gender: z.string().min(1, "Child gender is required"),
                    dob: z.string().min(1, "Child DOB is required"),
                })
            )
            .optional(),

        // company info
        office_id: z.any().optional(),
        department_id: z.any().optional(),
        position_id: z.any().optional(),
        official_position_id: z.any().optional(),
        work_name: z.string().optional(),
        work_email: z.email("Invalid email").optional(),
        shifts: z
            .array(
                z.object({
                    start_time: z.string().min(1, "Start time is required"),
                    end_time: z.string().min(1, "End time is required"),
                    work_days: z
                        .array(z.string().min(1))
                        .nonempty("At least one work day is required"),
                })
            )
            .optional(),
        files: z
            .array(
                z.object({
                    file_type: z.string().min(1, "File type is required"),
                    file: z.any().optional(),
                })
            )
            .optional(),
    });

    const {data: departmentsData = [], isLoading: depLoading} = useDepartments();
    const {data: positionsData = [], isLoading: posLoading} = usePositions();
    const {data: officesData = [], isLoading: offLoading} = useOffices();
    const [image, setImage] = useState("");
    const [status, setStatus] = useState(null);
    const [gender, setGender] = useState(null);
    const [genderChild, setGenderChild] = useState(null);
    const [departments, setDepartments] = useState(null);
    const [offices, setOffices] = useState(null);
    const [positions, setPositions] = useState(null);
    const [datePlacement, setDatePlacement] = useState("");
    const [dateDismissal, setDateDismissal] = useState("");
    const [dob, setDob] = useState("");
    const [citizenship, setCitizenship] = useState("");
    const [maritalStatus, setMaritalStatus] = useState("");
    const [languages, setLanguages] = useState("");
    const [education, setEducation] = useState("");
    const [transportType, setTransportType] = useState("");
    const [driverLicense, setDriverLicense] = useState("");
    const [fileType, setFileType] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [employeeFiles, setEmployeeFiles] = useState("");
    const {data: templates, isLoading, isError, error} = useTemplates();
    const router = useRouter();

    useEffect(() => setMounted(true), []);
    const [phones, setPhones] = useState([{
        phone: "", operator: "", countryCode: ""
    }]);

    const {
        register,
        control,
        handleSubmit,
        setValue,
        getValues,
        formState: {errors},
    } = useForm({
        resolver: zodResolver(employeeSchema),
        defaultValues: {
            image: null,
            status: "",
            type: "",
            date_of_placement: "",
            date_of_dismissal: "",
            first_name: "",
            last_name: "",
            sex: "",
            dob: "",
            email: "",
            marital_status: "",
            citizenship: "",
            address: "",
            telegram: "",
            education: "",
            languages: "",
            transport_type: "",
            driver_license: "",
            phones: [{code: "+373", phone: "", operator: ""}],
            primary_contact: "",
            primary_contact_phone: "",
            children: [{name: "", genderChild: "", dob: ""}],
            office_id: "",
            department_id: "",
            position_id: "",
            work_name: "",
            work_email: "",
            shifts: [
                {
                    start_time: "",
                    end_time: "",
                    work_days: [],
                },
            ],
            files: [{
                file_type: "",
                file: "",
            },],
        },
    });

    useEffect(() => {
        console.log("Form errors:", errors);
    }, [errors]);


// ✅ Give each useFieldArray its own name
    const {
        fields: phoneFields,
        append: appendPhone,
        remove: removePhone,
    } = useFieldArray({
        control,
        name: "phones",
    });

    const {
        fields: childFields,
        append: appendChild,
        remove: removeChild,
    } = useFieldArray({
        control,
        name: "children",
    });

    const {
        fields: shiftFields,
        append: appendShift,
        remove: removeShift,
    } = useFieldArray({
        control,
        name: "shifts",
    });

    const {
        fields: fileFields,
        append: appendFile,
        remove: removeFile,
    } = useFieldArray({
        control,
        name: "files",
    });

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setImage(file);
        }
    };

    const handleAddPhone = () => {
        setPhones([...phones, {phone: "", operator: ""}]);
    };

    const handleRemovePhone = (index) => {
        setPhones(phones.filter((_, i) => i !== index));
    };

    const handleChange = (index, field, value) => {
        const updated = [...phones];
        updated[index][field] = value;
        setPhones(updated);
    };

    const createEmployeeMutation = useCreateEmployee();


    const onSubmit = async (data) => {
        console.log("Submitting data:", data);

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });

        createEmployeeMutation.mutate(formData);
    };

    if (!mounted)
        return <div className="text-center text-gray-500">Loading form...</div>;


    return (
        <div className="p-0 space-y-6 md:p-6">
            {/* Breadcrumb */}
            <Breadcrumb className="flex items-center gap-2">
                <BreadcrumbItem href="/" icon={HiHome}>Home</BreadcrumbItem>
                {crumbs.map((c, i) => (
                    <BreadcrumbItem key={i} {...(c.name.toLowerCase() !== "users" && {href: c.href})}>
                        {c.name}
                    </BreadcrumbItem>
                ))}
            </Breadcrumb>

            <h2 className="text-xl font-semibold mb-4">Add Employee</h2>

            {/* Two-column layout */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    console.log("Raw submit triggered");
                    handleSubmit(onSubmit)(e);
                }}
            >
                <div className="grid grid-cols-1  lg:grid-cols-[30%_70%] gap-6">
                    {/* Left Column */}
                    <div className="space-y-4 bg-white p-4 rounded-lg shadow dark:bg-gray-800">
                        {/* File upload with drag & drop */}
                        <div className="w-full">
                            <Label
                                htmlFor="dropzone-file"
                                value="Upload Image or Document"
                                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                            />
                            <div className="flex items-center justify-center w-full">
                                <label
                                    htmlFor="dropzone-file"
                                    className="
        relative flex flex-col items-center justify-center w-full h-52
        border-2 border-dashed border-gray-300 rounded-2xl
        cursor-pointer bg-gray-50 hover:bg-gray-100
        transition-all duration-200 ease-in-out
        hover:border-primary hover:shadow-md
      "
                                >
                                    <div className="flex flex-col items-center justify-center text-center px-4">
                                        {!image && (
                                            <>
                                                <svg
                                                    aria-hidden="true"
                                                    className="w-12 h-12 mb-3 text-gray-400"
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
                                                <p className="text-sm text-gray-600">
                                                    <span
                                                        className="font-semibold text-primary">Click to upload</span> or
                                                    drag and drop
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">PNG, JPG, PDF up to 10MB</p>
                                            </>
                                        )}

                                        {/* ✅ Image Preview */}
                                        {image && image.type.startsWith("image/") && (
                                            <div className="mt-3">
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt="Preview"
                                                    className="w-28 h-28 object-cover rounded-lg shadow-md border border-gray-200"
                                                />
                                                <p className="text-sm text-gray-700 mt-2">{image.name}</p>
                                            </div>
                                        )}

                                        {/* ✅ PDF Preview */}
                                        {image && image.type === "application/pdf" && (
                                            <div className="flex flex-col items-center mt-3">
                                                <div
                                                    className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="w-8 h-8 text-red-500"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M12 4v16m8-8H4"
                                                        />
                                                    </svg>
                                                </div>
                                                <p className="text-sm text-gray-700 mt-2">{image.name}</p>
                                            </div>
                                        )}
                                    </div>

                                    <FileInput
                                        id="dropzone-file"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        accept=".png,.jpg,.jpeg,.pdf"
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <div className="mb-2 block">
                                <Label htmlFor="status">Status</Label>
                            </div>
                            <Select
                                id="status"
                                options={statusOptions}
                                value={status}
                                onChange={setStatus}
                                placeholder="Select status..."
                                styles={reactSelectHeightFix}
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="type">Type</Label>
                            </div>
                            <Select
                                id="type"
                                options={workTimeOptions}
                                placeholder="Select type..."
                                styles={reactSelectHeightFix}
                            />
                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Date of Placement (Required) */}
                            <div>
                                <div className="mb-1 block">
                                    <Label htmlFor="date_of_placement">Date of Placement</Label>
                                </div>

                                <Controller
                                    name="date_of_placement"
                                    control={control}
                                    render={({field}) => (
                                        <Datepicker
                                            selected={field.value ? new Date(field.value) : null}
                                            onChange={(date) => {
                                                if (date instanceof Date && !isNaN(date)) {
                                                    const year = date.getFullYear();
                                                    const month = String(date.getMonth() + 1).padStart(2, "0");
                                                    const day = String(date.getDate()).padStart(2, "0");
                                                    field.onChange(`${year}-${month}-${day}`);
                                                } else {
                                                    field.onChange("");
                                                    console.warn("Invalid date selected:", date);
                                                }
                                            }}
                                        />
                                    )}
                                />

                                {errors.date_of_placement && (
                                    <p className="text-red-500 text-sm">{errors.date_of_placement.message}</p>
                                )}
                            </div>

                            {/* Date of Dismissal (Optional) */}
                            <div>
                                <div className="mb-1 block">
                                    <Label htmlFor="date_of_dismissal">Date of Dismissal</Label>
                                </div>

                                <Controller
                                    name="date_of_dismissal"
                                    control={control}
                                    render={({field}) => (
                                        <Datepicker
                                            selected={field.value ? new Date(field.value) : null}
                                            onChange={(date) => {
                                                if (date instanceof Date && !isNaN(date)) {
                                                    const year = date.getFullYear();
                                                    const month = String(date.getMonth() + 1).padStart(2, "0");
                                                    const day = String(date.getDate()).padStart(2, "0");
                                                    field.onChange(`${year}-${month}-${day}`);
                                                } else {
                                                    field.onChange("");
                                                    console.warn("Invalid date selected:", date);
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/*<Datepicker*/}
                        {/*    selected={placementDate ? new Date(placementDate) : null}*/}
                        {/*    onChange={(date) => {*/}
                        {/*        if (date instanceof Date && !isNaN(date)) {*/}
                        {/*            // Format in local time to YYYY-MM-DD*/}
                        {/*            const year = date.getFullYear();*/}
                        {/*            const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed*/}
                        {/*            const day = String(date.getDate()).padStart(2, "0");*/}

                        {/*            const formattedDate = `${year}-${month}-${day}`;*/}
                        {/*            setPlacementDate(formattedDate);*/}
                        {/*        } else {*/}
                        {/*            setPlacementDate("");*/}
                        {/*            console.warn("Invalid date selected:", date);*/}
                        {/*        }*/}
                        {/*    }}*/}
                        {/*/>*/}

                        {/*<Controller*/}
                        {/*    name="date_dismissal"*/}
                        {/*    control={control}*/}
                        {/*    render={({ field }) => (*/}
                        {/*        <>*/}
                        {/*            <div className="mb-2 block">*/}
                        {/*                <Label htmlFor="datepicker2">Date of Dismissal</Label>*/}
                        {/*            </div>*/}
                        {/*            <Datepicker*/}
                        {/*                selected={field.value ? new Date(field.value) : null}*/}
                        {/*                onChange={(date) => {*/}
                        {/*                    if (date instanceof Date && !isNaN(date)) {*/}
                        {/*                        const year = date.getFullYear();*/}
                        {/*                        const month = String(date.getMonth() + 1).padStart(2, "0");*/}
                        {/*                        const day = String(date.getDate()).padStart(2, "0");*/}
                        {/*                        field.onChange(`${year}-${month}-${day}`);*/}
                        {/*                    } else {*/}
                        {/*                        field.onChange("");*/}
                        {/*                    }*/}
                        {/*                }}*/}
                        {/*            />*/}
                        {/*            {errors.date_dismissal && (*/}
                        {/*                <p className="text-red-500 text-sm">{errors.date_dismissal.message}</p>*/}
                        {/*            )}*/}
                        {/*        </>*/}
                        {/*    )}*/}
                        {/*/>*/}
                        {/*<Datepicker*/}
                        {/*    selected={dismissalDate ? new Date(dismissalDate) : null}*/}
                        {/*    onChange={(date) => {*/}
                        {/*        if (date instanceof Date && !isNaN(date)) {*/}
                        {/*            // Format in local time to YYYY-MM-DD*/}
                        {/*            const year = date.getFullYear();*/}
                        {/*            const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed*/}
                        {/*            const day = String(date.getDate()).padStart(2, "0");*/}

                        {/*            const formattedDate = `${year}-${month}-${day}`;*/}
                        {/*            setDismissalDate(formattedDate);*/}
                        {/*        } else {*/}
                        {/*            setDismissalDate("");*/}
                        {/*            console.warn("Invalid date selected:", date);*/}
                        {/*        }*/}
                        {/*    }}*/}
                        {/*/>*/}
                    </div>

                    {/* Right Column */}
                    <Tabs aria-label="Tabs with underline" variant="underline">
                        <TabItem active title="General">
                            <div className="space-y-6">
                                <div className=" rounded-lg p-6 shadow-sm space-y-6 bg-[#F9FAFB] dark:bg-gray-800">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="first_name">First Name</Label>
                                            <TextInput
                                                id="first_name"
                                                placeholder="First Name"
                                                {...register("first_name")}
                                            />
                                            {errors.first_name && (
                                                <p className="text-red-500 text-sm">{errors.first_name.message}</p>
                                            )}
                                        </div>

                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="last_name">Last Name</Label>
                                            <TextInput
                                                id="last_name"
                                                placeholder="Last Name"
                                                {...register("last_name")}
                                            />
                                            {errors.first_name && (
                                                <p className="text-red-500 text-sm">{errors.last_name.message}</p>
                                            )}
                                        </div>
                                        {/*<div>*/}
                                        {/*    <div className="mb-1 block">*/}
                                        {/*        <Label htmlFor="dob">Date of Birth</Label>*/}
                                        {/*    </div>*/}
                                        {/*    <Datepicker*/}
                                        {/*        selected={dob ? new Date(dob) : null}*/}
                                        {/*        onChange={(date) => {*/}
                                        {/*            if (date instanceof Date && !isNaN(date)) {*/}
                                        {/*                // Format in local time to YYYY-MM-DD*/}
                                        {/*                const year = date.getFullYear();*/}
                                        {/*                const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed*/}
                                        {/*                const day = String(date.getDate()).padStart(2, "0");*/}

                                        {/*                const formattedDate = `${year}-${month}-${day}`;*/}
                                        {/*                setDob(formattedDate);*/}
                                        {/*            } else {*/}
                                        {/*                setDob("");*/}
                                        {/*                console.warn("Invalid date selected:", date);*/}
                                        {/*            }*/}
                                        {/*        }}*/}
                                        {/*    />*/}
                                        {/*</div>*/}

                                        <Controller
                                            name="dob"
                                            control={control}
                                            render={({field}) => (
                                                <div>
                                                    <div className="mb-1 block">
                                                        <Label htmlFor="dob">Date of Birth</Label>
                                                    </div>
                                                    <Datepicker
                                                        selected={field.value ? new Date(field.value) : null}
                                                        onChange={(date) => {
                                                            if (date instanceof Date && !isNaN(date)) {
                                                                const year = date.getFullYear();
                                                                const month = String(date.getMonth() + 1).padStart(2, "0");
                                                                const day = String(date.getDate()).padStart(2, "0");
                                                                field.onChange(`${year}-${month}-${day}`);
                                                            } else {
                                                                field.onChange("");
                                                                console.warn("Invalid date selected:", date);
                                                            }
                                                        }}
                                                    />
                                                    {errors.dob && (
                                                        <p className="text-red-500 text-sm">{errors.dob.message}</p>
                                                    )}
                                                </div>
                                            )}
                                        />

                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="sex">Gender</Label>
                                            <Controller
                                                name="sex"
                                                control={control}
                                                render={({field}) => (
                                                    <Select
                                                        {...field}
                                                        options={genderOptions}
                                                        value={genderOptions.find(opt => opt.value === field.value) || null}
                                                        onChange={(selected) => field.onChange(selected?.value)}
                                                        placeholder="Select gender..."
                                                        className="react-select-container"
                                                        classNamePrefix="react-select"
                                                        styles={reactSelectHeightFix}
                                                    />
                                                )}
                                            />
                                            {errors.sex && (
                                                <p className="text-red-500 text-sm">{errors.sex.message}</p>
                                            )}
                                        </div>

                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="marital_status">Marital Status</Label>
                                            <Select
                                                id="marital_status"
                                                options={maritalStatusOption}
                                                value={maritalStatus}
                                                onChange={setMaritalStatus}
                                                placeholder="Select an option..."
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                                styles={reactSelectHeightFix}
                                            />
                                        </div>

                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="gender">Citizenship</Label>
                                            <Select
                                                id="gender"
                                                options={citizenshipOptions}
                                                value={citizenship}
                                                onChange={setCitizenship}
                                                placeholder="Select any options..."
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                                styles={reactSelectHeightFix}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="address">Your current address</Label>
                                        </div>
                                        <TextInput id="address" type="text" {...register("address")}
                                                   placeholder="Write address here..."/>
                                    </div>
                                </div>
                                <div className="mb-2">Phone Number</div>
                                <div className="rounded-lg p-6 shadow-sm space-y-6 bg-[#F9FAFB] dark:bg-gray-800">
                                    {phoneFields.map((item, index) => (
                                        <div key={item.id} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">

                                            <div className="flex flex-col space-y-2">
                                                <Label htmlFor={`phones.${index}.phone`} className="dark:text-white">
                                                    Phone Number
                                                </Label>
                                                <div className="relative w-full border border-gray-300 rounded-lg">
                                                    {/* Country Code Select */}
                                                    <div className="absolute inset-y-0 left-0 flex items-center">
                                                        <Select
                                                            value={countryOptions.find(opt => opt.value === item.countryCode) || countryOptions[0]}
                                                            onChange={(selected) => setValue(`phones.${index}.code`, selected.value)}
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

                                            <div className="grid grid-cols-1 md:grid-cols-[2fr_auto] gap-4 items-end">
                                                {/* Operator */}
                                                <div className="flex flex-col space-y-2">
                                                    <Label htmlFor={`phones.${index}.operator`}
                                                           className="dark:text-white">
                                                        Operator
                                                    </Label>
                                                    <Select
                                                        id={`phones.${index}.operator`}
                                                        placeholder="Select an option"
                                                        options={operatorOptions}
                                                        className="height-[42px] dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                                        styles={reactSelectHeightFix}
                                                    />
                                                </div>

                                                {/* Buttons */}
                                                <div className="flex items-end gap-2 self-end">
                                                    {index === phoneFields.length - 1 ? (<> {phoneFields.length > 1 && (
                                                            <Button color="failure" onClick={() => removePhone(index)}
                                                                    size="xs"
                                                                    className="flex items-center justify-center h-[42px] w-[42px] rounded-lg border bg-red-700 hover:bg-red-800 text-white text-lg"> - {/*<RiDeleteBin6Fill color="darkred" size="xs" />*/} </Button>)}
                                                            <Button onClick={appendPhone}
                                                                    className="flex items-center justify-center h-[42px] w-[42px] rounded-lg border bg-blue-700 hover:bg-blue-800 text-white text-lg"> + </Button> </>) :
                                                        (<Button color="failure"
                                                                 onClick={() => removePhone(index)}
                                                                 size="xs"
                                                                 className="flex items-center justify-center h-[42px] text-white color-white">
                                                            <HiMinus/>
                                                        </Button>)
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                    ))}
                                </div>
                                <div className="mb-2">Primary Contact</div>
                                <div className="rounded-lg p-6 shadow-sm space-y-6 bg-[#F9FAFB] dark:bg-gray-800">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="primary_contact">Primary Contact Name</Label>
                                            <TextInput id="primary_contact"  {...register("primary_contact")}
                                                       placeholder="Full Name"/>
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <div className="max-w-md">
                                                <div className="mb-1 block">
                                                    <Label htmlFor="primary_contact_phone">Primary Contact Phone</Label>
                                                </div>
                                                <TextInput id="primary_contact_phone"
                                                           {...register("primary_contact_phone")}
                                                           type="phone"
                                                           icon={HiPhone}
                                                           placeholder="123 456 78"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-2">Children</div>
                                <div className="rounded-lg p-6 shadow-sm space-y-6 mb-4 bg-[#F9FAFB] dark:bg-gray-800">
                                    {childFields.map((child, index) => (
                                        <div
                                            key={child.id}
                                            className="grid grid-cols-3 gap-4 items-end"
                                        >
                                            {/* Name */}
                                            <div className="flex flex-col space-y-2">
                                                <Label htmlFor={`children_name-${index}`}>Full Name</Label>
                                                <TextInput
                                                    id={`children_name-${index}`}
                                                    placeholder="Child Name"
                                                    {...register(`children.${index}.name`)}
                                                />
                                            </div>

                                            {/* Gender */}
                                            <div className="flex flex-col space-y-2">
                                                <Label htmlFor={`children_gender-${index}`}>Gender</Label>
                                                <Select
                                                    id={`children_gender-${index}`}
                                                    options={genderOptions}
                                                    value={getValues(`children.${index}.gender`)}
                                                    onChange={(val) => setValue(`children.${index}.gender`, val.value)}
                                                    placeholder="Select gender..."
                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                    styles={reactSelectHeightFix}
                                                />
                                            </div>

                                            <div className="flex flex-col space-y-2">
                                                <Label htmlFor={`children_dob-${index}`}>Date of Birth</Label>
                                                <div className="flex gap-2 items-end">
                                                    <TextInput
                                                        id={`children_dob-${index}`}
                                                        type="date"
                                                        {...register(`children.${index}.dob`)}
                                                    />
                                                    {/* Buttons */}
                                                    <div className="flex items-end gap-2 self-end">
                                                        {index === childFields.length - 1 ? (<> {childFields.length > 1 && (
                                                                <Button color="failure" onClick={() => removeChild(index)}
                                                                        size="xs"
                                                                        className="flex items-center justify-center h-[42px] w-[42px] rounded-lg border bg-red-700 hover:bg-red-800 text-white text-lg"> - {/*<RiDeleteBin6Fill color="darkred" size="xs" />*/} </Button>)}
                                                                <Button onClick={() => appendChild({
                                                                    name: "",
                                                                    gender: "",
                                                                    dob: ""
                                                                })}
                                                                        className="flex items-center justify-center h-[42px] w-[42px] rounded-lg border bg-blue-700 hover:bg-blue-800 text-white text-lg"> + </Button> </>) :
                                                            (<Button color="failure"
                                                                     onClick={() => removeChild(index)}
                                                                     size="xs"
                                                                     className="flex items-center justify-center h-[42px] text-white color-white">
                                                                <HiMinus/>
                                                            </Button>)
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>

                            <div className="rounded-lg p-6 shadow-sm space-y-6 bg-[#F9FAFB] dark:bg-gray-800">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Email */}
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="email">Personal Email</Label>
                                        <TextInput id="email" type="email" {...register("email")}
                                                   placeholder="john@example.com"/>
                                    </div>

                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="telegram">Personal Telegram</Label>
                                        <TextInput id="telegram" {...register("telegram")} type="telegram"
                                                   placeholder="@test"/>
                                    </div>

                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="education">Education</Label>
                                        <Select
                                            id="education"
                                            options={educationOptions}
                                            value={education}
                                            onChange={setEducation}
                                            placeholder="Select education..."
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            styles={reactSelectHeightFix}
                                        />
                                    </div>

                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="languages">Languages</Label>
                                        <Select
                                            id="languages"
                                            options={languagesOptions}
                                            value={languages}
                                            onChange={setLanguages}
                                            placeholder="Select languages..."
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            styles={reactSelectHeightFix}
                                        />
                                    </div>

                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="transport_type">Transport Type</Label>
                                        <Select
                                            id="transport_type"
                                            options={transportTypeOptions}
                                            value={transportType}
                                            onChange={setTransportType}
                                            placeholder="Select any transport type..."
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            styles={reactSelectHeightFix}
                                        />
                                    </div>

                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="driver_license">Driver License</Label>
                                        <Select
                                            id="driver_license"
                                            options={driverLicenseOptions}
                                            value={driverLicense}
                                            onChange={setDriverLicense}
                                            placeholder="Select any driver license..."
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            styles={reactSelectHeightFix}
                                        />
                                    </div>
                                </div>
                            </div>


                        </TabItem>

                        <TabItem title="Company">
                            <div className="space-y-6">
                                <div className=" rounded-lg p-6 shadow-sm space-y-6 bg-[#F9FAFB] dark:bg-gray-800">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                                        <div className="flex flex-col space-y-2">
                                            <Label>Office</Label>
                                            <Select
                                                options={officesData}
                                                value={offices}
                                                onChange={setOffices}
                                                isLoading={offLoading}
                                                placeholder="Select office..."
                                                styles={reactSelectHeightFix}
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <Label>Department</Label>
                                            <Select
                                                options={departmentsData}
                                                value={departments}
                                                onChange={setDepartments}
                                                isLoading={depLoading}
                                                placeholder="Select department..."
                                                styles={reactSelectHeightFix}
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <Label>Position</Label>
                                            <Select
                                                options={positionsData}
                                                value={positions}
                                                onChange={setPositions}
                                                isLoading={posLoading}
                                                placeholder="Select position..."
                                                styles={reactSelectHeightFix}
                                            />
                                        </div>

                                        <div className="flex flex-col space-y-2">
                                            <Label>Official Position</Label>
                                            <Select
                                                options={positionsData}
                                                value={positions}
                                                onChange={setPositions}
                                                isLoading={posLoading}
                                                placeholder="Select position..."
                                                styles={reactSelectHeightFix}
                                            />
                                        </div>

                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="work_name">Work Name</Label>
                                            <TextInput id="work_name" {...register("work_name")}
                                                       placeholder="Work Name"/>
                                        </div>

                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="work_email">Work Email</Label>
                                            <TextInput id="work_email"  {...register("work_email")}
                                                       placeholder="Work Email"/>
                                        </div>
                                    </div>
                                </div>

                                <div className=" rounded-lg p-6 shadow-sm space-y-6 bg-[#F9FAFB] dark:bg-gray-800">
                                    {/*<div className="grid grid-cols-1 md:grid-cols-4 gap-6 ">*/}
                                    {/*    <div>*/}
                                    {/*        <label className="block mb-1 font-medium">Start Time</label>*/}
                                    {/*        <input*/}
                                    {/*            type="time"*/}
                                    {/*            className="w-full border rounded px-2 py-1"*/}
                                    {/*        />*/}
                                    {/*    </div>*/}
                                    {/*    <div>*/}
                                    {/*        <label className="block mb-1 font-medium">End Time</label>*/}
                                    {/*        <input*/}
                                    {/*            type="time"*/}
                                    {/*            className="w-full border rounded px-2 py-1"*/}
                                    {/*        />*/}
                                    {/*    </div>*/}
                                    {/*    <div>*/}
                                    {/*        <label className="block mb-1 font-medium">Workdays</label>*/}
                                    {/*        <Select*/}
                                    {/*            isMulti*/}
                                    {/*            options={SHIFT_DAY_OPTIONS}*/}
                                    {/*            className="basic-multi-select"*/}
                                    {/*            classNamePrefix="select"*/}
                                    {/*            placeholder="Select Workdays"*/}
                                    {/*        />*/}
                                    {/*    </div>*/}
                                    {/*    <div className="flex items-end gap-2 self-end">*/}
                                    {/*        <Button*/}
                                    {/*            color="failure"*/}
                                    {/*            onClick={() => remove(index)}*/}
                                    {/*            size="xs"*/}
                                    {/*            className="flex items-center justify-center h-[42px] w-[42px] rounded-lg border bg-red-700 hover:bg-red-800 text-white text-lg"*/}
                                    {/*        >*/}
                                    {/*            −*/}
                                    {/*        </Button>*/}

                                    {/*        <Button*/}
                                    {/*            color="blue"*/}
                                    {/*            onClick={() =>*/}
                                    {/*                append({code: "+373", phone: "", operator: ""})*/}
                                    {/*            }*/}
                                    {/*            size="xs"*/}
                                    {/*            className="flex items-center justify-center h-[42px] w-[42px] rounded-lg border bg-blue-700 hover:bg-blue-800 text-white text-lg"*/}
                                    {/*        >*/}
                                    {/*            +*/}
                                    {/*        </Button>*/}
                                    {/*    </div>*/}

                                    {/*</div>*/}

                                    {shiftFields.map((field, index) => (
                                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                            {/* Start Time */}
                                            <div>
                                                <label className="block mb-1 font-medium">Start Time</label>
                                                <input
                                                    type="time"
                                                    className="w-full border rounded px-2 py-1"
                                                    {...register(`shifts.${index}.start_time`)}
                                                />
                                                {errors.shifts?.[index]?.start_time && (
                                                    <p className="text-red-500 text-sm">{errors.shifts[index].start_time.message}</p>
                                                )}
                                            </div>

                                            {/* End Time */}
                                            <div>
                                                <label className="block mb-1 font-medium">End Time</label>
                                                <input
                                                    type="time"
                                                    className="w-full border rounded px-2 py-1"
                                                    {...register(`shifts.${index}.end_time`)}
                                                />
                                                {errors.shifts?.[index]?.end_time && (
                                                    <p className="text-red-500 text-sm">{errors.shifts[index].end_time.message}</p>
                                                )}
                                            </div>

                                            {/* Workdays */}
                                            <div>
                                                <label className="block mb-1 font-medium">Workdays</label>
                                                <Controller
                                                    control={control}
                                                    name={`shifts.${index}.work_days`}
                                                    render={({ field }) => (
                                                        <Select
                                                            isMulti
                                                            options={SHIFT_DAY_OPTIONS}
                                                            className="basic-multi-select"
                                                            classNamePrefix="select"
                                                            placeholder="Select Workdays"
                                                            value={SHIFT_DAY_OPTIONS.filter(opt => field.value?.includes(opt.value))} // show selected
                                                            onChange={(val) => field.onChange(val ? val.map(v => v.value) : [])} // convert to array of strings
                                                        />
                                                    )}
                                                />
                                                {errors.shifts?.[index]?.work_days && (
                                                    <p className="text-red-500 text-sm">{errors.shifts[index].work_days.message}</p>
                                                )}
                                            </div>

                                            {/* Remove / Add Buttons */}
                                            <div className="flex items-end gap-2 self-end">
                                                <Button
                                                    color="failure"
                                                    onClick={() => removeShift(index)}
                                                    size="xs"
                                                    className="flex items-center justify-center h-[42px] w-[42px] rounded-lg border bg-red-700 hover:bg-red-800 text-white text-lg"
                                                >
                                                    −
                                                </Button>

                                                {index === shiftFields.length - 1 && (
                                                    <Button
                                                        color="blue"
                                                        onClick={() =>
                                                            appendShift({start_time: "", end_time: "", work_days: []})
                                                        }
                                                        size="xs"
                                                        className="flex items-center justify-center h-[42px] w-[42px] rounded-lg border bg-blue-700 hover:bg-blue-800 text-white text-lg"
                                                    >
                                                        +
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                </div>

                                {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">*/}
                                {/*    <div>*/}
                                {/*        <div className="mb-1 block">*/}
                                {/*            <Label htmlFor="dob">Date of Placement</Label>*/}
                                {/*        </div>*/}
                                {/*        <Datepicker*/}
                                {/*            selected={dob ? new Date(dob) : null}*/}
                                {/*            onChange={(date) => {*/}
                                {/*                if (date instanceof Date && !isNaN(date)) {*/}
                                {/*                    // Format in local time to YYYY-MM-DD*/}
                                {/*                    const year = date.getFullYear();*/}
                                {/*                    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed*/}
                                {/*                    const day = String(date.getDate()).padStart(2, "0");*/}

                                {/*                    const formattedDate = `${year}-${month}-${day}`;*/}
                                {/*                    setDob(formattedDate);*/}
                                {/*                } else {*/}
                                {/*                    setDob("");*/}
                                {/*                    console.warn("Invalid date selected:", date);*/}
                                {/*                }*/}
                                {/*            }}*/}
                                {/*        />*/}
                                {/*    </div>*/}
                                {/*    <div>*/}
                                {/*        <div className="mb-1 block">*/}
                                {/*            <Label htmlFor="dob">Date of Dismissal</Label>*/}
                                {/*        </div>*/}
                                {/*        <Datepicker*/}
                                {/*            selected={dob ? new Date(dob) : null}*/}
                                {/*            onChange={(date) => {*/}
                                {/*                if (date instanceof Date && !isNaN(date)) {*/}
                                {/*                    // Format in local time to YYYY-MM-DD*/}
                                {/*                    const year = date.getFullYear();*/}
                                {/*                    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed*/}
                                {/*                    const day = String(date.getDate()).padStart(2, "0");*/}

                                {/*                    const formattedDate = `${year}-${month}-${day}`;*/}
                                {/*                    setDob(formattedDate);*/}
                                {/*                } else {*/}
                                {/*                    setDob("");*/}
                                {/*                    console.warn("Invalid date selected:", date);*/}
                                {/*                }*/}
                                {/*            }}*/}
                                {/*        />*/}

                                {/*    </div>*/}

                                {/*</div>*/}
                            </div>
                        </TabItem>
                        <TabItem title="Files">
                            <div className=" rounded-lg p-6 shadow-sm space-y-6 bg-[#F9FAFB] dark:bg-gray-800">
                                <div className="space-y-6">
                                    <Label className="font-semibold text-lg">Files</Label>

                                    {fileFields.map((file, index) => (
                                        <div key={file.id}
                                             className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-gray-50 p-4 rounded-lg">
                                            {/* File Type */}
                                            <div className="flex flex-col space-y-2">
                                                <Label>Select File Type</Label>
                                                <Controller
                                                    name={`files.${index}.file_type`}
                                                    control={control}
                                                    render={({field}) => (
                                                        <Select
                                                            options={employeeFilesOptions}
                                                            value={employeeFilesOptions.find((opt) => opt.value === field.value) || null}
                                                            onChange={(selected) => field.onChange(selected?.value)}
                                                            placeholder="Select file type..."
                                                        />
                                                    )}
                                                />
                                                {errors?.files?.[index]?.file_type && (
                                                    <p className="text-red-500 text-sm">{errors.files[index].file_type.message}</p>
                                                )}
                                            </div>

                                            {/* File Upload */}
                                            <div className="flex flex-col space-y-2">
                                                <Label>Upload File</Label>
                                                <Controller
                                                    name={`files.${index}.file`}
                                                    control={control}
                                                    render={({field}) => (
                                                        <FileInput
                                                            id={`file-${index}`}
                                                            onChange={(e) => field.onChange(e.target.files?.[0] || null)}
                                                        />
                                                    )}
                                                />
                                            </div>

                                            {/* Add / Remove buttons */}
                                            <div className="flex items-end gap-2">
                                                {fileFields.length > 1 && (
                                                    <Button
                                                        color="failure"
                                                        size="xs"
                                                        onClick={() => removeFile(index)}
                                                        className="h-[42px] w-[42px] rounded-lg border bg-red-700 hover:bg-red-800 text-white text-lg"
                                                    >
                                                        -
                                                    </Button>
                                                )}
                                                {index === fileFields.length - 1 && (
                                                    <Button
                                                        size="xs"
                                                        onClick={() => appendFile({file_type: "", file: null})}
                                                        className="h-[42px] w-[42px] rounded-lg border bg-blue-700 hover:bg-blue-800 text-white text-lg"
                                                    >
                                                        +
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>


                            </div>
                        </TabItem>
                        <TabItem title="Documents">
                            <div className="flex justify-end">
                                <Button className="flex items-center gap-2 mb-6">
                                    + New Document
                                </Button>
                            </div>
                            <div
                                className="overflow-x-auto rounded-lg border border-gray-200 bg-white dark:bg-gray-800">
                                <Table hoverable={true}>
                                    <TableHead>
                                        <TableRow>
                                            <TableHeadCell className="font-semibold text-gray-700 dark:text-gray-200">
                                                Name
                                            </TableHeadCell>
                                            <TableHeadCell className="font-semibold text-gray-700 dark:text-gray-200">
                                                Created At
                                            </TableHeadCell>
                                            <TableHeadCell className="font-semibold text-gray-700 dark:text-gray-200">
                                                Created By
                                            </TableHeadCell>
                                            <TableHeadCell
                                                className="font-semibold text-gray-700 dark:text-gray-200 text-center">
                                                Nr Documents
                                            </TableHeadCell>
                                            <TableHeadCell
                                                className="text-center font-semibold text-gray-700 dark:text-gray-200">
                                                Action
                                            </TableHeadCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody className="divide-y">
                                        {templates?.length > 0 ? (
                                            templates.map((template) => (
                                                <TableRow
                                                    key={template.id}
                                                    className="bg-white dark:bg-gray-900 dark:border-gray-700"
                                                >
                                                    <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                                                        {template.name}
                                                    </TableCell>
                                                    <TableCell className="text-gray-700 dark:text-gray-300">
                                                        {new Date(template.created_at).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="text-gray-700 dark:text-gray-300">
                                                        {template?.created_by || "—"}
                                                    </TableCell>
                                                    <TableCell className="text-center text-gray-700 dark:text-gray-300">
                                                        {template?.documents_count || "-"}
                                                    </TableCell>
                                                    <TableCell className="flex justify-center items-center">
                                                        <Tooltip content="Upload document">
                                                            <Button
                                                                color="gray"
                                                                size="xs"
                                                                // onClick={() => handleDownload(template.id)}
                                                                className="flex items-center justify-center"
                                                            >
                                                                <GoDownload className="w-4 h-4"/>
                                                            </Button>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={5}
                                                    className="text-center py-6 text-gray-500 dark:text-gray-400"
                                                >
                                                    No templates found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabItem>
                        <TabItem title="Notes">
                            <div className="flex justify-end">
                                <Button className="flex items-center gap-2 mb-6">
                                    + New Note
                                </Button>
                            </div>
                        </TabItem>
                        <TabItem title="Day Off">

                            <div className="flex justify-end">
                                <Button className="flex items-center gap-2 mb-6">
                                    + New Off Day
                                </Button>
                            </div>
                        </TabItem>
                    </Tabs>

                </div>

                <div className="flex flex-wrap gap-6 mt-4">
                    <Button type="submit" outline color="blue">
                        Create
                    </Button>
                    <Button type="button" outline color="gray" onClick={() => router.push("/users/employees")}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}