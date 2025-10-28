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
import {HiHome, HiMinus, HiUpload} from "react-icons/hi";
import {useState} from "react";
import {usePathname} from "next/navigation";
import dynamic from "next/dynamic";
import {useDepartments} from "@/hooks/departments/useDepartments";
import {usePositions} from "@/hooks/positions/usePositions";
import {useOffices} from "@/hooks/officies/useOffices";
import {reactSelectHeightFix} from "@/components/ui/reactSelectHeightFix";
import {useTemplates} from "@/hooks/useTemplates";


const Select = dynamic(() => import("react-select"), {ssr: false});

export default function EmployeeEditPage() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    const crumbs = segments.map((seg, idx) => {
        const href = "/" + segments.slice(0, idx + 1).join("/");
        return {name: seg[0].toUpperCase() + seg.slice(1), href};
    });
    const {data: departmentsData = [], isLoading: depLoading} = useDepartments();
    const {data: positionsData = [], isLoading: posLoading} = usePositions();
    const {data: officesData = [], isLoading: offLoading} = useOffices();
    const [fileName, setFileName] = useState("");
    const [status, setStatus] = useState(null);
    const [gender, setGender] = useState(null);
    const [departments, setDepartments] = useState(null);
    const [offices, setOffices] = useState(null);
    const [positions, setPositions] = useState(null);
    const [placementDate, setPlacementDate] = useState("");
    const [dismissalDate, setDismissalDate] = useState("");
    const [dob, setDob] = useState("");
    const [citizenship, setCitizenship] = useState("");
    const [maritalStatus, setMaritalStatus] = useState("");
    const [fileType, setFileType] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [employeeFiles, setEmployeeFiles] = useState("");
    const { data: templates, isLoading, isError, error } = useTemplates();


    const employeeFilesOptions = [
        {value: "resume", label: "Resume"},
        {value: "id", label: "ID"},
        {value: "military_id", label: "Military ID"},
        {value: "application", label: "Application"},
        {value: "ordin", label: "Ordin"},
        {value: "contract", label: "Contract"},
        {value: "nda", label: "NDA"},
        {value: "gdpr", label: "GDPR"},
    ]


    const genderOptions = [
        {value: "male", label: "Male"},
        {value: "female", label: "Female"},
        {value: "other", label: "Other"},
    ];
    const statusOptions = [
        {value: "active", label: "Active"},
        {value: "inactive", label: "Inactive"},
        {value: "suspended", label: "Suspended"},
    ];
    const workTimeOptions = [
        {value: "full-time", label: "Full-time"},
        {value: "part-time", label: "Part-time"},
        {value: "contractor", label: "Contractor"}
    ]
    const maritalStatusOption = [
        {value: "single", label: "Single"},
        {value: "married", label: "Married"},
        {value: "divorced", label: "Divorced"},
    ]
    const citizenshipOptions = [
        {value: "md", label: "MDA"},
        {value: "ro", label: "RO"},
        {value: "ru", label: "RU"},
        {value: "us", label: "USA"},
        {value: "uk", label: "UK"},
        {value: "fr", label: "France"},
    ]

    const countryOptions = [
        {value: "+373", label: "🇲🇩 +373"},
        {value: "+40", label: "🇷🇴 +40"},
    ];

    const operatorOptions = [
        {value: "moldcell", label: "moldcell"},
        {value: "unite", label: "unite"},
        {value: "orange", label: "orange"},
    ];

    const SHIFT_DAY_OPTIONS = [
        {value: "1", label: "Mon"},
        {value: "2", label: "Tue"},
        {value: "3", label: "Wed"},
        {value: "4", label: "Thu"},
        {value: "5", label: "Fri"},
        {value: "6", label: "Sat"},
        {value: "7", label: "Sun"},
    ];

    const [phones, setPhones] = useState([{
        phone: "", operator: "", countryCode: ""
    }]);

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
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

    function handleUpload(templateId) {
        // TODO: implement file upload modal or direct upload logic
        console.log("Upload for template:", templateId);
    }

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
            <div className="grid grid-cols-1  lg:grid-cols-[30%_70%] gap-6">
                {/* Left Column */}
                <div className="space-y-4 bg-white p-4 rounded-lg shadow dark:bg-gray-800">
                    {/* File upload with drag & drop */}
                    <div className="w-full">
                        <Label htmlFor="dropzone-file" value="Upload Image or Document"/>
                        <div className="flex items-center justify-center w-full">
                            <label
                                htmlFor="dropzone-file"
                                className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
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
                                        <p className="mt-2 text-sm text-blue-600">{fileName}</p>
                                    )}
                                </div>
                                <FileInput
                                    id="dropzone-file"
                                    className="hidden"
                                    onChange={handleFileChange}
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

                    <div className="mb-2 block">
                        <Label htmlFor="datepicker1">Date of Placement</Label>
                    </div>
                    <Datepicker
                        selected={placementDate ? new Date(placementDate) : null}
                        onChange={(date) => {
                            if (date instanceof Date && !isNaN(date)) {
                                // Format in local time to YYYY-MM-DD
                                const year = date.getFullYear();
                                const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
                                const day = String(date.getDate()).padStart(2, "0");

                                const formattedDate = `${year}-${month}-${day}`;
                                setPlacementDate(formattedDate);
                            } else {
                                setPlacementDate("");
                                console.warn("Invalid date selected:", date);
                            }
                        }}
                    />

                    <div className="mb-2 block">
                        <Label htmlFor="datepicker2">Date of Dismissal</Label>
                    </div>
                    <Datepicker
                        selected={dismissalDate ? new Date(dismissalDate) : null}
                        onChange={(date) => {
                            if (date instanceof Date && !isNaN(date)) {
                                // Format in local time to YYYY-MM-DD
                                const year = date.getFullYear();
                                const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
                                const day = String(date.getDate()).padStart(2, "0");

                                const formattedDate = `${year}-${month}-${day}`;
                                setDismissalDate(formattedDate);
                            } else {
                                setDismissalDate("");
                                console.warn("Invalid date selected:", date);
                            }
                        }}
                    />
                </div>

                {/* Right Column */}
                <Tabs aria-label="Tabs with underline" variant="underline">
                    <TabItem active title="General">
                        <div className="space-y-6">
                            <div className=" rounded-lg p-6 shadow-sm space-y-6 bg-[#F9FAFB] dark:bg-gray-800">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="first_name">First Name</Label>
                                        <TextInput id="name" placeholder="First Name"/>
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="last_name">Last Name</Label>
                                        <TextInput id="name" placeholder="Last Name"/>
                                    </div>
                                    <div>
                                        <div className="mb-1 block">
                                            <Label htmlFor="dob">Date of Birth</Label>
                                        </div>
                                        <Datepicker
                                            selected={dob ? new Date(dob) : null}
                                            onChange={(date) => {
                                                if (date instanceof Date && !isNaN(date)) {
                                                    // Format in local time to YYYY-MM-DD
                                                    const year = date.getFullYear();
                                                    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
                                                    const day = String(date.getDate()).padStart(2, "0");

                                                    const formattedDate = `${year}-${month}-${day}`;
                                                    setDob(formattedDate);
                                                } else {
                                                    setDob("");
                                                    console.warn("Invalid date selected:", date);
                                                }
                                            }}
                                        />
                                    </div>

                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="gender">Gender</Label>
                                        <Select
                                            id="gender"
                                            options={genderOptions}
                                            value={gender}
                                            onChange={setGender}
                                            placeholder="Select gender..."
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            styles={reactSelectHeightFix}
                                        />
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
                                    <TextInput id="address" type="text" placeholder="Write address here..."/>
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
                                                            reactSelectHeightFix
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
                                                    placeholder="Select an option"
                                                    options={operatorOptions}
                                                    className="height-[42px] dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                                    styles={reactSelectHeightFix}
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
                            </div>

                            <div className="rounded-lg p-6 shadow-sm space-y-6 bg-[#F9FAFB] dark:bg-gray-800">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="first_name">First Name</Label>
                                        <TextInput id="name" placeholder="First Name"/>
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="last_name">Last Name</Label>
                                        <TextInput id="name" placeholder="Last Name"/>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                                {/* Email */}
                                <div className="flex flex-col space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <TextInput id="email" type="email" placeholder="john@example.com"/>
                                </div>

                                {/* Position */}
                                <div className="flex flex-col space-y-2">
                                    <Label htmlFor="position">Position</Label>
                                    <TextInput id="position" placeholder="Position"/>
                                </div>

                                {/* Department */}
                                <div className="flex flex-col space-y-2 md:col-span-2">
                                    <Label htmlFor="department">Department</Label>
                                    <TextInput id="department" placeholder="Department"/>
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
                                        <TextInput id="work_name" placeholder="Work Name"/>
                                    </div>

                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="work_email">Work Email</Label>
                                        <TextInput id="work_email" placeholder="Work Email"/>
                                    </div>
                                </div>
                            </div>

                            <div className=" rounded-lg p-6 shadow-sm space-y-6 bg-[#F9FAFB] dark:bg-gray-800">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 ">
                                    <div>
                                        <label className="block mb-1 font-medium">Start Time</label>
                                        <input
                                            type="time"
                                            className="w-full border rounded px-2 py-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 font-medium">End Time</label>
                                        <input
                                            type="time"
                                            className="w-full border rounded px-2 py-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 font-medium">Workdays</label>
                                        <Select
                                            isMulti
                                            options={SHIFT_DAY_OPTIONS}
                                            // value={SHIFT_DAY_OPTIONS.filter(opt => filters.shift_day.includes(opt.value))}
                                            // onChange={selected => handleFilterChange("shift_day", selected?.map(opt => opt.value) || [])}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            placeholder="Select Workdays"
                                            // styles={reactSelectHeightFix}
                                        />
                                    </div>
                                    <div className="flex items-end gap-2 self-end">
                                        <Button
                                            color="failure"
                                            onClick={() => remove(index)}
                                            size="xs"
                                            className="flex items-center justify-center h-[42px] w-[42px] rounded-lg border bg-red-700 hover:bg-red-800 text-white text-lg"
                                        >
                                            −
                                        </Button>

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

                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                                <div>
                                    <div className="mb-1 block">
                                        <Label htmlFor="dob">Date of Placement</Label>
                                    </div>
                                    <Datepicker
                                        selected={dob ? new Date(dob) : null}
                                        onChange={(date) => {
                                            if (date instanceof Date && !isNaN(date)) {
                                                // Format in local time to YYYY-MM-DD
                                                const year = date.getFullYear();
                                                const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
                                                const day = String(date.getDate()).padStart(2, "0");

                                                const formattedDate = `${year}-${month}-${day}`;
                                                setDob(formattedDate);
                                            } else {
                                                setDob("");
                                                console.warn("Invalid date selected:", date);
                                            }
                                        }}
                                    />
                                </div>
                                <div>
                                    <div className="mb-1 block">
                                        <Label htmlFor="dob">Date of Dismissal</Label>
                                    </div>
                                    <Datepicker
                                        selected={dob ? new Date(dob) : null}
                                        onChange={(date) => {
                                            if (date instanceof Date && !isNaN(date)) {
                                                // Format in local time to YYYY-MM-DD
                                                const year = date.getFullYear();
                                                const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
                                                const day = String(date.getDate()).padStart(2, "0");

                                                const formattedDate = `${year}-${month}-${day}`;
                                                setDob(formattedDate);
                                            } else {
                                                setDob("");
                                                console.warn("Invalid date selected:", date);
                                            }
                                        }}
                                    />

                                </div>

                            </div>
                        </div>
                    </TabItem>
                    <TabItem title="Files">
                        <div className=" rounded-lg p-6 shadow-sm space-y-6 bg-[#F9FAFB] dark:bg-gray-800">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">

                            <div className="flex flex-col gap-2">
                                <div id="fileUpload" className="max-w-md">
                                    <Label className="mb-2 block" htmlFor="file">
                                        Upload file
                                    </Label>
                                    <FileInput id="file"/>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">Select file type</label>
                                <Select
                                    id="file-type"
                                    options={employeeFilesOptions}
                                    value={employeeFiles}
                                    onChange={setEmployeeFiles}
                                    placeholder="Select an option..."
                                    // styles={reactSelectHeightFix}
                                />
                            </div>
                            <div className="flex items-end gap-2 self-end">
                                <Button
                                    color="failure"
                                    onClick={() => remove(index)}
                                    size="xs"
                                    className="flex items-center justify-center h-[42px] w-[42px] rounded-lg border bg-red-700 hover:bg-red-800 text-white text-lg"
                                >
                                    −
                                </Button>

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

                        </div>

                        </div>
                    </TabItem>
                    <TabItem title="Documents">
                        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white dark:bg-gray-800">
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
                                    <TableHeadCell className="font-semibold text-gray-700 dark:text-gray-200 text-center">
                                        Nr Documents
                                    </TableHeadCell>
                                    <TableHeadCell className="text-center font-semibold text-gray-700 dark:text-gray-200">
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
                                                <TableCell className="text-center">
                                                    <Tooltip content="Upload document">
                                                        <Button
                                                            color="gray"
                                                            size="xs"
                                                            onClick={() => handleUpload(template.id)}
                                                        >
                                                            <HiUpload className="w-4 h-4" />
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
                    </TabItem>
                    <TabItem title="Day Off">


                    </TabItem>
                </Tabs>

            </div>

            <div className="flex justify-end mt-6">
                <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                    Save Employee
                </button>
            </div>
        </div>
    );
}